use anyhow::{Context, Result};
use argon2::{password_hash::SaltString, Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use axum::{http::StatusCode, response::IntoResponse, Extension, Form};
use axum_extra::extract::{cookie::Cookie, CookieJar};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use thiserror::Error;
use time::{Duration, OffsetDateTime};
use utoipa::{OpenApi, ToSchema};
use utoipa_axum::{router::OpenApiRouter, routes};

#[derive(Debug, Deserialize, ToSchema)]
struct Credentials {
    username: String,
    password: String,
}

#[derive(Debug, Deserialize, Serialize)]
struct Claims {
    sub: i64,
    exp: usize,
}

#[derive(utoipa::OpenApi)]
#[openapi(components(schemas(Credentials)))]
struct AuthApi;

pub fn router() -> OpenApiRouter {
    OpenApiRouter::with_openapi(AuthApi::openapi())
        .routes(routes!(register))
        .routes(routes!(login))
        .routes(routes!(session))
        .routes(routes!(logout))
}

#[derive(Debug, Error)]
enum AuthError {
    #[error("invalid credentials")]
    InvalidCredentials,
    #[error("missing token cookie")]
    InvalidToken,
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

impl IntoResponse for AuthError {
    fn into_response(self) -> axum::response::Response {
        match self {
            AuthError::InvalidCredentials | AuthError::InvalidToken => {
                StatusCode::UNAUTHORIZED.into_response()
            }
            AuthError::Other(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
        }
    }
}

async fn create_user(credentials: Credentials, pool: &PgPool) -> Result<()> {
    let salt = SaltString::generate(&mut rand::thread_rng());
    let password_hash = Argon2::default()
        .hash_password(credentials.password.as_bytes(), &salt)
        .context("Failed to hash password")?;

    sqlx::query!(
        r#"
        insert into users (username, password)
        values ($1, $2)
        "#,
        credentials.username,
        password_hash.to_string()
    )
    .execute(pool)
    .await
    .context("Failed to store user")?;

    Ok(())
}

async fn validate_credentials(credentials: Credentials, pool: &PgPool) -> Result<i64, AuthError> {
    let row: Option<_> = sqlx::query!(
        r#"
        select id, password
        from users
        where username = $1
        "#,
        credentials.username
    )
    .fetch_optional(pool)
    .await
    .context("Failed to perform query to retrieve stored credentials")?;

    let (expected_password_hash, user_id) = match row {
        Some(row) => (row.password, row.id),
        None => return Err(AuthError::InvalidCredentials),
    };

    let expected_password_hash =
        PasswordHash::new(&expected_password_hash).context("Failed to parse hash")?;

    Argon2::default()
        .verify_password(credentials.password.as_bytes(), &expected_password_hash)
        .map_err(|_| AuthError::InvalidCredentials)?;

    return Ok(user_id);
}

fn create_jwt(user_id: i64) -> Result<Cookie<'static>, AuthError> {
    let expiration = OffsetDateTime::now_utc()
        .checked_add(Duration::days(30))
        .context("Failed to calculate JWT token expiration time.")?;
    let claims = Claims {
        sub: user_id,
        exp: expiration.unix_timestamp() as usize,
    };
    let header = Header::default();
    let token = encode(&header, &claims, &EncodingKey::from_secret(b"test123"))
        .context("Failed to encode JWT token.")?;
    let cookie = Cookie::build(("token", token))
        .secure(true)
        .http_only(true)
        .same_site(axum_extra::extract::cookie::SameSite::Strict)
        .expires(expiration)
        .build();
    Ok(cookie)
}

#[utoipa::path(
    post,
    operation_id = "register",
    path = "/register",
    request_body(content = Credentials, content_type = "application/x-www-form-urlencoded"),
    responses((status = OK, description = "Success"))
)]
async fn register(
    Extension(pool): Extension<PgPool>,
    Form(credentials): Form<Credentials>,
) -> impl IntoResponse {
    //TODO: validation
    match create_user(credentials, &pool).await {
        Ok(_) => StatusCode::OK,
        Err(err) => {
            tracing::error!("{err}");
            StatusCode::INTERNAL_SERVER_ERROR
        }
    }
}

#[utoipa::path(
    post,
    operation_id = "login",
    path = "/login",
    request_body(content = Credentials, content_type = "application/x-www-form-urlencoded"),
    responses(
        (status = OK, description = "Success", headers(("set-cookie" = String, description = "New session token"))),
        (status = UNAUTHORIZED, description = "Invalid credentials")
    )
)]
async fn login(
    jar: CookieJar,
    Extension(pool): Extension<PgPool>,
    Form(credentials): Form<Credentials>,
) -> Result<(StatusCode, CookieJar), AuthError> {
    let user_id = validate_credentials(credentials, &pool).await?;
    let cookie = create_jwt(user_id)?;
    Ok((StatusCode::OK, jar.add(cookie)))
}

#[utoipa::path(get, operation_id = "session", path = "/session", responses((status = OK, body = String, description = "Username" )))]
async fn session(jar: CookieJar, Extension(pool): Extension<PgPool>) -> Result<String, AuthError> {
    let token = jar
        .get("token")
        .map(|c| c.value())
        .ok_or(AuthError::InvalidToken)?;

    if let Ok(token) = decode::<Claims>(
        token,
        &DecodingKey::from_secret(b"test123"),
        &Validation::default(),
    ) {
        let row = sqlx::query!(
            r#"
        select username
        from users
        where id = $1
        "#,
            token.claims.sub
        )
        .fetch_optional(&pool)
        .await
        .context("Failed to perform query to retrieve user")?
        .ok_or(AuthError::InvalidToken)?;

        return Ok(row.username);
    }
    Err(AuthError::InvalidToken)
}

#[utoipa::path(
    post,
    operation_id = "logout",
    path = "/logout",
    responses(
        (status = OK, description = "Success", headers(("set-cookie" = String))),
    )
)]
async fn logout(jar: CookieJar) -> (StatusCode, CookieJar) {
    (StatusCode::OK, jar.remove("token"))
}
