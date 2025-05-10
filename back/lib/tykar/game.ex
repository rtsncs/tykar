defmodule Tykar.Game do
  defmacro __using__(_) do
    quote do
      @behaviour Tykar.Game

      def sit_down(%{status: :in_progress}, _seat, _username) do
        :error
      end

      def sit_down(game, seat, username) do
        with {:ok, new_player} <- Tykar.Game.Seat.sit_down(Enum.at(game.players, seat), username) do
          {:ok, %{game | players: List.replace_at(game.players, seat, new_player)}}
        end
      end

      def get_up(%{status: :in_progress}, _username) do
        :error
      end

      def get_up(game, username) do
        index = game.players |> Enum.find_index(&(&1.username == username))

        if index != nil do
          new_players = game.players |> List.update_at(index, &(&1 |> Tykar.Game.Seat.get_up()))
          {:ok, %{game | players: new_players}}
        else
          :error
        end
      end

      def ready(%{status: :in_progress}, _username) do
        :error
      end

      def ready(game, username) do
        index = game.players |> Enum.find_index(&(&1.username == username))

        if index != nil do
          new_players = game.players |> List.update_at(index, &(&1 |> Tykar.Game.Seat.ready()))
          new_game = %{game | players: new_players}

          if new_players |> Enum.all?(& &1.is_ready) do
            {:ok, new_game |> __MODULE__.start()}
          else
            {:ok, new_game}
          end
        else
          :error
        end
      end

      def unready(%{status: :in_progress}, _username) do
        :error
      end

      def unready(game, username) do
        index = game.players |> Enum.find_index(&(&1.username == username))

        if index != nil do
          new_players = game.players |> List.update_at(index, &(&1 |> Tykar.Game.Seat.unready()))
          {:ok, %{game | players: new_players}}
        else
          :error
        end
      end

      def start(%{status: :in_progress}) do
        :error
      end

      defp broadcast_system_message(game, event, payload) do
        :ok =
          TykarWeb.Endpoint.broadcast_from!(
            self(),
            game.channel_name <> ":" <> game.room_id,
            "system",
            %{"event" => event, "payload" => payload}
          )

        {:noreply, game}
      end

      defoverridable Tykar.Game
    end
  end

  @callback sit_down(game :: any, seat :: number, username :: String.t()) ::
              {:ok, any} | :error
  @callback get_up(game :: any, username :: String.t()) :: {:ok, any} | :error
  @callback ready(game :: any, username :: String.t()) :: {:ok, any} | :error
  @callback unready(game :: any, username :: String.t()) :: {:ok, any} | :error
  @callback start(game :: any) :: {:ok, any} | :error
end
