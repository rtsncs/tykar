import {
  Button,
  chakra,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";

function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <chakra.header borderBottom="thin solid gray" boxShadow="md">
        <Flex p={8}>
          <Heading>Tykar</Heading>
          <Spacer />
          <Button onClick={onOpen}>Login</Button>
        </Flex>
      </chakra.header>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Login</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" gap={4}>
            <Input placeholder="Login" type="text" />
            <Input placeholder="Password" type="password" />
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose} mr={3}>
              Cancel
            </Button>
            <Button colorScheme="blue">Login</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Header;
