defmodule TykarWeb.MakaoLobbyChannel do
  use TykarWeb, :channel
  alias TykarWeb.Presence

  @impl true
  def join("makao:lobby", _payload, socket) do
    if authorized?(socket) do
      send(self(), :after_join)
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  @impl true
  def handle_info(:after_join, socket) do
    # {:ok, _} =
    #   Presence.track(socket, socket.assigns.current_user.username, %{})

    push(socket, "presence_state", Presence.list(socket))
    {:noreply, socket}
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  @impl true
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (makao_room:lobby).
  @impl true
  def handle_in("shout", payload, socket) do
    broadcast(socket, "shout", payload)
    {:noreply, socket}
  end

  @impl true
  def handle_in("new_room", _payload, socket) do
    id = ?a..?z |> Enum.take_random(5) |> List.to_string()

    {:ok, _pid} =
      DynamicSupervisor.start_child(
        Tykar.MakaoSupervisor,
        {Tykar.Games.Makao.Server, id}
      )

    broadcast(socket, "new_room", %{id: id})
    {:reply, {:ok, %{id: id}}, socket}
  end

  @impl true
  def handle_in(_, _payload, socket) do
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(socket) do
    if _user = socket.assigns[:current_user] do
      true
    else
      false
    end
  end
end
