defmodule TykarWeb.UserConfirmationController do
  use TykarWeb, :controller
  use OpenApiSpex.ControllerSpecs

  alias Tykar.Accounts

  # def create(conn, %{"user" => %{"email" => email}}) do
  #   if user = Accounts.get_user_by_email(email) do
  #     Accounts.deliver_user_confirmation_instructions(
  #       user,
  #       &url(~p"/users/confirm/#{&1}")
  #     )
  #   end
  #
  #   conn
  #   |> put_flash(
  #     :info,
  #     "If your email is in our system and it has not been confirmed yet, " <>
  #       "you will receive an email with instructions shortly."
  #   )
  #   |> redirect(to: ~p"/")
  # end

  operation :update,
    parameters: [token: [in: :path, type: :string]],
    responses: [
      no_content: "",
      unprocessable_entity: "Invalid or expired token"
    ]

  # Do not log in the user after confirmation to avoid a
  # leaked token giving the user access to the account.
  def update(conn, %{"token" => token}) do
    case Accounts.confirm_user(token) do
      {:ok, _} ->
        conn |> send_resp(:no_content, "")

      :error ->
        {:error, :unprocessable_entity}
    end
  end
end
