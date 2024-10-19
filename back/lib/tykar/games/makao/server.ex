defmodule Tykar.Games.Makao.Server do
  use GenServer, restart: :transient

  alias Tykar.Games.Makao
  alias Tykar.Games.Makao.Player
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
  def handle_cast({"take_seat", seat, player}, %Makao{} = makao) do
    if !seat_taken?(makao, seat) and
         !Enum.any?(makao.players, fn x -> x != nil and x.name == player end) do
      new_makao = %{
        makao
        | players: List.replace_at(makao.players, seat, %Player{name: player, hand: []})
      }

      broadcast_game(new_makao)
      {:noreply, new_makao}
    else
      {:noreply, makao}
    end
  end

  @impl true
  def handle_cast("start", %Makao{} = makao) do
    if Enum.count(makao.players, fn x -> x != nil end) < 2 or makao.status == "in_progress" do
      {:noreply, makao}
    else
      new_players = Enum.map(makao.players, &clear_hands/1)

      new_makao =
        %Makao{roomId: makao.roomId, players: new_players, turn: 0, status: "in_progress"}
        |> shuffle_stock()
        |> draw_cards(5, 0)
        |> draw_cards(5, 1)
        |> draw_cards(5, 2)
        |> draw_cards(5, 3)
        |> draw_first_card()

      broadcast_game(new_makao)
      {:noreply, new_makao}
    end
  end

  @impl true
  def handle_cast({"play", %Card{} = card, username}, %Makao{} = makao) do
    %Player{} = player = Enum.at(makao.players, makao.turn)

    if player.name == username and Enum.member?(player.hand, card) and legal?(makao, card) do
      new_player = %{player | hand: List.delete(player.hand, card)}

      new_makao =
        %{
          makao
          | played: [card | makao.played],
            players: List.replace_at(makao.players, makao.turn, new_player)
        }
        |> next_turn()

      broadcast_game(new_makao)
      {:noreply, new_makao}
    else
      {:noreply, makao}
    end
  end

  @impl true
  def handle_cast({"draw", username}, %Makao{status: "in_progress"} = makao) do
    %Player{} = player = Enum.at(makao.players, makao.turn)

    if player.name == username do
      new_makao =
        makao
        |> draw_cards(1, makao.turn)
        |> next_turn()

      broadcast_game(new_makao)
      {:noreply, new_makao}
    else
      {:noreply, makao}
    end
  end

  @impl true
  def handle_cast({"draw", _username}, %Makao{} = makao) do
    {:noreply, makao}
  end

  defp broadcast_game(%Makao{} = makao) do
    :ok = TykarWeb.Endpoint.broadcast_from!(self(), "makao:" <> makao.roomId, "game", makao)
  end

  defp draw_cards(%Makao{} = makao, count, seat) do
    if seat_taken?(makao, seat) do
      if out_of_stock?(makao, count) do
        draw_cards(restock(makao), count, seat)
      else
        %Player{} = player = Enum.at(makao.players, seat)
        drawn = Enum.take(makao.stock, count)
        new_stock = Enum.drop(makao.stock, count)

        new_player = %{player | hand: drawn ++ player.hand}
        new_players = List.replace_at(makao.players, seat, new_player)
        %{makao | players: new_players, stock: new_stock}
      end
    else
      makao
    end
  end

  defp draw_first_card(%Makao{} = makao) do
    {drawn, new_stock} = List.pop_at(makao.stock, 0)

    new_played = [drawn | makao.played]
    %{makao | played: new_played, stock: new_stock}
  end

  defp out_of_stock?(%Makao{} = makao, needed) do
    Enum.count(makao.stock) < needed
  end

  defp restock(%Makao{} = makao) do
    [new_played | new_stock] = makao.played
    %{makao | played: [new_played], stock: new_stock}
  end

  defp seat_taken?(%Makao{} = makao, seat) do
    Enum.at(makao.players, seat) != nil
  end

  defp clear_hands(%Player{} = player) do
    %{player | hand: []}
  end

  defp clear_hands(nil) do
    nil
  end

  defp legal?(%Makao{} = makao, %Card{} = card) do
    last_played = List.first(makao.played)
    card.rank == last_played.rank or card.suit == last_played.suit
  end

  defp next_turn(%Makao{} = makao) do
    new_makao = %{makao | turn: rem(makao.turn + 1, 4)}

    if Enum.at(makao.players, rem(makao.turn + 1, 4)) == nil do
      next_turn(new_makao)
    else
      new_makao
    end
  end

  defp shuffle_stock(%Makao{} = makao) do
    %{makao | stock: Enum.shuffle(makao.stock)}
  end
end
