defmodule TykarWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :tykar

  # The session will be stored in the cookie and signed,
  # this means its contents can be read but not tampered with.
  # Set :encryption_salt if you would also like to encrypt it.
  @session_options [
    store: :cookie,
    key: "_tykar_key",
    signing_salt: "WlOJkQFD",
    same_site: "Strict",
    secure: true
  ]

  socket "/socket", TykarWeb.UserSocket,
    websocket: [connect_info: [{:session, @session_options}]],
    longpoll: false

  plug Plug.RequestId
  plug Plug.Telemetry, event_prefix: [:phoenix, :endpoint]

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Phoenix.json_library()

  plug Plug.MethodOverride
  plug Plug.Head
  plug Plug.Session, @session_options
  plug TykarWeb.Router
end
