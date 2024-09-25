import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { DefaultApi } from "../api";

function Login(props: { isOpen: boolean; onClose: () => void }) {
  const { isOpen, onClose } = props;

  const [username, setName] = useState("");
  const handleNameChange = (e) => setName(e.target.value);

  const [password, setPassword] = useState("");
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const [requestSend, setRequestSend] = useState(false);

  const api = new DefaultApi();

  function login() {
    if (requestSend || !username || !password) return;
    setRequestSend(true);
    api.login({ username, password }).then(() => {
      setRequestSend(false);
    });
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Login</ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" flexDir="column" alignItems="center" gap={4}>
          {requestSend && <Spinner size="lg" />}
          <Input
            placeholder="Login"
            type="text"
            value={username}
            onChange={handleNameChange}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose} mr={3}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={login}>
            Login
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default Login;
