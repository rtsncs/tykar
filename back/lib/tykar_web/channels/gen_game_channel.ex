defmodule TykarWeb.Channels.GenGameChannel do
  defmacro __using__(opts) do
    channel_name =
      case Keyword.fetch(opts, :channel_name) do
        {:ok, name} when is_binary(name) ->
          name

        :error ->
          raise ArgumentError,
                "expected :channel_name (string) in use TykarWeb.Channels.GenGameChannel"
      end

    quote do
      use TykarWeb, :channel

      @impl true
      def join(<<"#{unquote(channel_name)}:", room_id::binary-size(5)>>, _payload, socket) do
        if [{room, _} | _] = Registry.lookup(Tykar.GameRegistry, room_id) do
          if authorized?(socket) do
            send(self(), :after_join)
            {:ok, assign(socket, :room, room)}
          else
            {:error, %{reason: "unauthorized"}}
          end
        else
          {:error, %{reason: "not found"}}
        end
      end

      @impl true
      def handle_info(:after_join, socket) do
        {:ok, _} =
          TykarWeb.Presence.track(socket, get_assigned_username(socket), %{})

        push(socket, "presence_state", TykarWeb.Presence.list(socket))
        game_state = GenServer.call(get_assigned_room(socket), "game")

        push(
          socket,
          "game",
          game_state
        )

        {:noreply, socket}
      end

      @impl true
      def handle_in("shout", %{"content" => content}, socket) do
        broadcast(socket, "shout", %{author: get_assigned_username(socket), content: content})
        {:noreply, socket}
      end

      @impl true
      def handle_in(event, payload, socket) do
        GenServer.cast(get_assigned_room(socket), {event, get_assigned_username(socket), payload})
        {:noreply, socket}
      end

      defp authorized?(socket) do
        if _user = get_assigned_user(socket) do
          true
        else
          false
        end
      end

      defp get_assigned_room(socket) do
        socket.assigns[:room]
      end

      defp get_assigned_user(socket) do
        socket.assigns[:current_user]
      end

      defp get_assigned_username(socket) do
        socket.assigns[:current_user].username
      end
    end
  end
end
