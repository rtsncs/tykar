defmodule TykarBackWeb.Router do
  use TykarBackWeb, :router

  import TykarBackWeb.UserAuth

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :fetch_current_user
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug :fetch_session
    plug :fetch_current_user
    plug OpenApiSpex.Plug.PutApiSpec, module: TykarBackWeb.ApiSpec
  end

  pipeline :api_forms do
    plug :accepts, ["html"]
    plug :put_format, "json"
    plug :fetch_session
    plug :fetch_current_user
  end

  scope "/" do
    pipe_through :browser
    get "/", OpenApiSpex.Plug.SwaggerUI, path: "/api/openapi"
  end

  # Other scopes may use custom stacks.
  scope "/api", TykarBackWeb do
    pipe_through :api
    get "/users/current", UserSessionController, :show
    delete "/users/log_out", UserSessionController, :delete
  end

  scope "/api" do
    pipe_through :api
    get "/openapi", OpenApiSpex.Plug.RenderSpec, :show
  end

  scope "/api", TykarBackWeb do
    pipe_through :api_forms
    post "/users/register", UserRegistrationController, :create
    post "/users/log_in", UserSessionController, :create
    post "/users/reset_password", UserResetPasswordController, :create
  end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:back, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: TykarBackWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end

  ## Authentication routes

  scope "/", TykarBackWeb do
    pipe_through [:browser]

    # get "/users/register", UserRegistrationController, :new
    # post "/users/register", UserRegistrationController, :create
    # get "/users/log_in", UserSessionController, :new
    # post "/users/log_in", UserSessionController, :create
    # get "/users/reset_password", UserResetPasswordController, :new
    # post "/users/reset_password", UserResetPasswordController, :create
    # get "/users/reset_password/:token", UserResetPasswordController, :edit
    # put "/users/reset_password/:token", UserResetPasswordController, :update
  end

  # scope "/", TykarBackWeb do
  #   pipe_through [:browser, :require_authenticated_user]
  #
  #   get "/users/settings", UserSettingsController, :edit
  #   put "/users/settings", UserSettingsController, :update
  #   get "/users/settings/confirm_email/:token", UserSettingsController, :confirm_email
  # end

  # scope "/", TykarBackWeb do
  #   pipe_through [:browser]
  #
  #   # delete "/users/log_out", UserSessionController, :delete
  #   get "/users/confirm", UserConfirmationController, :new
  #   post "/users/confirm", UserConfirmationController, :create
  #   get "/users/confirm/:token", UserConfirmationController, :edit
  #   post "/users/confirm/:token", UserConfirmationController, :update
  # end
end
