defmodule Tykar.Game.Card do
  @derive Jason.Encoder
  @enforce_keys [:suit, :rank]
  defstruct [:suit, :rank]

  def from_map(%{"suit" => suit, "rank" => rank}) do
    %Tykar.Game.Card{suit: suit, rank: rank}
  end

  def deck() do
    List.flatten(
      for suit <- ["Spades", "Hearts", "Diamonds", "Clubs"] do
        for rank <- ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"] do
          %Tykar.Game.Card{rank: rank, suit: suit}
        end
      end
    )
  end
end
