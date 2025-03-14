import { DataList, Heading, Stack } from "@chakra-ui/react";
import { useSession } from "../AuthProvider";
import ChangeEmail from "../components/settings/ChangeEmail";
import ChangePassword from "../components/settings/ChangePassword";
import { useTranslation } from "react-i18next";

function Settings() {
  const { session } = useSession();
  const { t } = useTranslation();

  return (
    <Stack gap="4">
      <Heading size="2xl">{t("settings")}</Heading>
      <DataList.Root variant="subtle" orientation="horizontal">
        <DataList.Item>
          <DataList.ItemLabel>{t("username")}</DataList.ItemLabel>
          <DataList.ItemValue>{session?.username}</DataList.ItemValue>
        </DataList.Item>
        <DataList.Item>
          <DataList.ItemLabel>{t("email")}</DataList.ItemLabel>
          <DataList.ItemValue>{session?.email}</DataList.ItemValue>
        </DataList.Item>
      </DataList.Root>
      <Stack direction="row">
        <ChangeEmail />
        <ChangePassword />
      </Stack>
    </Stack>
  );
}

export default Settings;
