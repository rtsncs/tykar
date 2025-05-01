defmodule Tykar.Games.DicePoker do
  alias Tykar.Games.DicePoker
  alias Tykar.Games.Seat

  @derive Jason.Encoder
  defstruct [
    :roomId,
    players: List.duplicate(%Seat{}, 2),
    status: "setup",
    turn: -1,
    roll: 0,
    thrown: List.duplicate(List.duplicate(0, 5), 2),
    keep: List.duplicate(false, 5)
  ]

  def start(%DicePoker{} = game) do
    if Enum.all?(game.players, & &1.ready) and game.status != "in_progress" do
      new_game =
        %DicePoker{
          roomId: game.roomId,
          players: game.players,
          status: "in_progress",
          turn: 0
        }

      {:ok, new_game}
    else
      :err
    end
  end

  def take_seat(%DicePoker{status: "in_progress"}, _seat, _username) do
    :err
  end

  def take_seat(%DicePoker{} = game, seat, username) do
    with {:ok, new_player} <- Seat.seat(Enum.at(game.players, seat), username) do
      {:ok, %{game | players: List.replace_at(game.players, seat, new_player)}}
    end
  end

  def handle_roll(%DicePoker{} = game, username) do
    if Enum.at(game.players, game.turn).username == username do
      rolled = game |> roll()

      if rolled.roll == 2 do
        {:ok, rolled |> next_turn()}
      else
        {:ok, rolled}
      end
    else
      :err
    end
  end

  def handle_keep(%DicePoker{} = game, username, index) do
    if Enum.at(game.players, game.turn).username == username do
      {:ok, %DicePoker{game | keep: game.keep |> List.update_at(index, &(!&1))}}
    else
      :err
    end
  end

  def handle_pass(%DicePoker{} = game, username) do
    if game.roll == 0 do
      :err
    else
      {:ok, game |> next_turn()}
    end
  end

  defp roll(%DicePoker{} = game) do
    new_thrown =
      game.thrown
      |> List.update_at(game.turn, fn x ->
        x
        |> Enum.with_index()
        |> Enum.map(fn {dice, i} ->
          if Enum.at(game.keep, i) do
            dice
          else
            1..6 |> Enum.random()
          end
        end)
      end)

    %{game | thrown: new_thrown, roll: game.roll + 1} |> reset_keep()
  end

  defp next_turn(%DicePoker{} = game) do
    new_turn = rem(game.turn + 1, 2)

    %DicePoker{game | turn: new_turn, roll: 0} |> reset_keep()
  end

  defp next_round(%DicePoker{} = game) do
    new_turn = rem(game.turn + 1, 2)

    new_players =
      case compare_hands(game.thrown) do
        :a_wins -> game.players |> List.update_at(0, fn x -> %{x | score: x.score + 1} end)
        :b_wins -> game.players |> List.update_at(1, fn x -> %{x | score: x.score + 1} end)
        :draw -> game.players
      end

    %DicePoker{game | turn: new_turn, roll: 0, players: new_players} |> reset_keep()
  end

  defp reset_keep(%DicePoker{} = game) do
    %{game | keep: List.duplicate(false, 5)}
  end

  defp get_hand(thrown) do
    sorted = thrown |> Enum.sort()
    freq = sorted |> Enum.frequencies() |> Map.values()

    cond do
      freq |> Enum.count() == 1 ->
        :five

      freq |> Enum.any?(fn x -> x == 4 end) ->
        :four

      freq |> Enum.all?(fn x -> x == 3 or x == 2 end) ->
        :full_house

      freq |> Enum.any?(fn x -> x == 3 end) ->
        :three

      freq |> Enum.count(fn x -> x == 2 end) == 2 ->
        :two_pairs

      freq |> Enum.any?(fn x -> x == 2 end) ->
        :pair

      sorted == [1, 2, 3, 4, 5] ->
        :low_straight

      sorted == [2, 3, 4, 5, 6] ->
        :high_straight

      true ->
        :nothing
    end
  end

  defp hand_rank(hand) do
    case get_hand(hand) do
      :nothing -> 0
      :pair -> 1
      :two_pairs -> 2
      :three -> 3
      :low_straight -> 4
      :high_straight -> 5
      :full_house -> 6
      :four -> 7
      :five -> 8
    end
  end

  def compare_hands([a, b]) do
    cond do
      hand_rank(a) > hand_rank(b) -> :a_wins
      hand_rank(a) < hand_rank(b) -> :b_wins
      Enum.sort(a, :desc) > Enum.sort(b, :desc) -> :a_wins
      Enum.sort(a, :desc) < Enum.sort(b, :desc) -> :b_wins
      a == b -> :draw
    end
  end
end
