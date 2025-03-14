import {
  AbsoluteCenter,
  Button,
  Field,
  Fieldset,
  Input,
  Spinner,
} from "@chakra-ui/react";
import {
  DialogRoot,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogActionTrigger,
  DialogCloseTrigger,
} from "../ui/dialog";
import { PasswordInput } from "../ui/password-input";
import { SubmitHandler, useForm } from "react-hook-form";
import { useApi } from "../../api/ApiProvider";
import { useState } from "react";
import { toaster } from "../ui/toaster";

interface Inputs {
  email: string;
  current_password: string;
}

function ChangeEmail() {
  const {
    register,
    handleSubmit,
    reset,
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
    const { error } = await client.PATCH("/api/users/settings/email", {
      body: data,
    });
    if (error) {
      if (error.errors.current_password) setResponseError("Invalid password");
      else setResponseError("Something went wrong");
    } else {
      toaster.create({
        description:
          "A link to confirm your email change has been sent to the new address",
        type: "success",
      });
      setOpen(false);
      reset();
      setResponseError("");
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
        <Button>Change email</Button>
      </DialogTrigger>
      <DialogContent>
        {loading && (
          <AbsoluteCenter height="full" width="full" bg="bg/80" zIndex="max">
            <Spinner size="lg" />
          </AbsoluteCenter>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Change email</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Fieldset.Root invalid={!!responseError} disabled={loading}>
              <Fieldset.ErrorText>{responseError}</Fieldset.ErrorText>
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
              <Field.Root invalid={!!errors.current_password}>
                <Field.Label>Password</Field.Label>
                <PasswordInput
                  {...register("current_password", {
                    required: "This field is required",
                  })}
                />
                {errors.current_password && (
                  <Field.ErrorText>
                    {errors.current_password.message}
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
              Save
            </Button>
          </DialogFooter>
          <DialogCloseTrigger disabled={loading} />
        </form>
      </DialogContent>
    </DialogRoot>
  );
}

export default ChangeEmail;
