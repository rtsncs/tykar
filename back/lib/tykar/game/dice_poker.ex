defmodule Tykar.Game.DicePoker do
  use Tykar.Game

  alias Tykar.Game.DicePoker
  alias Tykar.Game.Seat

  @derive Jason.Encoder
  defstruct [
    :room_id,
    players: List.duplicate(%Seat{}, 2),
    status: :setup,
    turn: -1,
    roll: 0,
    starting_player: -1,
    thrown: List.duplicate(List.duplicate(0, 5), 2),
    keep: List.duplicate(false, 5)
  ]

  @impl Tykar.Game
  def start(%DicePoker{} = game) do
    starting_player = 0..1 |> Enum.random()

    new_game =
      %DicePoker{
        room_id: game.room_id,
        players: game.players,
        status: :in_progress,
        starting_player: starting_player,
        turn: starting_player
      }

    new_game
  end

  def handle_roll(%DicePoker{} = game, username) do
    if Enum.at(game.players, game.turn).username == username do
      rolled = game |> roll()

      if rolled.roll == 3 do
        {:ok, rolled |> next_turn()}
      else
        {:ok, rolled}
      end
    else
      :error
    end
  end

  def handle_keep(%DicePoker{} = game, username, index) do
    if Enum.at(game.players, game.turn).username == username do
      {:ok, %DicePoker{game | keep: game.keep |> List.update_at(index, &(!&1))}}
    else
      :error
    end
  end

  def handle_pass(%DicePoker{} = game, _username) do
    if game.roll == 0 do
      :error
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

    %{game | thrown: new_thrown, roll: game.roll + 1}
  end

  defp next_turn(%DicePoker{} = game) do
    new_turn = rem(game.turn + 1, 2)

    if new_turn == game.starting_player do
      game |> next_round()
    else
      %DicePoker{game | turn: new_turn, roll: 0} |> reset_keep()
    end
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
