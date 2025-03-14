defmodule TykarWeb.Schemas do
  alias OpenApiSpex.Schema

  defmodule ErrorHelper do
    def generate_error_schema(request_schema) do
      properties = request_schema.schema().properties |> Map.keys()

      error_properties =
        Enum.reduce(properties, %{}, fn key, acc ->
          Map.put(acc, key, %Schema{type: :array, items: %Schema{type: :string}})
        end)

      %{
        type: :object,
        properties: %{
          errors: %Schema{
            type: :object,
            properties: error_properties
          }
        },
        required: [:errors]
      }
    end
  end

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
    OpenApiSpex.schema(ErrorHelper.generate_error_schema(RegisterRequest))
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

  defmodule UpdateEmailRequest do
    require OpenApiSpex

    OpenApiSpex.schema(%{
      type: :object,
      properties: %{
        current_password: %Schema{type: :string},
        email: %Schema{type: :string}
      },
      required: [:email, :current_password]
    })
  end

  defmodule UpdateEmailError do
    require OpenApiSpex

    OpenApiSpex.schema(ErrorHelper.generate_error_schema(UpdateEmailRequest))
  end

  defmodule UpdatePasswordRequest do
    require OpenApiSpex

    OpenApiSpex.schema(%{
      type: :object,
      properties: %{
        current_password: %Schema{type: :string},
        password: %Schema{type: :string}
      },
      required: [:current_password, :password]
    })
  end

  defmodule UpdatePasswordError do
    require OpenApiSpex
    OpenApiSpex.schema(ErrorHelper.generate_error_schema(UpdatePasswordRequest))
  end
end
