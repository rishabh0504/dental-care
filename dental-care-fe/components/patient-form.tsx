"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/lib/i18n";
import type { PatientFormValues } from "@/lib/schema";
import { createPatientSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type PatientFormProps = {
  patient?: any | null;
  onCancel: () => void;
  type: "CREATE" | "UPDATE";
};

export function PatientForm({
  patient,
  onCancel,
  type = "CREATE",
}: PatientFormProps) {
  const { t } = useTranslation();

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(createPatientSchema(t)),
    mode: "onChange",
    defaultValues: {
      name: "",
      age: 0,
      email: "",
      phone: "",
      address: "",
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    if (patient) {
      form.reset({
        id: patient.id,
        name: patient.name ?? "",
        age: patient.age ?? 0,
        email: patient.email ?? "",
        phone: patient.phone ?? "",
        address: patient.address ?? "",
        status: patient.status ?? "Active",
      });
    } else {
      form.reset({
        name: "",
        age: 0,
        email: "",
        phone: "",
        address: "",
        status: "ACTIVE",
      });
    }
  }, [patient, form]);

  const handleFormSubmit = async (data: PatientFormValues) => {
    debugger;
    try {
      if (type === "CREATE") {
        const response = await fetch("/api/patients/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.error || "Failed to create patient");
        }
      } else {
        const response = await fetch(`/api/patients/update/${data?.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.error || "Failed to update patient");
        }
      }

      onCancel();
    } catch (error: any) {
      console.error("Create or Update patient error:", error);
    }
  };
  return (
    <div className="space-y-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("patients.fields.name")} *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("patients.placeholders.name")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("patients.fields.age")} *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      placeholder={t("patients.placeholders.age")}
                      min={1}
                      max={120}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("patients.fields.email")} *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      placeholder={t("patients.placeholders.email")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("patients.fields.phone")} *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("patients.placeholders.phone")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("patients.fields.address")} *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("patients.placeholders.address")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("patients.fields.status")}</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("patients.fields.status")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">
                        {t("common.active")}
                      </SelectItem>
                      <SelectItem value="INACTIVE">
                        {t("common.inactive")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Button type="submit">
              {patient ? t("common.update") : t("common.add")}
              {t("navigation.patients").slice(0, -1)}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              {t("common.cancel")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
