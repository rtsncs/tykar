import { DataList, Heading, Stack } from "@chakra-ui/react";
import { useSession } from "../AuthProvider";
import ChangeEmail from "../components/settings/ChangeEmail";
import ChangePassword from "../components/settings/ChangePassword";

function Settings() {
  const { session } = useSession();
  return (
    <Stack gap="4">
      <Heading size="2xl">Settings</Heading>
      <DataList.Root variant="subtle" orientation="horizontal">
        <DataList.Item>
          <DataList.ItemLabel>Username</DataList.ItemLabel>
          <DataList.ItemValue>{session?.username}</DataList.ItemValue>
        </DataList.Item>
        <DataList.Item>
          <DataList.ItemLabel>Email</DataList.ItemLabel>
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
