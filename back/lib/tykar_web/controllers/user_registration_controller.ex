defmodule TykarWeb.UserRegistrationController do
  use TykarWeb, :controller
  use OpenApiSpex.ControllerSpecs

  alias Tykar.Accounts
  alias TykarWeb.UserAuth
  alias TykarWeb.Schemas.{RegisterRequest, RegisterError}

  action_fallback TykarWeb.FallbackController

  operation :create,
    operation_id: "register",
    request_body:
      {"User credentials", "application/x-www-form-urlencoded", RegisterRequest, required: true},
    responses: [
      no_content: "",
      unprocessable_entity: {"Register error", "application/json", RegisterError}
    ]

  def create(conn, user_params) do
    with {:ok, user} <- Accounts.register_user(user_params) do
      Accounts.deliver_user_confirmation_instructions(
        user,
        &unverified_url(Application.get_env(:tykar, :front_url), "/confirm/#{&1}")
      )

      conn
      |> UserAuth.log_in_user(user)
    end
  end
end
