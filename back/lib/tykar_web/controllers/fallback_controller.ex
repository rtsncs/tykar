defmodule TykarWeb.FallbackController do
  @moduledoc """
  Translates controller action results into valid `Plug.Conn` responses.

  See `Phoenix.Controller.action_fallback/1` for more details.
  """
  use TykarWeb, :controller

  def call(conn, {:error, %Ecto.Changeset{} = changeset}) do
    conn
    |> put_status(:unprocessable_entity)
    |> put_view(json: TykarWeb.ChangesetJSON)
    |> render(:error, changeset: changeset)
  end

  def call(conn, {:error, status}) do
    conn
    |> put_status(status)
    |> put_view(json: TykarWeb.ErrorJSON)
    |> render(to_string(Plug.Conn.Status.code(status)) |> String.to_atom())
  end
end
