import {
  AbsoluteCenter,
  Button,
  Field,
  Fieldset,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { LoginRequest, useSession } from "../hooks/AuthProvider";
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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const onSubmit: SubmitHandler<LoginRequest> = async (data) => {
    if (loading) return;
    setResponseError("");
    setLoading(true);
    if (await login(data)) {
      setOpen(false);
      reset();
    } else {
      setResponseError(t("invalid_credentials"));
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
        <Button>{t("login")}</Button>
      </DialogTrigger>
      <DialogContent>
        {loading && (
          <AbsoluteCenter height="full" width="full" bg="bg/80" zIndex="max">
            <Spinner size="lg" />
          </AbsoluteCenter>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{t("login")}</DialogTitle>
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
                <Field.Label>{t("email_or_username")}</Field.Label>
                <Input
                  type="text"
                  {...register("email_or_username", {
                    required: t("field_required"),
                  })}
                />
                {errors.email_or_username && (
                  <Field.ErrorText>
                    {errors.email_or_username.message}
                  </Field.ErrorText>
                )}
              </Field.Root>
              <Field.Root invalid={!!errors.password}>
                <Field.Label>{t("password")}</Field.Label>
                <PasswordInput
                  {...register("password", {
                    required: t("field_required"),
                  })}
                />
                {errors.password && (
                  <Field.ErrorText>{errors.password.message}</Field.ErrorText>
                )}
              </Field.Root>
              <Field.Root>
                <Checkbox>{t("remember_me")}</Checkbox>
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
              {t("login")}
            </Button>
          </DialogFooter>
          <DialogCloseTrigger disabled={loading} />
        </form>
      </DialogContent>
    </DialogRoot>
  );
}

export default Login;
