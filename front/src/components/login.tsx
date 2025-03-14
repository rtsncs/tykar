import {
  AbsoluteCenter,
  Button,
  Field,
  Fieldset,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { LoginRequest, useSession } from "../AuthProvider";
import {
  DialogRoot,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogCloseTrigger,
  DialogTrigger,
  DialogActionTrigger,
} from "./ui/dialog";
import { Checkbox } from "./ui/checkbox";
import { SubmitHandler, useForm } from "react-hook-form";
import { PasswordInput } from "./ui/password-input";

function Login() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginRequest>();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseError, setResponseError] = useState("");

  const { login } = useSession();

  const onSubmit: SubmitHandler<LoginRequest> = async (data) => {
    if (loading) return;
    setResponseError("");
    setLoading(true);
    if (await login(data)) {
      setOpen(false);
      reset();
    } else {
      setResponseError("Invalid credentials");
    }
    setLoading(false);
  };

  return (
    <DialogRoot
      lazyMount
      open={open}
      onOpenChange={(e) => {
        if (!loading) setOpen(e.open);
      }}
    >
      <DialogTrigger asChild>
        <Button>Login</Button>
      </DialogTrigger>
      <DialogContent>
        {loading && (
          <AbsoluteCenter height="full" width="full" bg="bg/80" zIndex="max">
            <Spinner size="lg" />
          </AbsoluteCenter>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
          </DialogHeader>
          <DialogBody
            display="flex"
            flexDir="column"
            alignItems="center"
            gap={4}
          >
            <Fieldset.Root invalid={!!responseError} disabled={loading}>
              <Fieldset.ErrorText>{responseError}</Fieldset.ErrorText>
              <Field.Root invalid={!!errors.email_or_username}>
                <Field.Label>Email or username</Field.Label>
                <Input
                  type="text"
                  {...register("email_or_username", {
                    required: "This field is required",
                  })}
                />
                {errors.email_or_username && (
                  <Field.ErrorText>
                    {errors.email_or_username.message}
                  </Field.ErrorText>
                )}
              </Field.Root>
              <Field.Root invalid={!!errors.password}>
                <Field.Label>Password</Field.Label>
                <PasswordInput
                  {...register("password", {
                    required: "This field is required",
                  })}
                />
                {errors.password && (
                  <Field.ErrorText>{errors.password.message}</Field.ErrorText>
                )}
              </Field.Root>
              <Field.Root>
                <Checkbox>Remember me</Checkbox>
              </Field.Root>
            </Fieldset.Root>
          </DialogBody>

          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="ghost" disabled={loading}>
                Cancel
              </Button>
            </DialogActionTrigger>
            <Button type="submit" disabled={loading}>
              Login
            </Button>
          </DialogFooter>
          <DialogCloseTrigger disabled={loading} />
        </form>
      </DialogContent>
    </DialogRoot>
  );
}

export default Login;
