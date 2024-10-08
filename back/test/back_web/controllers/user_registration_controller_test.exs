defmodule TykarBackWeb.UserRegistrationControllerTest do
  use TykarBackWeb.ConnCase, async: true

  import TykarBack.AccountsFixtures

  describe "POST /api/users/register" do
    @tag :capture_log
    test "creates account and logs the user in", %{conn: conn} do
      email = unique_user_email()

      conn =
        post(conn, ~p"/api/users/register", valid_user_attributes(email: email))

      assert get_session(conn, :user_token)
      response(conn, 204)

      # Now do a logged in request and assert on the menu
      conn = get(conn, ~p"/api/users/current")
      response = json_response(conn, 200)
      assert response["email"] =~ email
    end

    test "render errors for invalid data", %{conn: conn} do
      conn =
        post(conn, ~p"/api/users/register", %{
          "email" => "with spaces",
          "username" => "aa",
          "password" => "short"
        })

      response = json_response(conn, 422)

      assert %{
               "errors" => %{
                 "email" => ["must have the @ sign and no spaces"],
                 "username" => ["should be at least 3 character(s)"],
                 "password" => ["should be at least 8 character(s)"]
               }
             } = response
    end
  end
end
