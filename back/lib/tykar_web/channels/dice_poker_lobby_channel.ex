defmodule TykarWeb.DicePokerLobbyChannel do
  use TykarWeb.Channels.GenLobbyChannel,
    channel_name: "dice_poker",
    game_server: Tykar.Game.DicePoker.Server
end
