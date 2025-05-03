defmodule Tykar.Game.GenGameServer do
  defmacro __using__(opts) do
    channel_name =
      case Keyword.fetch(opts, :channel_name) do
        {:ok, name} when is_binary(name) ->
          name

        :error ->
          raise ArgumentError, "expected :channel_name (string) in use Tykar.Game.GenGameServer"
      end

    game =
      case Keyword.fetch(opts, :game) do
        {:ok, {:__aliases__, _, _} = game} -> Macro.expand(game, __ENV__)
        :error -> raise ArgumentError, "expected :game (module) in use Tykar.Game.GenGameServer"
      end

    quote do
      @behaviour Tykar.Game.GenGameServer
      use GenServer, restart: :transient

      def start_link(room_id) when is_binary(room_id) do
        GenServer.start_link(__MODULE__, room_id,
          name: {:via, Registry, {Tykar.GameRegistry, room_id}}
        )
      end

      @impl true
      def init(room_id) do
        {:ok, _} =
          TykarWeb.Presence.track(self(), unquote(channel_name) <> ":lobby", room_id, %{})

        {:ok, %unquote(game){room_id: room_id}}
      end

      @impl true
      def handle_call("game", _from, game) do
        {:reply, game, game}
      end

      @impl true
      def handle_cast({"sit_down", username, %{"seat" => seat}}, game) do
        case unquote(game).sit_down(game, seat, username) do
          {:ok, new_game} ->
            broadcast_game(new_game)
            {:noreply, new_game}

          :error ->
            {:noreply, game}
        end
      end

      @impl true
      def handle_cast({"get_up", username, _}, game) do
        case unquote(game).get_up(game, username) do
          {:ok, new_game} ->
            broadcast_game(new_game)
            {:noreply, new_game}

          :error ->
            {:noreply, game}
        end
      end

      @impl true
      def handle_cast({"ready", username, _}, game) do
        case unquote(game).ready(game, username) do
          {:ok, new_game} ->
            broadcast_game(new_game)
            {:noreply, new_game}

          :error ->
            {:noreply, game}
        end
      end

      @impl true
      def handle_cast({"unready", username, _}, game) do
        case unquote(game).unready(game, username) do
          {:ok, new_game} ->
            broadcast_game(new_game)
            {:noreply, new_game}

          :error ->
            {:noreply, game}
        end
      end

      defp broadcast_game(game) do
        :ok =
          TykarWeb.Endpoint.broadcast_from!(
            self(),
            unquote(channel_name) <> ":" <> game.room_id,
            "game",
            game
          )

        {:noreply, game}
      end
    end
  end

  defmacro __before_compile__(_env) do
    quote do
      @impl true
      def handle_cast(_, game) do
        {:noreply, game}
      end
    end
  end

  @callback start_link(room_id :: binary) :: any
end
