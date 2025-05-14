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
  def handle_cast({"keep", username, %{"index" => index, "value" => value}}, %DicePoker{} = game)
      when is_number(index) and is_boolean(value) do
    case game |> DicePoker.handle_keep(username, index, value) do
      {:ok, game} -> broadcast_game(game)
      :error -> {:noreply, game}
    end
  end

  @impl true
  def handle_cast(_, game) do
    {:noreply, game}
  end
end
