import {
  AbsoluteCenter,
  Button,
  Field,
  Fieldset,
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
  current_password: string;
  new_password: string;
  repeat_password: string;
}

function ChangePassword() {
  const {
    register,
    handleSubmit,
    watch,
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
    const { error } = await client.PATCH("/api/users/settings/password", {
      body: {
        current_password: data.current_password,
        new_password: data.new_password,
      },
    });
    if (error) {
      if (error.errors.current_password) setResponseError("Invalid password");
      else setResponseError("Something went wrong");
    } else {
      toaster.create({
        description: "Password changed successfully",
        type: "success",
      });
      setOpen(false);
      reset();
      setResponseError("");
    }
    setLoading(false);
  };
  const password = watch("new_password", "");

  return (
    <DialogRoot
      lazyMount
      open={open}
      onOpenChange={(e) => {
        if (!loading) setOpen(e.open);
      }}
    >
      <DialogTrigger asChild>
        <Button>Change password</Button>
      </DialogTrigger>
      <DialogContent>
        {loading && (
          <AbsoluteCenter height="full" width="full" bg="bg/80" zIndex="max">
            <Spinner size="lg" />
          </AbsoluteCenter>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Fieldset.Root invalid={!!responseError} disabled={loading}>
              <Fieldset.ErrorText>{responseError}</Fieldset.ErrorText>
              <Field.Root invalid={!!errors.new_password}>
                <Field.Label>New password</Field.Label>
                <PasswordInput
                  {...register("new_password", {
                    required: "This field is required",
                  })}
                />
                {errors.new_password && (
                  <Field.ErrorText>
                    {errors.new_password.message}
                  </Field.ErrorText>
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
              <Field.Root invalid={!!errors.current_password}>
                <Field.Label>Current password</Field.Label>
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

export default ChangePassword;
