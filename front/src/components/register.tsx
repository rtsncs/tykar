import {
  Button,
  FormControl,
  FormErrorMessage,
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
import type { components } from "../api/api";

type RegisterError = components["schemas"]["RegisterError"];

function Register(props: { isOpen: boolean; onClose: () => void }) {
  const { isOpen, onClose } = props;

  const [username, setName] = useState("");
  const handleNameChange = (e: { target: { value: SetStateAction<string> } }) =>
    setName(e.target.value);

  const [email, setEmail] = useState("");
  const handleEmailChange = (e: {
    target: { value: SetStateAction<string> };
  }) => setEmail(e.target.value);

  const [password, setPassword] = useState("");
  const handlePasswordChange = (e: {
    target: { value: SetStateAction<string> };
  }) => setPassword(e.target.value);

  const [passwordRepeat, setPasswordRepeat] = useState("");
  const handlePasswordRepeatChange = (e: {
    target: { value: SetStateAction<string> };
  }) => setPasswordRepeat(e.target.value);

  const [requestSend, setRequestSend] = useState(false);
  const [errors, setErrors] = useState<RegisterError | null>(null);

  const client = useApi();

  function onRegister(e: FormEvent) {
    e.preventDefault();
    if (requestSend || password !== passwordRepeat) return;
    setRequestSend(true);
    setErrors(null);
    const register = async () => {
      const { error } = await client.POST("/api/users/register", {
        body: { username, email, password },
      });
      if (!error) {
        onClose();
      } else {
        console.log(error);
        setErrors(error);
      }
      setRequestSend(false);
    };

    void register();
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
            <FormControl
              isRequired
              isInvalid={!username || errors?.errors.username != null}
            >
              <FormLabel>Username</FormLabel>
              <Input
                placeholder="Username"
                type="text"
                value={username}
                minLength={3}
                maxLength={32}
                onChange={handleNameChange}
              />
              <FormErrorMessage>{errors?.errors.username}</FormErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={!email || errors?.errors.email != null}
            >
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={handleEmailChange}
              />
              <FormErrorMessage>{errors?.errors.email}</FormErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={password.length < 8 || errors?.errors.password != null}
            >
              <FormLabel>Password</FormLabel>
              <Input
                placeholder="Password"
                type="password"
                value={password}
                minLength={8}
                onChange={handlePasswordChange}
              />
              <FormErrorMessage>{errors?.errors.password}</FormErrorMessage>
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
