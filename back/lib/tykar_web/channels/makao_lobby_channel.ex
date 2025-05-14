defmodule TykarWeb.MakaoLobbyChannel do
  use TykarWeb.Channels.GenLobbyChannel,
    channel_name: "makao",
    game_server: Tykar.Game.Makao.Server
end
