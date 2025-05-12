defmodule TykarWeb.MakaoChannel do
  use TykarWeb.Channels.GenGameChannel, channel_name: "makao"

  alias Tykar.Game.Makao

  intercept ["game"]

  @impl true
  def handle_out("game", %Makao{} = state, socket) do
    push(socket, "game", state |> Makao.hide_other_players_cards(get_assigned_username(socket)))
    {:noreply, socket}
  end
end
