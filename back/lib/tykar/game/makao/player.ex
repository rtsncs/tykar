defmodule Tykar.Game.Makao.Player do
  @derive Jason.Encoder
  defstruct hand: [],
            blocked: 0
end
