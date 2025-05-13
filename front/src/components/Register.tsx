import {
  Button,
  Input,
  Spinner,
  Field,
  AbsoluteCenter,
  Fieldset,
} from "@chakra-ui/react";
import { useState } from "react";
import { useApi } from "@/hooks/ApiProvider";
import type { components } from "@/types/api";
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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
      setResponseError(t("generic_error"));
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
        <Button>{t("register")}</Button>
      </DialogTrigger>
      <DialogContent>
        {loading && (
          <AbsoluteCenter height="full" width="full" bg="bg/80" zIndex="max">
            <Spinner size="lg" />
          </AbsoluteCenter>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{t("register")}</DialogTitle>
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
                <Field.Label>{t("username")}</Field.Label>
                <Input
                  {...register("username", {
                    required: t("field_required"),
                    minLength: {
                      value: 3,
                      message: t("field_min_len", { count: 3 }),
                    },
                    maxLength: {
                      value: 32,
                      message: t("field_max_len", { count: 32 }),
                    },
                  })}
                />
                {errors.username && (
                  <Field.ErrorText>{errors.username.message}</Field.ErrorText>
                )}
              </Field.Root>
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
              <Field.Root invalid={!!errors.password}>
                <Field.Label>{t("password")}</Field.Label>
                <PasswordInput
                  {...register("password", {
                    required: t("field_required"),
                    minLength: {
                      value: 8,
                      message: t("field_min_len", { count: 8 }),
                    },
                  })}
                />
                {errors.password && (
                  <Field.ErrorText>{errors.password.message}</Field.ErrorText>
                )}
              </Field.Root>
              <Field.Root invalid={!!errors.repeat_password}>
                <Field.Label>{t("repeat_password")}</Field.Label>
                <PasswordInput
                  {...register("repeat_password", {
                    validate: (value) => {
                      if (value !== password) return t("password_not_matching");
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
                {t("cancel")}
              </Button>
            </DialogActionTrigger>
            <Button type="submit" disabled={loading}>
              {t("register")}
            </Button>
          </DialogFooter>
          <DialogCloseTrigger disabled={loading} />
        </form>
      </DialogContent>
    </DialogRoot>
  );
}

export default Register;
