defmodule TykarWeb.UserSessionControllerTest do
  use TykarWeb.ConnCase, async: true

  import Tykar.AccountsFixtures

  setup do
    %{user: user_fixture()}
  end

  describe "POST /users/log_in" do
    test "logs the user in", %{conn: conn, user: user} do
      conn =
        post(conn, ~p"/api/users/log_in", %{
          "email_or_username" => user.email,
          "password" => valid_user_password()
        })

      assert get_session(conn, :user_token)
      response(conn, 204)

      # Now do a logged in request and assert on the menu
      conn = get(conn, ~p"/api/users/current")
      response = json_response(conn, 200)
      assert %{"id" => user.id, "email" => user.email, "username" => user.username} == response
    end

    test "logs the user in with remember me", %{conn: conn, user: user} do
      conn =
        post(conn, ~p"/api/users/log_in", %{
          "email_or_username" => user.email,
          "password" => valid_user_password(),
          "remember_me" => "true"
        })

      assert conn.resp_cookies["_tykar_web_user_remember_me"]
      response(conn, 204)
    end

    test "emits error message with invalid credentials", %{conn: conn, user: user} do
      conn =
        post(conn, ~p"/api/users/log_in", %{
          "email_or_username" => user.email,
          "password" => "invalid_password"
        })

      json_response(conn, 401)
    end
  end

  describe "DELETE /users/log_out" do
    test "logs the user out", %{conn: conn, user: user} do
      conn = conn |> log_in_user(user) |> delete(~p"/api/users/log_out")
      response(conn, 204)
      refute get_session(conn, :user_token)
    end

    test "succeeds even if the user is not logged in", %{conn: conn} do
      conn = delete(conn, ~p"/api/users/log_out")
      response(conn, 204)
      refute get_session(conn, :user_token)
    end
  end
end
