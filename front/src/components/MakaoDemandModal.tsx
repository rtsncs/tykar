import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
} from "@chakra-ui/react";

function MakaoDemandModal(props: {
  isOpen: boolean;
  type: "suit" | "rank";
  onClose: () => void;
  onSelect: (demand: string) => void;
}) {
  const { isOpen, type, onClose, onSelect } = props;

  const ranks = ["4", "5", "6", "7", "8", "9", "10", "Q"];
  const suits = ["Spades", "Hearts", "Diamonds", "Clubs"];

  const handleSelection = (demand: string) => {
    onSelect(demand);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Demand</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default MakaoDemandModal;
