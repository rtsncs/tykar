import {
  Box,
  Button,
  FormControl,
  FormLabel,
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
import { FormEvent, SetStateAction, useState } from "react";
import { useApi } from "../api/ApiProvider";

function Register(props: { isOpen: boolean; onClose: () => void }) {
  const { isOpen, onClose } = props;

  const [username, setName] = useState("");
  const handleNameChange = (e: { target: { value: SetStateAction<string> } }) =>
    setName(e.target.value);

  const [password, setPassword] = useState("");
  const handlePasswordChange = (e: {
    target: { value: SetStateAction<string> };
  }) => setPassword(e.target.value);

  const [passwordRepeat, setPasswordRepeat] = useState("");
  const handlePasswordRepeatChange = (e: {
    target: { value: SetStateAction<string> };
  }) => setPasswordRepeat(e.target.value);

  const [requestSend, setRequestSend] = useState(false);
  const [error, setError] = useState("");

  const client = useApi();

  function onRegister(e: FormEvent) {
    e.preventDefault();
    if (requestSend || password !== passwordRepeat) return;
    setRequestSend(true);
    setError("");
    client
      .register({ username, password })
      .then(() => {
        onClose();
      })
      .catch((e) => {
        void e;
        setError("Something went wrong.");
      })
      .finally(() => setRequestSend(false));
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Register</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={onRegister}>
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            gap={4}
          >
            {requestSend && <Spinner size="lg" />}
            {error && <Box color="error">{error}</Box>}
            <FormControl isRequired isInvalid={!username}>
              <FormLabel>Username</FormLabel>
              <Input
                placeholder="Username"
                type="text"
                value={username}
                minLength={3}
                maxLength={32}
                onChange={handleNameChange}
              />
            </FormControl>
            <FormControl isRequired isInvalid={password.length < 8}>
              <FormLabel>Password</FormLabel>
              <Input
                placeholder="Password"
                type="password"
                value={password}
                minLength={8}
                onChange={handlePasswordChange}
              />
            </FormControl>
            <FormControl isRequired isInvalid={passwordRepeat !== password}>
              <FormLabel>Repeat password</FormLabel>
              <Input
                placeholder="Repeat password"
                type="password"
                value={passwordRepeat}
                onChange={handlePasswordRepeatChange}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose} mr={3}>
              Cancel
            </Button>
            <Button colorScheme="blue" type="submit">
              Register
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default Register;
