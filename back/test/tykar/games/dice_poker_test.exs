defmodule Tykar.Games.DicePokerTest do
  alias Tykar.Games.DicePoker

  use ExUnit.Case

  describe "compare_hands/1" do
    test "five of a kind" do
      a = [1, 1, 1, 1, 1]

      %{
        four: [6, 6, 6, 6, 1],
        full_house: [6, 6, 6, 5, 5],
        high_straight: [2, 3, 4, 5, 6],
        low_straight: [1, 2, 3, 4, 5],
        three: [6, 6, 6, 1, 2],
        two_pairs: [6, 6, 5, 5, 4],
        pair: [6, 6, 1, 2, 3],
        nothing: [1, 2, 3, 4, 6]
      }
      |> Map.values()
      |> Enum.each(fn b ->
        assert DicePoker.compare_hands([a, b]) == :a_wins,
               "Expected #{inspect(a)} to beat #{inspect(b)}"
      end)
    end

    test "five of a kind tie breaker" do
      a = [1, 1, 1, 1, 1]
      b = [6, 6, 6, 6, 6]

      assert DicePoker.compare_hands([a, b]) == :b_wins,
             "Expected #{inspect(b)} to beat #{inspect(a)}"
    end

    test "four of a kind" do
      a = [1, 1, 1, 1, 2]

      %{
        full_house: [6, 6, 6, 5, 5],
        high_straight: [2, 3, 4, 5, 6],
        low_straight: [1, 2, 3, 4, 5],
        three: [6, 6, 6, 1, 2],
        two_pairs: [6, 6, 5, 5, 4],
        pair: [6, 6, 1, 2, 3],
        nothing: [1, 2, 3, 4, 6]
      }
      |> Map.values()
      |> Enum.each(fn b ->
        assert DicePoker.compare_hands([a, b]) == :a_wins,
               "Expected #{inspect(a)} to beat #{inspect(b)}"
      end)
    end

    test "four of a kind tie breaker" do
      a = [1, 1, 1, 1, 2]
      b = [6, 6, 6, 6, 2]

      assert DicePoker.compare_hands([a, b]) == :b_wins,
             "Expected #{inspect(b)} to beat #{inspect(a)}"

      a = [1, 1, 1, 1, 2]
      b = [1, 1, 1, 1, 3]

      assert DicePoker.compare_hands([a, b]) == :b_wins,
             "Expected #{inspect(b)} to beat #{inspect(a)}"
    end

    test "full house" do
      a = [1, 1, 1, 2, 2]

      %{
        high_straight: [2, 3, 4, 5, 6],
        low_straight: [1, 2, 3, 4, 5],
        three: [6, 6, 6, 1, 2],
        two_pairs: [6, 6, 5, 5, 4],
        pair: [6, 6, 1, 2, 3],
        nothing: [1, 2, 3, 4, 6]
      }
      |> Map.values()
      |> Enum.each(fn b ->
        assert DicePoker.compare_hands([a, b]) == :a_wins,
               "Expected #{inspect(a)} to beat #{inspect(b)}"
      end)
    end

    test "full house tie breaker" do
      a = [1, 1, 1, 2, 2]
      b = [6, 6, 6, 2, 2]

      assert DicePoker.compare_hands([a, b]) == :b_wins,
             "Expected #{inspect(b)} to beat #{inspect(a)}"

      a = [3, 3, 3, 6, 6]
      b = [2, 2, 6, 6, 6]

      assert DicePoker.compare_hands([a, b]) == :b_wins,
             "Expected #{inspect(b)} to beat #{inspect(a)}"
    end

    test "high straight" do
      a = [2, 3, 4, 5, 6]

      %{
        low_straight: [1, 2, 3, 4, 5],
        three: [6, 6, 6, 1, 2],
        two_pairs: [6, 6, 5, 5, 4],
        pair: [6, 6, 1, 2, 3],
        nothing: [1, 2, 3, 4, 6]
      }
      |> Map.values()
      |> Enum.each(fn b ->
        assert DicePoker.compare_hands([a, b]) == :a_wins,
               "Expected #{inspect(a)} to beat #{inspect(b)}"
      end)
    end

    test "low straight" do
      a = [1, 2, 3, 4, 5]

      %{
        three: [6, 6, 6, 1, 2],
        two_pairs: [6, 6, 5, 5, 4],
        pair: [6, 6, 1, 2, 3],
        nothing: [1, 2, 3, 4, 6]
      }
      |> Map.values()
      |> Enum.each(fn b ->
        assert DicePoker.compare_hands([a, b]) == :a_wins,
               "Expected #{inspect(a)} to beat #{inspect(b)}"
      end)
    end

    test "three" do
      a = [1, 1, 1, 4, 5]

      %{
        two_pairs: [6, 6, 5, 5, 4],
        pair: [6, 6, 1, 2, 3],
        nothing: [1, 2, 3, 4, 6]
      }
      |> Map.values()
      |> Enum.each(fn b ->
        assert DicePoker.compare_hands([a, b]) == :a_wins,
               "Expected #{inspect(a)} to beat #{inspect(b)}"
      end)
    end

    test "three tie breaker" do
      a = [1, 1, 1, 4, 5]
      b = [2, 2, 2, 4, 5]

      assert DicePoker.compare_hands([a, b]) == :b_wins,
             "Expected #{inspect(b)} to beat #{inspect(a)}"

      a = [1, 1, 1, 4, 5]
      b = [1, 1, 1, 5, 6]

      assert DicePoker.compare_hands([a, b]) == :b_wins,
             "Expected #{inspect(b)} to beat #{inspect(a)}"
    end

    test "two pairs" do
      a = [1, 1, 2, 2, 4]

      %{
        pair: [6, 6, 1, 2, 3],
        nothing: [1, 2, 3, 4, 6]
      }
      |> Map.values()
      |> Enum.each(fn b ->
        assert DicePoker.compare_hands([a, b]) == :a_wins,
               "Expected #{inspect(a)} to beat #{inspect(b)}"
      end)
    end

    test "two pairs tie breaker" do
      a = [1, 1, 3, 3, 6]
      b = [2, 2, 3, 3, 6]

      assert DicePoker.compare_hands([a, b]) == :b_wins,
             "Expected #{inspect(b)} to beat #{inspect(a)}"

      a = [1, 1, 3, 3, 5]
      b = [1, 1, 3, 3, 6]

      assert DicePoker.compare_hands([a, b]) == :b_wins,
             "Expected #{inspect(b)} to beat #{inspect(a)}"
    end

    test "pair" do
      a = [1, 1, 2, 3, 4]
      b = [1, 2, 3, 4, 6]

      assert DicePoker.compare_hands([a, b]) == :a_wins,
             "Expected #{inspect(a)} to beat #{inspect(b)}"
    end

    test "pair tie breaker" do
      a = [1, 1, 4, 5, 6]
      b = [2, 2, 4, 5, 6]

      assert DicePoker.compare_hands([a, b]) == :b_wins,
             "Expected #{inspect(b)} to beat #{inspect(a)}"

      a = [1, 1, 3, 4, 5]
      b = [1, 1, 4, 5, 6]

      assert DicePoker.compare_hands([a, b]) == :b_wins,
             "Expected #{inspect(b)} to beat #{inspect(a)}"
    end

    test "nothing tie breaker" do
      a = [1, 2, 3, 4, 6]
      b = [1, 2, 3, 5, 6]

      assert DicePoker.compare_hands([a, b]) == :b_wins,
             "Expected #{inspect(b)} to beat #{inspect(a)}"
    end

    test "identical hands return draw" do
      hand = [2, 2, 3, 3, 3]
      assert DicePoker.compare_hands([hand, hand]) == :draw
    end
  end
end
