use anyhow::{Context, Result};
use argon2::{password_hash::SaltString, Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use axum::{http::StatusCode, response::IntoResponse, Extension, Form};
use serde::Deserialize;
use sqlx::PgPool;
use thiserror::Error;
use utoipa::{OpenApi, ToSchema};
use utoipa_axum::{router::OpenApiRouter, routes};

#[derive(Debug, Deserialize, ToSchema)]
pub struct Credentials {
    username: String,
    password: String,
}

#[derive(utoipa::OpenApi)]
#[openapi(components(schemas(Credentials)))]
struct AuthApi;

pub fn router() -> OpenApiRouter {
    OpenApiRouter::with_openapi(AuthApi::openapi())
        .routes(routes!(register))
        .routes(routes!(login))
}

#[derive(Debug, Error)]
enum AuthError {
    #[error("invalid username")]
    InvalidUsername,
    #[error("invalid password")]
    InvalidPassword,
    #[error(transparent)]
    Other(#[from] anyhow::Error),
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
        None => return Err(AuthError::InvalidUsername),
    };

    let expected_password_hash =
        PasswordHash::new(&expected_password_hash).context("Failed to parse hash")?;

    Argon2::default()
        .verify_password(credentials.password.as_bytes(), &expected_password_hash)
        .map_err(|_| AuthError::InvalidPassword)?;

    return Ok(user_id);
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
    responses((status = OK, description = "Success"), (status = UNAUTHORIZED, description = "Invalid credentials"))
)]
async fn login(
    Extension(pool): Extension<PgPool>,
    Form(credentials): Form<Credentials>,
) -> impl IntoResponse {
    match validate_credentials(credentials, &pool).await {
        Ok(_) => StatusCode::OK,
        Err(AuthError::InvalidUsername | AuthError::InvalidPassword) => StatusCode::UNAUTHORIZED,
        Err(AuthError::Other(_)) => StatusCode::INTERNAL_SERVER_ERROR,
    }
}
