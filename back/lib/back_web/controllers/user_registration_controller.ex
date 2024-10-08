defmodule TykarBackWeb.UserRegistrationController do
  use TykarBackWeb, :controller
  use OpenApiSpex.ControllerSpecs

  alias TykarBack.Accounts
  alias TykarBackWeb.UserAuth
  alias TykarBackWeb.Schemas.{RegisterRequest, RegisterError}

  action_fallback TykarBackWeb.FallbackController

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
        &url(~p"/users/confirm/#{&1}")
      )

      conn
      |> UserAuth.log_in_user(user)
    end
  end
end
