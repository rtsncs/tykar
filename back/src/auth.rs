use anyhow::{anyhow, Context, Result};
use argon2::{password_hash::SaltString, Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use axum::{http::StatusCode, response::IntoResponse, Extension, Form};
use serde::Deserialize;
use sqlx::PgPool;
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

async fn validate_credentials(credentials: Credentials, pool: &PgPool) -> Result<i64> {
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
        None => return Err(anyhow!("Unknown username.")),
    };

    let expected_password_hash =
        PasswordHash::new(&expected_password_hash).context("Failed to parse hash")?;

    Argon2::default()
        .verify_password(credentials.password.as_bytes(), &expected_password_hash)
        .context("Invalid password.")?;

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
    responses((status = OK, description = "Success"))
)]
async fn login(
    Extension(pool): Extension<PgPool>,
    Form(credentials): Form<Credentials>,
) -> impl IntoResponse {
    match validate_credentials(credentials, &pool).await {
        Ok(_) => StatusCode::OK,
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR,
    }
}
