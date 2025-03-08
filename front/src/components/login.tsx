import {
  Box,
  Button,
  CheckboxCheckedChangeDetails,
  Field,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { useSession } from "../AuthProvider";
import {
  DialogRoot,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogCloseTrigger,
} from "./ui/dialog";
import { Checkbox } from "./ui/checkbox";

function Login(props: { isOpen: boolean; onClose: () => void }) {
  const { isOpen, onClose } = props;

  const [email_or_username, setEmailOrName] = useState("");
  const handleEmailorNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEmailOrName(e.target.value);

  const [password, setPassword] = useState("");
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const [remember_me, setRememberMe] = useState(false);
  const handleRememberMeChange = (e: CheckboxCheckedChangeDetails) =>
    setRememberMe(!!e.checked);

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
    <DialogRoot open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
        </DialogHeader>
        <form onSubmit={onLogin}>
          <DialogBody
            display="flex"
            flexDir="column"
            alignItems="center"
            gap={4}
          >
            {requestSend && <Spinner size="lg" />}
            {error && <Box color="error">{error}</Box>}
            <Field.Root required invalid={!email_or_username}>
              <Field.Label>Email or username</Field.Label>
              <Input
                placeholder="Email or username"
                type="text"
                value={email_or_username}
                onChange={handleEmailorNameChange}
              />
            </Field.Root>
            <Field.Root required invalid={!password}>
              <Field.Label>Password</Field.Label>
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </Field.Root>
            <Field.Root>
              <Checkbox
                checked={remember_me}
                onCheckedChange={handleRememberMeChange}
              >
                Remember me
              </Checkbox>
            </Field.Root>
          </DialogBody>

          <DialogFooter>
            <Button variant="ghost" onClick={onClose} mr={3}>
              Cancel
            </Button>
            <Button colorScheme="blue" type="submit">
              Login
            </Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </form>
      </DialogContent>
    </DialogRoot>
  );
}

export default Login;
