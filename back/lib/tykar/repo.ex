defmodule Tykar.Repo do
  use Ecto.Repo,
    otp_app: :tykar,
    adapter: Ecto.Adapters.Postgres
end
