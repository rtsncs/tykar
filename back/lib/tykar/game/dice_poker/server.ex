defmodule Tykar.Game.DicePoker.Server do
  use Tykar.Game.GenGameServer, channel_name: "dice_poker", game: Tykar.Game.DicePoker

  alias Tykar.Game.DicePoker

  @impl true
  def handle_cast({"roll", username}, %DicePoker{} = game) do
    game = game |> DicePoker.handle_roll(username)
    broadcast_game(game)
  end

  @impl true
  def handle_cast({"pass", username}, %DicePoker{} = game) do
    game = game |> DicePoker.handle_pass(username)
    broadcast_game(game)
  end

  @impl true
  def handle_cast({"keep", username, index}, %DicePoker{} = game) do
    game = game |> DicePoker.handle_keep(username, index)
    broadcast_game(game)
  end
end
