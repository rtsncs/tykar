defmodule TykarWeb.UserSettingsController do
  use TykarWeb, :controller
  use OpenApiSpex.ControllerSpecs

  alias Tykar.Accounts
  alias TykarWeb.UserAuth

  alias TykarWeb.Schemas.{
    UpdateEmailRequest,
    UpdateEmailError,
    UpdatePasswordRequest,
    UpdatePasswordError
  }

  action_fallback TykarWeb.FallbackController

  plug :assign_email_and_password_changesets

  operation :update_email,
    security: [%{"cookie" => []}],
    request_body:
      {"Email update", "application/x-www-form-urlencoded", UpdateEmailRequest, required: true},
    responses: [
      no_content: "",
      unprocessable_entity: {"Validation error", "application/json", UpdateEmailError}
    ]

  def update_email(conn, params) do
    %{"current_password" => password, "email" => email} = params
    user = conn.assigns.current_user

    with {:ok, applied_user} <- Accounts.apply_user_email(user, password, %{email: email}) do
      Accounts.deliver_user_update_email_instructions(
        applied_user,
        user.email,
        &url(~p"/users/settings/confirm_email/#{&1}")
      )

      conn |> send_resp(:no_content, "")
    end
  end

  operation :update_password,
    security: [%{"cookie" => []}],
    request_body:
      {"Password update", "application/x-www-form-urlencoded", UpdatePasswordRequest,
       required: true},
    responses: [
      no_content: "",
      unprocessable_entity: {"Validation error", "application/json", UpdatePasswordError}
    ]

  def update_password(conn, params) do
    %{"current_password" => current_password, "password" => new_password} = params

    with user = conn.assigns.current_user do
      with {:ok, _} <-
             Accounts.update_user_password(user, current_password, %{password: new_password}) do
        conn
        |> UserAuth.log_in_user(user)
      end
    end
  end

  def confirm_email(conn, %{"token" => token}) do
    case Accounts.update_user_email(conn.assigns.current_user, token) do
      :ok ->
        conn
        |> put_flash(:info, "Email changed successfully.")
        |> redirect(to: ~p"/users/settings")

      :error ->
        conn
        |> put_flash(:error, "Email change link is invalid or it has expired.")
        |> redirect(to: ~p"/users/settings")
    end
  end

  defp assign_email_and_password_changesets(conn, _opts) do
    user = conn.assigns.current_user

    conn
    |> assign(:email_changeset, Accounts.change_user_email(user))
    |> assign(:password_changeset, Accounts.change_user_password(user))
  end
end
