defmodule TykarWeb.MakaoChannel do
  use TykarWeb, :channel

  alias TykarWeb.Presence
  alias Tykar.Games.Card
  alias Tykar.Games.Makao

  intercept ["game"]

  @impl true
  def join(<<"makao:", room_id::binary-size(5)>>, _payload, socket) do
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

  # @impl true
  # def terminate(reason, socket) do
  # end

  @impl true
  def handle_info(:after_join, socket) do
    {:ok, _} =
      Presence.track(socket, get_assigned_username(socket), %{})

    push(socket, "presence_state", Presence.list(socket))
    game_state = GenServer.call(get_assigned_room(socket), "game")

    push(
      socket,
      "game",
      game_state |> Makao.hide_other_players_cards(get_assigned_username(socket))
    )

    {:noreply, socket}
  end

  @impl true
  def handle_out("game", %Makao{} = state, socket) do
    push(socket, "game", state |> Makao.hide_other_players_cards(get_assigned_username(socket)))
    {:noreply, socket}
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  @impl true
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  @impl true
  def handle_in("shout", %{"content" => content}, socket) do
    broadcast(socket, "shout", %{author: get_assigned_username(socket), content: content})
    {:noreply, socket}
  end

  @impl true
  def handle_in("take_seat", %{"seat" => seat}, socket) do
    GenServer.cast(get_assigned_room(socket), {"take_seat", seat, get_assigned_username(socket)})
    {:noreply, socket}
  end

  @impl true
  def handle_in("start", _payload, socket) do
    GenServer.cast(get_assigned_room(socket), "start")
    {:noreply, socket}
  end

  @impl true
  def handle_in("play", payload, socket) do
    with card <- Card.from_map(payload) do
      GenServer.cast(get_assigned_room(socket), {"play", card, get_assigned_username(socket)})

      {:noreply, socket}
    end
  end

  @impl true
  def handle_in("demand", %{"demand" => demand}, socket) do
    GenServer.cast(get_assigned_room(socket), {"demand", demand, get_assigned_username(socket)})

    {:noreply, socket}
  end

  @impl true
  def handle_in("draw", _payload, socket) do
    GenServer.cast(get_assigned_room(socket), {"draw", get_assigned_username(socket)})
    {:noreply, socket}
  end

  @impl true
  def handle_in("pass", _payload, socket) do
    GenServer.cast(get_assigned_room(socket), {"pass", get_assigned_username(socket)})
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
