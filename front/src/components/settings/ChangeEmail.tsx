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
import { useApi } from "../../hooks/ApiProvider";
import { useState } from "react";
import { toaster } from "../ui/toaster";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (loading) return;
    setResponseError("");
    setLoading(true);
    const { error } = await client.PATCH("/api/users/settings/email", {
      body: data,
    });
    if (error) {
      if (error.errors.current_password)
        setResponseError(t("invalid_password"));
      else setResponseError(t("generic_error"));
    } else {
      toaster.create({
        description: t("email_change_sent"),
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
        <Button>{t("change_email")}</Button>
      </DialogTrigger>
      <DialogContent>
        {loading && (
          <AbsoluteCenter height="full" width="full" bg="bg/80" zIndex="max">
            <Spinner size="lg" />
          </AbsoluteCenter>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{t("change_email")}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Fieldset.Root invalid={!!responseError} disabled={loading}>
              <Fieldset.ErrorText>{responseError}</Fieldset.ErrorText>
              <Field.Root invalid={!!errors.email}>
                <Field.Label>{t("email")}</Field.Label>
                <Input
                  {...register("email", {
                    required: t("field_required"),
                    pattern: {
                      value: /.+@\S+\.\S+$/,
                      message: t("field_email_invalid"),
                    },
                  })}
                />
                {errors.email && (
                  <Field.ErrorText>{errors.email.message}</Field.ErrorText>
                )}
              </Field.Root>
              <Field.Root invalid={!!errors.current_password}>
                <Field.Label>{t("password")}</Field.Label>
                <PasswordInput
                  {...register("current_password", {
                    required: t("field_required"),
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
                {t("cancel")}
              </Button>
            </DialogActionTrigger>
            <Button type="submit" disabled={loading}>
              {t("save")}
            </Button>
          </DialogFooter>
          <DialogCloseTrigger disabled={loading} />
        </form>
      </DialogContent>
    </DialogRoot>
  );
}

export default ChangeEmail;
