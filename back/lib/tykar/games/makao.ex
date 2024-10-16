defmodule Tykar.Games.Makao.State do
  @derive Jason.Encoder
  defstruct [
    :roomId,
    players: List.duplicate(nil, 4),
    turn: -1,
    hands: List.duplicate([], 4),
    stock: [],
    played: []
  ]
end

defmodule Tykar.Games.Makao do
  use GenServer, restart: :transient

  alias Tykar.Games.Makao.State

  def start_link(roomId) when is_binary(roomId) do
    GenServer.start_link(__MODULE__, roomId, name: {:via, Registry, {Tykar.GameRegistry, roomId}})
  end

  @impl true
  def init(roomId) do
    IO.puts("Room " <> roomId <> " GenServer started.")
    {:ok, _} = TykarWeb.Presence.track(self(), "makao:lobby", roomId, %{})
    {:ok, %State{roomId: roomId}}
  end

  @impl true
  def handle_call("game", _from, state) do
    {:reply, state, state}
  end

  @impl true
  def handle_cast({"take_seat", seat, username}, %State{} = state) do
    if not Enum.member?(state.players, username) and Enum.at(state.players, seat) == nil do
      new_state = %{state | players: List.replace_at(state.players, seat, username)}
      broadcast_game(new_state)
      {:noreply, new_state}
    else
      {:noreply, state}
    end
  end

  defp broadcast_game(%State{} = state) do
    :ok = TykarWeb.Endpoint.broadcast_from!(self(), "makao:" <> state.roomId, "game", state)
  end
end
