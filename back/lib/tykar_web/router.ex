defmodule TykarWeb.Router do
  use TykarWeb, :router

  import TykarWeb.UserAuth

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :fetch_current_user
    plug OpenApiSpex.Plug.PutApiSpec, module: TykarWeb.ApiSpec
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug :fetch_session
    plug :fetch_current_user
  end

  pipeline :api_forms do
    plug :accepts, ["html"]
    plug :put_format, "json"
    plug :fetch_session
    plug :fetch_current_user
  end

  scope "/api", TykarWeb do
    pipe_through :api
    get "/users/current", UserSessionController, :show
    delete "/users/log_out", UserSessionController, :delete
    post "/users/confirm/:token", UserConfirmationController, :update
  end

  scope "/api", TykarWeb do
    pipe_through [:api, :require_authenticated_user]
    post "/users/settings/confirm_email/:token", UserSettingsController, :confirm_email
  end

  scope "/api" do
    pipe_through :api
  end

  scope "/api", TykarWeb do
    pipe_through :api_forms
    post "/users/register", UserRegistrationController, :create
    post "/users/log_in", UserSessionController, :create
    # post "/users/reset_password", UserResetPasswordController, :create
  end

  scope "/api", TykarWeb do
    pipe_through [:api_forms, :require_authenticated_user]
    patch "/users/settings/email", UserSettingsController, :update_email
    patch "/users/settings/password", UserSettingsController, :update_password
  end

  # Enable Swagger, LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:tykar, :dev_routes) do
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: TykarWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
      get "/openapi", OpenApiSpex.Plug.RenderSpec, :show
      get "/swagger", OpenApiSpex.Plug.SwaggerUI, path: "/dev/openapi"
    end
  end

  ## Authentication routes

  scope "/", TykarWeb do
    pipe_through [:browser]

    # get "/users/reset_password", UserResetPasswordController, :new
    # post "/users/reset_password", UserResetPasswordController, :create
    # get "/users/reset_password/:token", UserResetPasswordController, :edit
    # put "/users/reset_password/:token", UserResetPasswordController, :update
  end
end
