import { VStack } from "@chakra-ui/react";
import { t } from "i18next";
import { LuDices } from "react-icons/lu";
import { TbPlayCard } from "react-icons/tb";
import Link from "@/components/ui/link";

export default function Index() {
  return (
    <VStack alignItems="flex-start" fontSize="xl">
      <Link to="makao">
        <TbPlayCard /> {t("makao")}
      </Link>
      <Link to="dice_poker">
        <LuDices /> {t("dice_poker")}
      </Link>
    </VStack>
  );
}
