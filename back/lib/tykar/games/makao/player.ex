defmodule Tykar.Games.Makao.Player do
  @derive Jason.Encoder
  defstruct [
    :name,
    hand: []
  ]
end
