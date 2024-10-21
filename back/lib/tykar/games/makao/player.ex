defmodule Tykar.Games.Makao.Player do
  @derive Jason.Encoder
  defstruct [
    :name,
    hand: [],
    blocked: 0
  ]
end
