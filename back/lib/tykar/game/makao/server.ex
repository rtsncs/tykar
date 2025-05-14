defmodule Tykar.Game.Makao.Server do
  use Tykar.Game.GenGameServer, channel_name: "makao", game: Tykar.Game.Makao
  require Logger

  alias Tykar.Game.Makao
  alias Tykar.Game.Card

  @impl true
  def handle_cast({"play", username, %{"card" => card_map}}, game) do
    card = Card.from_map(card_map)

    case Makao.handle_play(game, card, username) do
      {:ok, new_game} -> broadcast_game(new_game)
      :error -> {:noreply, game}
    end
  end

  @impl true
  def handle_cast({"demand", username, %{"demand" => demand}}, game) do
    case Makao.handle_demand(game, demand, username) do
      {:ok, new_game} -> broadcast_game(new_game)
      :error -> {:noreply, game}
    end
  end

  @impl true
  def handle_cast({"draw", username, _}, %Makao{} = game) do
    case Makao.handle_draw(game, username) do
      {:ok, new_game} -> broadcast_game(new_game)
      :error -> {:noreply, game}
    end
  end

  @impl true
  def handle_cast({"pass", username, _}, %Makao{} = game) do
    case Makao.handle_pass(game, username) do
      {:ok, new_game} -> broadcast_game(new_game)
      :error -> {:noreply, game}
    end
  end

  @impl true
  def handle_cast(msg, game) do
    Logger.warning("invalid message: #{inspect(msg)}")
    {:noreply, game}
  end
end


