import { z } from "zod";

export const createSigninSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email({ message: t("auth.validation.emailInvalid") }),
    password: z.string().min(6, { message: t("auth.validation.passwordMin") }),
  });

export const createSignupSchema = (t: (key: string) => string) =>
  z
    .object({
      firstName: z
        .string()
        .min(1, { message: t("auth.validation.firstNameRequired") }),
      lastName: z
        .string()
        .min(1, { message: t("auth.validation.lastNameRequired") }),
      email: z.string().email({ message: t("auth.validation.emailInvalid") }),
      dateOfBirth: z
        .string()
        .min(1, { message: t("auth.validation.dobRequired") }),
      password: z
        .string()
        .min(6, { message: t("auth.validation.passwordMin") }),
      confirmPassword: z
        .string()
        .min(6, { message: t("auth.validation.confirmPasswordRequired") }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth.validation.passwordsNoMatch"),
      path: ["confirmPassword"],
    });

export type SigninFormValues = z.infer<ReturnType<typeof createSigninSchema>>;
export type SignupFormValues = z.infer<ReturnType<typeof createSignupSchema>>;

export const DUMMY_USER = {
  id: "1",
  firstName: "Dr. John",
  lastName: "Smith",
  email: "admin@dentalcare.com",
  dateOfBirth: "1980-05-15",
};
