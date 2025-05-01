defmodule Tykar.Games.Seat do
  alias Tykar.Games.Seat

  @derive Jason.Encoder
  defstruct username: nil,
            ready: false,
            score: 0,
            data: %{}

  defguard is_free(seat) when is_nil(seat.username)

  def seat(%Seat{} = seat, username) when is_free(seat) do
    {:ok, %Seat{seat | username: username}}
  end

  def seat(_seat, _username) do
    :err
  end
end
