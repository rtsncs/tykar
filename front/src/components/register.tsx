import { Button, Input, Spinner, Field } from "@chakra-ui/react";
import { FormEvent, SetStateAction, useState } from "react";
import { useApi } from "../api/ApiProvider";
import type { components } from "../api/api";
import {
  DialogRoot,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogCloseTrigger,
} from "./ui/dialog";

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
    <DialogRoot open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>Register</DialogHeader>
        <form onSubmit={onRegister}>
          <DialogBody
            display="flex"
            flexDir="column"
            alignItems="center"
            gap={4}
          >
            {requestSend && <Spinner size="lg" />}
            <Field.Root
              required
              invalid={!username || errors?.errors.username != null}
            >
              <Field.Label>Username</Field.Label>
              <Input
                placeholder="Username"
                type="text"
                value={username}
                minLength={3}
                maxLength={32}
                onChange={handleNameChange}
              />
              <Field.ErrorText>{errors?.errors.username}</Field.ErrorText>
            </Field.Root>
            <Field.Root
              required
              invalid={!email || errors?.errors.email != null}
            >
              <Field.Label>Email</Field.Label>
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={handleEmailChange}
              />
              <Field.ErrorText>{errors?.errors.email}</Field.ErrorText>
            </Field.Root>
            <Field.Root
              required
              invalid={password.length < 8 || errors?.errors.password != null}
            >
              <Field.Label>Password</Field.Label>
              <Input
                placeholder="Password"
                type="password"
                value={password}
                minLength={8}
                onChange={handlePasswordChange}
              />
              <Field.ErrorText>{errors?.errors.password}</Field.ErrorText>
            </Field.Root>
            <Field.Root required invalid={passwordRepeat !== password}>
              <Field.Label>Repeat password</Field.Label>
              <Input
                placeholder="Repeat password"
                type="password"
                value={passwordRepeat}
                onChange={handlePasswordRepeatChange}
              />
            </Field.Root>
          </DialogBody>

          <DialogFooter>
            <Button variant="ghost" onClick={onClose} mr={3}>
              Cancel
            </Button>
            <Button colorScheme="blue" type="submit">
              Register
            </Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </form>
      </DialogContent>
    </DialogRoot>
  );
}

export default Register;
