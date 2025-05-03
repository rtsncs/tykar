defmodule Tykar.Game.DicePoker.Server do
  use Tykar.Game.GenGameServer, channel_name: "dice_poker", game: Tykar.Game.DicePoker

  alias Tykar.Game.DicePoker

  @impl true
  def handle_cast({"roll", username, _}, %DicePoker{} = game) do
    case game |> DicePoker.handle_roll(username) do
      {:ok, new_game} -> broadcast_game(new_game)
      :error -> {:noreply, game}
    end
  end

  @impl true
  def handle_cast({"pass", username, _}, %DicePoker{} = game) do
    case game |> DicePoker.handle_pass(username) do
      {:ok, new_game} -> broadcast_game(new_game)
      :error -> {:noreply, game}
    end
  end

  @impl true
  def handle_cast({"keep", username, %{"index" => index}}, %DicePoker{} = game) do
    case game |> DicePoker.handle_keep(username, index) do
      {:ok, game} -> broadcast_game(game)
      :error -> {:noreply, game}
    end
  end
end
