defmodule TykarBack.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      TykarBackWeb.Telemetry,
      TykarBack.Repo,
      {DNSCluster, query: Application.get_env(:back, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: TykarBack.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: TykarBack.Finch},
      # Start a worker by calling: TykarBack.Worker.start_link(arg)
      # {TykarBack.Worker, arg},
      # Start to serve requests, typically the last entry
      TykarBackWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: TykarBack.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    TykarBackWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
