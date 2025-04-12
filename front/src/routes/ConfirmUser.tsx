import { useEffect } from "react";
import { useApi } from "../api/ApiProvider";
import { toaster } from "../components/ui/toaster";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";

function ConfirmUser() {
  const { token } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const client = useApi();

  useEffect(() => {
    const confirmUser = async () => {
      const { error } = await client.POST(`/api/users/confirm/{token}`, {
        params: { path: { token: token! } },
      });

      if (error) {
        toaster.create({ description: t("user_confirm_error"), type: "error" });
      } else {
        toaster.create({
          description: t("user_confirm_success"),
          type: "success",
        });
      }

      void navigate("/", { replace: true });
    };

    void confirmUser();
  }, [token]);

  return <></>;
}

export default ConfirmUser;
