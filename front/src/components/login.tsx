import {
  Box,
  Button,
  Checkbox,
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
import { ChangeEvent, FormEvent, useState } from "react";
import { useSession } from "../AuthProvider";

function Login(props: { isOpen: boolean; onClose: () => void }) {
  const { isOpen, onClose } = props;

  const [email_or_username, setEmailOrName] = useState("");
  const handleEmailorNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEmailOrName(e.target.value);

  const [password, setPassword] = useState("");
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const [remember_me, setRememberMe] = useState(false);
  const handleRememberMeChange = (e: ChangeEvent<HTMLInputElement>) =>
    setRememberMe(e.target.checked);

  const [requestSend, setRequestSend] = useState(false);
  const [error, setError] = useState("");

  const { login } = useSession();

  function onLogin(e: FormEvent) {
    e.preventDefault();
    if (requestSend) return;
    setRequestSend(true);
    setError("");
    void login({ email_or_username, password, remember_me }).then((success) => {
      if (success) {
        onClose();
      } else {
        setError("Invalid credentials.");
      }
      setRequestSend(false);
    });
    //if (e instanceof ResponseError && e.response.status === 401) {
    //} else {
    //  setError("Something went wrong.");
    //}
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Login</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={onLogin}>
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            gap={4}
          >
            {requestSend && <Spinner size="lg" />}
            {error && <Box color="error">{error}</Box>}
            <FormControl isRequired isInvalid={!email_or_username}>
              <FormLabel>Email or username</FormLabel>
              <Input
                placeholder="Email or username"
                type="text"
                value={email_or_username}
                onChange={handleEmailorNameChange}
              />
            </FormControl>
            <FormControl isRequired isInvalid={!password}>
              <FormLabel>Password</FormLabel>
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </FormControl>
            <FormControl>
              <Checkbox
                isChecked={remember_me}
                onChange={handleRememberMeChange}
              >
                Remember me
              </Checkbox>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose} mr={3}>
              Cancel
            </Button>
            <Button colorScheme="blue" type="submit">
              Login
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default Login;
