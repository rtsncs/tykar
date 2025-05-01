defmodule Tykar.Game.Seat do
  alias Tykar.Game.Seat

  @derive Jason.Encoder
  defstruct username: nil,
            is_ready: false,
            score: 0,
            data: %{}

  defguard is_free(seat) when is_nil(seat.username)

  def sit_down(%Seat{} = seat, username) when is_free(seat) do
    {:ok, %Seat{seat | username: username}}
  end

  def sit_down(_seat, _username) do
    :err
  end

  def get_up(%Seat{} = seat) when not is_free(seat) do
    {:ok, %Seat{seat | username: nil}}
  end

  def get_up(_seat) do
    :err
  end

  def ready(%Seat{} = seat) do
    %{seat | is_ready: true}
  end

  def unready(%Seat{} = seat) do
    %{seat | is_ready: false}
  end
end
