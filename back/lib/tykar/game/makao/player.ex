defmodule Tykar.Game.Makao.Player do
  @derive Jason.Encoder
  defstruct [
    :name,
    hand: [],
    blocked: 0
  ]
end
