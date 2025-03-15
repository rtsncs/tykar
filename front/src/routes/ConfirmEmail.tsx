import { useEffect } from "react";
import { useApi } from "../api/ApiProvider";
import { toaster } from "../components/ui/toaster";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSession } from "../AuthProvider";

function ConfirmEmail() {
  const { token } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const client = useApi();
  const { session, getSession } = useSession();

  useEffect(() => {
    const confirmEmail = async () => {
      const resp = await client.POST(
        `/api/users/settings/confirm_email/{token}`,
        {
          params: { path: { token: token! } },
        },
      );

      console.log(resp);
      const { error } = resp;

      if (error) {
        toaster.create({ description: t("email_change_error"), type: "error" });
      } else {
        if (session) {
          await getSession();
        }
        toaster.create({
          description: t("email_change_success"),
          type: "success",
        });
      }

      void navigate("/settings", { replace: true });
    };

    void confirmEmail();
  }, [token]);

  return <></>;
}

export default ConfirmEmail;
