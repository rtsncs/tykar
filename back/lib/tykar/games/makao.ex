defmodule Tykar.Games.Makao do
  alias Tykar.Games.Makao
  alias Tykar.Games.Makao.Player
  alias Tykar.Games.Card

  @derive {Jason.Encoder, except: [:stock]}
  defstruct [
    :roomId,
    players: List.duplicate(nil, 4),
    status: "setup",
    turn: -1,
    lastTurn: -1,
    stock: Tykar.Games.deck(),
    played: [],
    toDraw: 0,
    toBlock: 0,
    demand: nil,
    demandTurns: 0,
    drawn: nil,
    winners: []
  ]

  defguardp is_functional_card(card)
            when card.rank in ["A", "2", "3", "4", "J"] or
                   (card.rank == "K" and card.suit in ["Spades", "Hearts"])

  defguardp is_rank_demand(demand)
            when demand in ["5", "6", "7", "8", "9", "10", "Q"]

  defguardp is_suit_demand(demand)
            when demand in ["Spades", "Hearts", "Diamonds", "Clubs"]

  defguardp is_new_turn(makao)
            when makao.lastTurn != makao.turn

  def start(%Makao{} = makao) do
    if player_count(makao) < 2 or makao.status == "in_progress" do
      :err
    else
      new_players =
        Enum.map(
          makao.players,
          fn x ->
            if x != nil do
              %{x | blocked: 0, hand: []}
            else
              nil
            end
          end
        )

      new_makao =
        %Makao{roomId: makao.roomId, players: new_players, turn: 0, status: "in_progress"}
        |> shuffle_stock()
        |> deal()

      {:ok, new_makao}
    end
  end

  def take_seat(%Makao{status: "in_progress"}, _seat, _username) do
    :err
  end

  def take_seat(%Makao{} = makao, seat, username) do
    if !seat_taken?(makao, seat) and
         Enum.all?(makao.players, fn x -> x == nil or x.name != username end) do
      {:ok, %{makao | players: List.replace_at(makao.players, seat, %Player{name: username})}}
    else
      :err
    end
  end

  def handle_play(%Makao{status: "in_progress"} = makao, %Card{} = card, username) do
    if players_turn?(makao, username) and !blocked?(makao) and legal?(makao, card) do
      cond do
        is_new_turn(makao) or makao.drawn == nil or
            (makao.drawn == card and card.rank in ["A", "J"]) ->
          {:ok, makao |> play(card) |> finish_action()}

        !is_new_turn(makao) and makao.drawn == card ->
          {:ok, makao |> play(card) |> finish_action |> finish_turn()}

        true ->
          :err
      end
    else
      :err
    end
  end

  def handle_play(_makao, _card, _username) do
    :err
  end

  def handle_demand(%Makao{status: "in_progress"} = makao, demand, username) do
    if players_turn?(makao, username) and !is_new_turn(makao) do
      last_played = List.first(makao.played)

      cond do
        last_played.rank == "A" and demand in ["Spades", "Hearts", "Diamonds", "Clubs"] ->
          {:ok, %{makao | demand: demand, demandTurns: 1} |> finish_action() |> finish_turn()}

        last_played.rank == "J" and demand in ["5", "6", "7", "8", "9", "10", "Q"] ->
          {:ok,
           %{makao | demand: demand, demandTurns: player_count(makao) + 1}
           |> finish_action()
           |> finish_turn()}

        true ->
          :err
      end
    else
      :err
    end
  end

  def handle_demand(_makao, _card, _username) do
    :err
  end

  def handle_pass(%Makao{status: "in_progress"} = makao, username) do
    if players_turn?(makao, username) and
         (blocked?(makao) or
            (!is_new_turn(makao) and (makao.drawn == nil or makao.toDraw == 0)) or
            (is_new_turn(makao) and makao.toBlock > 0)) do
      if is_new_turn(makao) do
        {:ok, %{makao | lastTurn: makao.turn} |> block_player |> finish_action |> finish_turn()}
      else
        {:ok, %{makao | lastTurn: makao.turn} |> finish_action |> finish_turn()}
      end
    else
      :err
    end
  end

  def handle_pass(_makao, _username) do
    :err
  end

  def handle_draw(%Makao{status: "in_progress"} = makao, username) do
    if players_turn?(makao, username) and !blocked?(makao) do
      cond do
        is_new_turn(makao) and makao.toBlock == 0 ->
          {:ok, makao |> draw_first() |> finish_action()}

        !is_new_turn(makao) and makao.drawn != nil and makao.toDraw != 0 ->
          {:ok, makao |> draw() |> finish_action |> finish_turn()}

        true ->
          :err
      end
    else
      :err
    end
  end

  def handle_draw(_makao, _username) do
    :err
  end

  defp play(%Makao{} = makao, %Card{} = card) do
    %Player{} = player = current_player(makao)

    new_hand = List.delete(player.hand, card)

    new_winners =
      if new_hand == [] do
        [player.name | makao.winners]
      else
        makao.winners
      end

    new_players =
      List.replace_at(makao.players, makao.turn, %{player | hand: new_hand})

    new_demand =
      if is_suit_demand(makao.demand) do
        nil
      else
        makao.demand
      end

    new_status =
      if Enum.count(new_winners) == player_count(makao) - 1 do
        "finished"
      else
        makao.status
      end

    %{
      makao
      | players: new_players,
        played: [card | makao.played],
        demand: new_demand,
        winners: new_winners,
        status: new_status
    }
    |> apply_card_effect(card)
  end

  defp draw(%Makao{} = makao) do
    %{makao | toDraw: 0, drawn: nil} |> draw(makao.toDraw - 1, makao.turn)
  end

  defp draw(%Makao{} = makao, count, seat) do
    if out_of_stock?(makao, count) do
      draw(restock(makao), count, seat)
    else
      %Player{} = player = Enum.at(makao.players, seat)
      drawn = Enum.take(makao.stock, count)
      new_stock = Enum.drop(makao.stock, count)

      new_player = %{player | hand: drawn ++ player.hand}
      new_players = List.replace_at(makao.players, seat, new_player)
      %{makao | players: new_players, stock: new_stock}
    end
  end

  defp draw_first(%Makao{status: "in_progress"} = makao) do
    if out_of_stock?(makao, 1) do
      draw_first(restock(makao))
    else
      %Player{} = player = current_player(makao)
      [drawn | new_stock] = makao.stock

      new_player = %{player | hand: [drawn | player.hand]}
      new_players = List.replace_at(makao.players, makao.turn, new_player)
      %{makao | players: new_players, stock: new_stock, drawn: drawn} |> finish_action()
    end
  end

  defp deal_first_played(%Makao{} = makao) do
    [drawn | new_stock] = makao.stock

    if drawn.rank in ["A", "2", "3", "4", "J"] or
         (drawn.rank == "K" and drawn.suit in ["Spades", "Hearts"]) do
      deal_first_played(%{makao | stock: new_stock ++ [drawn]})
    else
      new_played = [drawn | makao.played]
      %{makao | played: new_played, stock: new_stock}
    end
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

  defp deal(%Makao{} = makao) do
    makao |> deal(0) |> deal(1) |> deal(2) |> deal(3) |> deal_first_played()
  end

  defp deal(%Makao{} = makao, seat) do
    if Enum.at(makao.players, seat) != nil do
      makao |> draw(5, seat)
    else
      makao
    end
  end

  defp legal?(%Makao{demand: demand}, %Card{} = card)
       when demand != nil and card.rank not in ["A", "J"] and is_functional_card(card) do
    false
  end

  defp legal?(%Makao{demand: demand}, %Card{} = card)
       when is_rank_demand(demand) and card.rank != demand and card.rank != "J" do
    false
  end

  defp legal?(%Makao{demand: demand}, %Card{} = card)
       when is_rank_demand(demand) and (card.rank == demand or card.rank == "J") do
    true
  end

  defp legal?(%Makao{demand: demand}, %Card{} = card)
       when is_suit_demand(demand) and card.suit != demand and card.rank != "A" do
    false
  end

  defp legal?(%Makao{demand: demand}, %Card{} = card)
       when is_suit_demand(demand) and (card.suit == demand or card.rank == "A") do
    true
  end

  defp legal?(%Makao{toBlock: toBlock}, %Card{} = card)
       when toBlock != 0 and card.rank != "4" do
    false
  end

  defp legal?(%Makao{toDraw: toDraw}, %Card{} = card)
       when toDraw != 0 and card.rank not in ["2", "3"] and
              (card.rank != "K" or
                 card.suit not in ["Spades", "Hearts"]) do
    false
  end

  defp legal?(%Makao{drawn: drawn_card}, %Card{} = card)
       when drawn_card != nil and drawn_card != card do
    false
  end

  defp legal?(%Makao{} = makao, %Card{} = card) do
    last_played = List.first(makao.played)

    if makao.lastTurn == makao.turn and makao.drawn == nil do
      card.rank == last_played.rank
    else
      card.rank == last_played.rank or card.suit == last_played.suit
    end
  end

  defp get_next_player(%Makao{} = makao) do
    new_makao = %{makao | turn: rem(makao.turn + 1, 4)}

    next_player = Enum.at(makao.players, new_makao.turn)

    if next_player == nil or next_player.hand == [] do
      get_next_player(new_makao)
    else
      new_makao.turn
    end
  end

  defp shuffle_stock(%Makao{} = makao) do
    %{makao | stock: Enum.shuffle(makao.stock)}
  end

  defp apply_card_effect(%Makao{} = makao, %Card{rank: "2"}) do
    %{makao | toDraw: makao.toDraw + 2}
  end

  defp apply_card_effect(%Makao{} = makao, %Card{rank: "3"}) do
    %{makao | toDraw: makao.toDraw + 3}
  end

  defp apply_card_effect(%Makao{} = makao, %Card{rank: "4"}) do
    %{makao | toBlock: makao.toBlock + 1}
  end

  defp apply_card_effect(%Makao{} = makao, %Card{rank: "K", suit: "Hearts"}) do
    %{makao | toDraw: makao.toDraw + 5}
  end

  defp apply_card_effect(%Makao{} = makao, %Card{rank: "K", suit: "Spades"}) do
    %{makao | toDraw: makao.toDraw + 5}
  end

  defp apply_card_effect(%Makao{} = makao, _) do
    makao
  end

  defp current_player(%Makao{} = makao) do
    Enum.at(makao.players, makao.turn)
  end

  defp players_turn?(%Makao{} = makao, username) do
    current_player = current_player(makao)
    current_player != nil and current_player.name == username
  end

  defp block_player(%Makao{} = makao) do
    player = current_player(makao)

    new_player = %{player | blocked: makao.toBlock}
    %{makao | toBlock: 0, players: List.replace_at(makao.players, makao.turn, new_player)}
  end

  defp blocked?(%Makao{} = makao) do
    current_player(makao).blocked > 0
  end

  def hide_other_players_cards(%Makao{} = makao, username) do
    %{
      makao
      | players:
          Enum.map(makao.players, fn player ->
            cond do
              player != nil and player.name == username and players_turn?(makao, username) ->
                %{
                  player
                  | hand:
                      Enum.map(player.hand, fn card ->
                        %{rank: card.rank, suit: card.suit, disabled: not legal?(makao, card)}
                      end)
                }

              player == nil or player.name == username ->
                player

              true ->
                %{player | hand: Enum.count(player.hand)}
            end
          end),
        drawn:
          if players_turn?(makao, username) do
            makao.drawn
          else
            nil
          end
    }
  end

  defp finish_action(%Makao{} = makao) do
    %{makao | lastTurn: makao.turn}
  end

  defp finish_turn(%Makao{} = makao) do
    %Player{} = player = current_player(makao)
    new_player = %{player | blocked: max(player.blocked - 1, 0)}

    new_demand =
      cond do
        makao.demandTurns <= 1 and is_rank_demand(makao.demand) ->
          nil

        true ->
          makao.demand
      end

    %{
      makao
      | turn: get_next_player(makao),
        players: List.replace_at(makao.players, makao.turn, new_player),
        drawn: nil,
        demandTurns: max(makao.demandTurns - 1, 0),
        demand: new_demand
    }
  end

  defp player_count(%Makao{} = makao) do
    Enum.count(makao.players, fn x -> not is_nil(x) end)
  end
end
