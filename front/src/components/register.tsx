import {
  Button,
  Input,
  Spinner,
  Field,
  AbsoluteCenter,
  Fieldset,
} from "@chakra-ui/react";
import { useState } from "react";
import { useApi } from "../api/ApiProvider";
import type { components } from "../api/api";
import {
  DialogRoot,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogCloseTrigger,
  DialogTitle,
  DialogActionTrigger,
  DialogTrigger,
} from "./ui/dialog";
import { useForm, SubmitHandler } from "react-hook-form";
import { PasswordInput } from "./ui/password-input";

type RegisterRequest = components["schemas"]["RegisterRequest"];
//type RegisterError = components["schemas"]["RegisterError"];
type Inputs = RegisterRequest & { repeat_password: string };

function Register() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseError, setResponseError] = useState("");

  const client = useApi();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (loading) return;
    setResponseError("");
    setLoading(true);
    const { error } = await client.POST("/api/users/register", {
      body: {
        email: data.email,
        username: data.username,
        password: data.password,
      },
    });
    if (!error) {
      setOpen(false);
      reset();
    } else {
      //TODO
      setResponseError("Something went wrong");
    }
    setLoading(false);
  };
  const password = watch("password", "");

  return (
    <DialogRoot
      lazyMount
      open={open}
      onOpenChange={(e) => {
        if (!loading) setOpen(e.open);
      }}
    >
      <DialogTrigger asChild>
        <Button>Register</Button>
      </DialogTrigger>
      <DialogContent>
        {loading && (
          <AbsoluteCenter height="full" width="full" bg="bg/80" zIndex="max">
            <Spinner size="lg" />
          </AbsoluteCenter>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Register</DialogTitle>
          </DialogHeader>
          <DialogBody
            display="flex"
            flexDir="column"
            alignItems="center"
            gap={4}
          >
            <Fieldset.Root invalid={!!responseError} disabled={loading}>
              <Fieldset.ErrorText>{responseError}</Fieldset.ErrorText>
              <Field.Root invalid={!!errors.username}>
                <Field.Label>Username</Field.Label>
                <Input
                  {...register("username", {
                    required: "This field is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                    maxLength: {
                      value: 32,
                      message: "Username must be at most 32 characters",
                    },
                  })}
                />
                {errors.username && (
                  <Field.ErrorText>{errors.username.message}</Field.ErrorText>
                )}
              </Field.Root>
              <Field.Root invalid={!!errors.email}>
                <Field.Label>Email</Field.Label>
                <Input
                  {...register("email", {
                    required: "This field is required",
                    pattern: {
                      value: /.+@\S+\.\S+$/,
                      message: "Enter a valid email",
                    },
                  })}
                />
                {errors.email && (
                  <Field.ErrorText>{errors.email.message}</Field.ErrorText>
                )}
              </Field.Root>
              <Field.Root invalid={!!errors.password}>
                <Field.Label>Password</Field.Label>
                <PasswordInput
                  {...register("password", {
                    required: "This field is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
                {errors.password && (
                  <Field.ErrorText>{errors.password.message}</Field.ErrorText>
                )}
              </Field.Root>
              <Field.Root invalid={!!errors.repeat_password}>
                <Field.Label>Repeat new password</Field.Label>
                <PasswordInput
                  {...register("repeat_password", {
                    validate: (value) => {
                      if (value !== password)
                        return "The passwords do not match";
                    },
                  })}
                />
                {errors.repeat_password && (
                  <Field.ErrorText>
                    {errors.repeat_password.message}
                  </Field.ErrorText>
                )}
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
              Register
            </Button>
          </DialogFooter>
          <DialogCloseTrigger disabled={loading} />
        </form>
      </DialogContent>
    </DialogRoot>
  );
}

export default Register;
