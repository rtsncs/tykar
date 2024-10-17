defmodule Tykar.Games.Makao.State do
  @derive {Jason.Encoder, except: [:stock]}
  defstruct [
    :roomId,
    players: List.duplicate(nil, 4),
    status: "before",
    turn: -1,
    stock: Tykar.Games.deck(),
    played: []
  ]
end

defmodule Tykar.Games.Makao.Player do
  @derive Jason.Encoder
  defstruct [
    :name,
    hand: []
  ]
end

defmodule Tykar.Games.Makao do
  use GenServer, restart: :transient

  alias Tykar.Games.Makao.State
  alias Tykar.Games.Makao.Player
  alias Tykar.Games.Card

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
  def handle_cast({"take_seat", seat, player}, %State{} = state) do
    if !seat_taken?(state, seat) and
         !Enum.any?(state.players, fn x -> x != nil and x.name == player end) do
      new_state = %{
        state
        | players: List.replace_at(state.players, seat, %Player{name: player, hand: []})
      }

      broadcast_game(new_state)
      {:noreply, new_state}
    else
      {:noreply, state}
    end
  end

  @impl true
  def handle_cast("start", %State{} = state) do
    if Enum.count(state.players, fn x -> x != nil end) < 2 or state.status == "in_progress" do
      {:noreply, state}
    else
      new_players = Enum.map(state.players, &clear_hands/1)

      new_state =
        %State{roomId: state.roomId, players: new_players, turn: 0, status: "in_progress"}
        |> shuffle_stock()
        |> draw_cards(5, 0)
        |> draw_cards(5, 1)
        |> draw_cards(5, 2)
        |> draw_cards(5, 3)
        |> draw_first_card()

      broadcast_game(new_state)
      {:noreply, new_state}
    end
  end

  @impl true
  def handle_cast({"play", %Card{} = card, username}, %State{} = state) do
    %Player{} = player = Enum.at(state.players, state.turn)

    if player.name == username and Enum.member?(player.hand, card) and legal?(state, card) do
      new_player = %{player | hand: List.delete(player.hand, card)}

      new_state =
        %{
          state
          | played: [card | state.played],
            players: List.replace_at(state.players, state.turn, new_player)
        }
        |> next_turn()

      broadcast_game(new_state)
      {:noreply, new_state}
    else
      {:noreply, state}
    end
  end

  @impl true
  def handle_cast({"draw", username}, %State{status: "in_progress"} = state) do
    %Player{} = player = Enum.at(state.players, state.turn)

    if player.name == username do
      new_state =
        state
        |> draw_cards(1, state.turn)
        |> next_turn()

      broadcast_game(new_state)
      {:noreply, new_state}
    else
      {:noreply, state}
    end
  end

  @impl true
  def handle_cast({"draw", _username}, %State{} = state) do
    {:noreply, state}
  end

  defp broadcast_game(%State{} = state) do
    :ok = TykarWeb.Endpoint.broadcast_from!(self(), "makao:" <> state.roomId, "game", state)
  end

  defp draw_cards(%State{} = state, count, seat) do
    if seat_taken?(state, seat) do
      if out_of_stock?(state, count) do
        draw_cards(restock(state), count, seat)
      else
        %Player{} = player = Enum.at(state.players, seat)
        drawn = Enum.take(state.stock, count)
        new_stock = Enum.drop(state.stock, count)

        new_player = %{player | hand: drawn ++ player.hand}
        new_players = List.replace_at(state.players, seat, new_player)
        %{state | players: new_players, stock: new_stock}
      end
    else
      state
    end
  end

  defp draw_first_card(%State{} = state) do
    {drawn, new_stock} = List.pop_at(state.stock, 0)

    new_played = [drawn | state.played]
    %{state | played: new_played, stock: new_stock}
  end

  defp out_of_stock?(%State{} = state, needed) do
    Enum.count(state.stock) < needed
  end

  defp restock(%State{} = state) do
    [new_played | new_stock] = state.played
    %{state | played: [new_played], stock: new_stock}
  end

  defp seat_taken?(%State{} = state, seat) do
    Enum.at(state.players, seat) != nil
  end

  defp clear_hands(%Player{} = player) do
    %{player | hand: []}
  end

  defp clear_hands(nil) do
    nil
  end

  defp legal?(%State{} = state, %Card{} = card) do
    last_played = List.first(state.played)
    card.rank == last_played.rank or card.suit == last_played.suit
  end

  defp next_turn(%State{} = state) do
    new_state = %{state | turn: rem(state.turn + 1, 4)}

    if Enum.at(state.players, rem(state.turn + 1, 4)) == nil do
      next_turn(new_state)
    else
      new_state
    end
  end

  defp shuffle_stock(%State{} = state) do
    %{state | stock: Enum.shuffle(state.stock)}
  end
end
