"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PatientForm } from "@/components/patient-form";
import { useTranslation } from "@/lib/i18n";
import { Separator } from "@/components/ui/separator";
import type { Patient } from "./dashboard-overview";

type PatientModalProps = {
  isOpen: boolean;
  onClose: () => void;
  patient?: Patient | null;
  onSubmit: (patient: Omit<Patient, "id"> | Patient) => void;
};

export function PatientModal({
  isOpen,
  onClose,
  patient,
  onSubmit,
}: PatientModalProps) {
  const { t } = useTranslation();

  const handleSubmit = (patientData: Omit<Patient, "id"> | Patient) => {
    onSubmit(patientData);
    onClose(); // Close modal after submission
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {patient ? t("patients.editPatient") : t("patients.addNewPatient")}
          </DialogTitle>
          <Separator className="my-2" />
        </DialogHeader>

        <PatientForm patient={patient} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
}
