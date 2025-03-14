defmodule TykarWeb.UserSessionController do
  use TykarWeb, :controller
  use OpenApiSpex.ControllerSpecs

  alias Tykar.Accounts
  alias TykarWeb.UserAuth
  alias TykarWeb.Schemas.{LoginRequest, CurrentUserResponse}

  action_fallback TykarWeb.FallbackController

  operation :create,
    operation_id: "login",
    request_body:
      {"User credentials", "application/x-www-form-urlencoded", LoginRequest, required: true},
    responses: [no_content: ""]

  def create(
        conn,
        %{"email_or_username" => email_or_username, "password" => password} = user_params
      ) do
    if user = Accounts.get_user_by_credentials(email_or_username, password) do
      conn
      |> UserAuth.log_in_user(user, user_params)
    else
      conn
      |> send_resp(:unauthorized, "")
    end
  end

  operation :show,
    operation_id: "current_user",
    responses: [
      ok: {"Current user", "application/json", CurrentUserResponse},
      no_content: ""
    ]

  def show(conn, _params) do
    if user = conn.assigns[:current_user] do
      token = Phoenix.Token.sign(conn, "user session", user.id)

      conn
      |> json(%CurrentUserResponse{
        id: user.id,
        email: user.email,
        username: user.username,
        token: token
      })
    else
      conn |> send_resp(:no_content, "")
    end
  end

  operation :delete,
    operation_id: "logout",
    responses: [no_content: ""]

  def delete(conn, _params) do
    conn
    |> UserAuth.log_out_user()
  end
end
