defmodule Tykar.Games.Makao do
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
