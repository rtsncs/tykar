import {
  Box,
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
import { SetStateAction, useState } from "react";
import { ResponseError } from "../api/gen";
import { useSession } from "../AuthProvider";

function Login(props: { isOpen: boolean; onClose: () => void }) {
  const { isOpen, onClose } = props;

  const [username, setName] = useState("");
  const handleNameChange = (e: { target: { value: SetStateAction<string> } }) =>
    setName(e.target.value);

  const [password, setPassword] = useState("");
  const handlePasswordChange = (e: {
    target: { value: SetStateAction<string> };
  }) => setPassword(e.target.value);

  const [requestSend, setRequestSend] = useState(false);
  const [error, setError] = useState("");

  const { login } = useSession();

  function onLogin() {
    if (requestSend || !username || !password) return;
    setRequestSend(true);
    setError("");
    login({ username, password })
      .then(() => {
        onClose();
      })
      .catch((e) => {
        if (e instanceof ResponseError && e.response.status === 401) {
          setError("Invalid credentials.");
        } else {
          setError("Something went wrong.");
        }
      })
      .finally(() => setRequestSend(false));
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Login</ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" flexDir="column" alignItems="center" gap={4}>
          {requestSend && <Spinner size="lg" />}
          {error && <Box color="error">{error}</Box>}
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
          <Button colorScheme="blue" onClick={onLogin}>
            Login
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default Login;
