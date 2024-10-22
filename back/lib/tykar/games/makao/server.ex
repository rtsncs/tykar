defmodule Tykar.Games.Makao.Server do
  use GenServer, restart: :transient

  alias Tykar.Games.Makao
  alias Tykar.Games.Card

  def start_link(roomId) when is_binary(roomId) do
    GenServer.start_link(__MODULE__, roomId, name: {:via, Registry, {Tykar.GameRegistry, roomId}})
  end

  @impl true
  def init(roomId) do
    IO.puts("Room " <> roomId <> " GenServer started.")
    {:ok, _} = TykarWeb.Presence.track(self(), "makao:lobby", roomId, %{})
    {:ok, %Makao{roomId: roomId}}
  end

  @impl true
  def handle_call("game", _from, makao) do
    {:reply, makao, makao}
  end

  @impl true
  def handle_cast({"take_seat", seat, username}, %Makao{} = makao) do
    case Makao.take_seat(makao, seat, username) do
      {:ok, new_makao} ->
        broadcast_game(new_makao)
        {:noreply, new_makao}

      :err ->
        {:noreply, makao}
    end
  end

  @impl true
  def handle_cast("start", %Makao{} = makao) do
    case Makao.start(makao) do
      {:ok, new_makao} ->
        broadcast_game(new_makao)
        {:noreply, new_makao}

      :err ->
        {:noreply, makao}
    end
  end

  @impl true
  def handle_cast({"play", %Card{} = card, username}, %Makao{} = makao) do
    case Makao.handle_play(makao, card, username) do
      {:ok, new_makao} ->
        broadcast_game(new_makao)
        {:noreply, new_makao}

      :err ->
        {:noreply, makao}
    end
  end

  @impl true
  def handle_cast({"demand", demand, username}, makao) do
    case Makao.handle_demand(makao, demand, username) do
      {:ok, new_makao} ->
        broadcast_game(new_makao)
        {:noreply, new_makao}

      :err ->
        {:noreply, makao}
    end
  end

  @impl true
  def handle_cast({"draw", username}, %Makao{} = makao) do
    case Makao.handle_draw(makao, username) do
      {:ok, new_makao} ->
        broadcast_game(new_makao)
        {:noreply, new_makao}

      :err ->
        {:noreply, makao}
    end
  end

  @impl true
  def handle_cast({"pass", username}, %Makao{} = makao) do
    case Makao.handle_pass(makao, username) do
      {:ok, new_makao} ->
        broadcast_game(new_makao)
        {:noreply, new_makao}

      :err ->
        {:noreply, makao}
    end
  end

  defp broadcast_game(%Makao{} = makao) do
    :ok = TykarWeb.Endpoint.broadcast_from!(self(), "makao:" <> makao.roomId, "game", makao)
  end
end
