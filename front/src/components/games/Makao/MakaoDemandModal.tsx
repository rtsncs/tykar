import { Button, SimpleGrid } from "@chakra-ui/react";
import {
  DialogRoot,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogCloseTrigger,
} from "../../ui/dialog";
import { useTranslation } from "react-i18next";

function MakaoDemandModal(props: {
  isOpen: boolean;
  type: "suit" | "rank";
  onClose: () => void;
  onSelect: (demand: string) => void;
}) {
  const { isOpen, type, onClose, onSelect } = props;

  const { t } = useTranslation();

  const ranks = ["4", "5", "6", "7", "8", "9", "10", "Q"];
  const suits = ["Spades", "Hearts", "Diamonds", "Clubs"];

  const handleSelection = (demand: string) => {
    onSelect(demand);
    onClose();
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("make_demand")}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <SimpleGrid columns={2} gap="8px">
            {type === "suit"
              ? suits.map((suit) => (
                  <Button key={suit} onClick={() => handleSelection(suit)}>
                    {suit}
                  </Button>
                ))
              : ranks.map((rank) => (
                  <Button key={rank} onClick={() => handleSelection(rank)}>
                    {rank}
                  </Button>
                ))}
          </SimpleGrid>
        </DialogBody>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}

export default MakaoDemandModal;
