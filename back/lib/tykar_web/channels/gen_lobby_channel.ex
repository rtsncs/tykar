defmodule TykarWeb.Channels.GenLobbyChannel do
  defmacro __using__(opts) do
    channel_name =
      case Keyword.fetch(opts, :channel_name) do
        {:ok, name} when is_binary(name) ->
          name

        :error ->
          raise ArgumentError,
                "expected :channel_name (string) in use TykarWeb.Channels.GenLobbyChannel"
      end

    game_server =
      case Keyword.fetch(opts, :game_server) do
        {:ok, {:__aliases__, _, _} = game_server} ->
          Macro.expand(game_server, __ENV__)

        :error ->
          raise ArgumentError, "expected :game_server (module) in use Tykar.Game.GenLobbyChannel"
      end

    quote do
      use TykarWeb, :channel

      @impl true
      def join("#{unquote(channel_name)}:lobby", _payload, socket) do
        if authorized?(socket) do
          send(self(), :after_join)
          {:ok, socket}
        else
          {:error, %{reason: "unauthorized"}}
        end
      end

      @impl true
      def handle_info(:after_join, socket) do
        push(socket, "presence_state", TykarWeb.Presence.list(socket))
        {:noreply, socket}
      end

      @impl true
      def handle_in("new_room", _payload, socket) do
        id = ?a..?z |> Enum.take_random(5) |> List.to_string()

        {:ok, _pid} =
          DynamicSupervisor.start_child(
            Tykar.GameSupervisor,
            {unquote(game_server), id}
          )

        broadcast(socket, "new_room", %{id: id})
        {:reply, {:ok, %{id: id}}, socket}
      end

      @impl true
      def handle_in(_, _payload, socket) do
        {:noreply, socket}
      end

      defp authorized?(socket) do
        if _user = socket.assigns[:current_user] do
          true
        else
          false
        end
      end
    end
  end
end
