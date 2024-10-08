defmodule Tykar.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      TykarWeb.Telemetry,
      Tykar.Repo,
      {DNSCluster, query: Application.get_env(:tykar, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: Tykar.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: Tykar.Finch},
      # Start a worker by calling: Tykar.Worker.start_link(arg)
      # {Tykar.Worker, arg},
      # Start to serve requests, typically the last entry
      TykarWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Tykar.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    TykarWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
