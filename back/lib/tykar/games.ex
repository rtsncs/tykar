defmodule Tykar.Games.Card do
  @derive Jason.Encoder
  @enforce_keys [:suit, :rank]
  defstruct [:suit, :rank]

  def from_map(%{"suit" => suit, "rank" => rank}) do
    %Tykar.Games.Card{suit: suit, rank: rank}
  end
end

defmodule Tykar.Games do
  alias Tykar.Games.Card

  def deck() do
    List.flatten(
      for suit <- ["Spades", "Hearts", "Diamonds", "Clubs"] do
        for rank <- ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"] do
          %Card{rank: rank, suit: suit}
        end
      end
    )
  end
end
