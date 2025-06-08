import { z } from "zod";

export const createPatientSchema = (t: (key: string) => string) =>
  z.object({
    id: z.number().optional(),
    name: z.string().min(1, { message: t("patients.validation.nameRequired") }),
    age: z.coerce
      .number()
      .int()
      .min(1, { message: t("patients.validation.ageMin") })
      .max(120, { message: t("patients.validation.ageMax") }),
    email: z.string().email({ message: t("patients.validation.emailInvalid") }),
    phone: z
      .string()
      .min(1, { message: t("patients.validation.phoneRequired") }),
    address: z
      .string()
      .min(1, { message: t("patients.validation.addressRequired") }),
    status: z.enum(["ACTIVE", "INACTIVE"]),
  });

export type PatientFormValues = z.infer<ReturnType<typeof createPatientSchema>>;
