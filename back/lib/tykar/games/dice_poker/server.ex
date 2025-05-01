defmodule Tykar.Games.DicePoker.Server do
  use GenServer, restart: :transient

  alias Tykar.Games.DicePoker

  def start_link(roomId) when is_binary(roomId) do
    GenServer.start_link(__MODULE__, roomId, name: {:via, Registry, {Tykar.GameRegistry, roomId}})
  end

  @impl true
  def init(roomId) do
    IO.puts("Room " <> roomId <> " GenServer started.")
    {:ok, _} = TykarWeb.Presence.track(self(), "dice_poker:lobby", roomId, %{})
    {:ok, %DicePoker{roomId: roomId}}
  end

  @impl true
  def handle_call("game", _from, game) do
    {:reply, game, game}
  end

  @impl true
  def handle_cast({"take_seat", seat, username}, %DicePoker{} = game) do
    case DicePoker.take_seat(game, seat, username) do
      {:ok, new_game} ->
        broadcast_game(new_game)
        {:noreply, new_game}

      :err ->
        {:noreply, game}
    end
  end

  @impl true
  def handle_cast("start", %DicePoker{} = game) do
    case DicePoker.start(game) do
      {:ok, new_game} ->
        broadcast_game(new_game)
        {:noreply, new_game}

      :err ->
        {:noreply, game}
    end
  end

  # @impl true
  # def handle_cast({"play", %Card{} = card, username}, %Makao{} = makao) do
  #   case Makao.handle_play(makao, card, username) do
  #     {:ok, new_makao} ->
  #       broadcast_game(new_makao)
  #       {:noreply, new_makao}
  #
  #     :err ->
  #       {:noreply, makao}
  #   end
  # end
  #
  # @impl true
  # def handle_cast({"demand", demand, username}, makao) do
  #   case Makao.handle_demand(makao, demand, username) do
  #     {:ok, new_makao} ->
  #       broadcast_game(new_makao)
  #       {:noreply, new_makao}
  #
  #     :err ->
  #       {:noreply, makao}
  #   end
  # end
  #
  # @impl true
  # def handle_cast({"draw", username}, %Makao{} = makao) do
  #   case Makao.handle_draw(makao, username) do
  #     {:ok, new_makao} ->
  #       broadcast_game(new_makao)
  #       {:noreply, new_makao}
  #
  #     :err ->
  #       {:noreply, makao}
  #   end
  # end
  #
  # @impl true
  # def handle_cast({"pass", username}, %Makao{} = makao) do
  #   case Makao.handle_pass(makao, username) do
  #     {:ok, new_makao} ->
  #       broadcast_game(new_makao)
  #       {:noreply, new_makao}
  #
  #     :err ->
  #       {:noreply, makao}
  #   end
  # end
  #
  defp broadcast_game(%DicePoker{} = game) do
    :ok = TykarWeb.Endpoint.broadcast_from!(self(), "dice_poker:" <> game.roomId, "game", game)
  end
end
