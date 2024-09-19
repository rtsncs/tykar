mod auth;

use anyhow::Context;
use axum::Extension;
use sqlx::postgres::PgPoolOptions;
use tokio::net::TcpListener;
use tower_http::{
    cors::{Any, CorsLayer},
    trace::TraceLayer,
};
//use tracing::instrument::WithSubscriber;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use utoipa::OpenApi;
use utoipa_axum::{router::OpenApiRouter, routes};

#[derive(OpenApi)]
struct Api;

#[utoipa::path(
    get,
    operation_id = "health",
    path = "/health",
    responses((status = OK, description = "Success", body = str, content_type = "text/plain"))
)]
async fn health() -> &'static str {
    "ok"
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::registry()
        //.with(tracing_subscriber::EnvFilter::new(
        //    std::env::var("tower_http=trace")
        //        .unwrap_or_else(|_| "example_tracing_aka_logging=debug,tower_http=debug".into()),
        //))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let database_url = "postgresql://localhost:5432/tykar";
    let db = PgPoolOptions::new()
        .max_connections(50)
        .connect(&database_url)
        .await
        .context("Failed to connect to database")?;

    sqlx::migrate!().run(&db).await?;

    let cors = CorsLayer::new().allow_origin(Any);
    let (router, api) = OpenApiRouter::with_openapi(Api::openapi())
        .routes(routes!(health))
        .merge(auth::router())
        .layer(cors)
        .layer(Extension(db))
        .layer(TraceLayer::new_for_http())
        .split_for_parts();

    let router = router
        .merge(utoipa_swagger_ui::SwaggerUi::new("/swagger").url("/apidoc/openapi.json", api));

    let listener = TcpListener::bind("127.0.0.1:3000").await?;
    axum::serve(listener, router).await?;

    Ok(())
}
