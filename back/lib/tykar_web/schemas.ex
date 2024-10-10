defmodule TykarWeb.Schemas do
  alias OpenApiSpex.Schema

  defmodule RegisterRequest do
    require OpenApiSpex

    OpenApiSpex.schema(%{
      type: :object,
      properties: %{
        username: %Schema{type: :string},
        email: %Schema{type: :string},
        password: %Schema{type: :string}
      },
      required: [:username, :email, :password]
    })
  end

  defmodule RegisterError do
    require OpenApiSpex

    OpenApiSpex.schema(%{
      type: :object,
      properties: %{
        errors: %Schema{
          type: :object,
          properties: %{
            username: %Schema{type: :array, items: %Schema{type: :string}},
            email: %Schema{type: :array, items: %Schema{type: :string}},
            password: %Schema{type: :array, items: %Schema{type: :string}}
          }
        }
      },
      required: [:errors]
    })
  end

  defmodule LoginRequest do
    require OpenApiSpex

    OpenApiSpex.schema(%{
      type: :object,
      properties: %{
        email_or_username: %Schema{type: :string},
        password: %Schema{type: :string},
        remember_me: %Schema{type: :boolean}
      },
      required: [:email_or_username, :password]
    })
  end

  defmodule CurrentUserResponse do
    require OpenApiSpex

    OpenApiSpex.schema(%{
      type: :object,
      properties: %{
        id: %Schema{type: :string},
        email: %Schema{type: :string},
        username: %Schema{type: :string},
        token: %Schema{type: :string}
      },
      required: [:id, :email, :username, :token]
    })
  end
end
