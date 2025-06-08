"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, Edit, Trash2, Eye, Plus } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { Patient } from "./dashboard-overview";
import { PatientForm } from "./patient-form";
import PatientDeleteModal from "./patient-delete-modal";

export function PatientList() {
  const { t } = useTranslation();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const fetchPatients = async () => {
    try {
      const res = await fetch("/api/patients/get");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch patients");
      }

      setPatients(data);
    } catch (err: any) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchPatients();
  }, []);
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
  );

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/patients/delete/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to delete patient");
      }

      await fetchPatients();
    } catch (err: any) {
      console.error("Error deleting patient:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            {t("patients.title")}
          </h2>
          <p className="text-gray-600">{t("patients.subtitle")}</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t("patients.addPatient")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {t("patients.allPatients")} ({filteredPatients.length})
            </CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t("patients.searchPatients")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("patients.fields.name")}</TableHead>
                  <TableHead>{t("patients.fields.age")}</TableHead>
                  <TableHead>{t("patients.fields.contact")}</TableHead>
                  <TableHead>{t("patients.fields.lastVisit")}</TableHead>
                  <TableHead>{t("patients.fields.nextAppointment")}</TableHead>
                  <TableHead>{t("patients.fields.status")}</TableHead>
                  <TableHead className="text-right">
                    {t("common.edit")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">
                      {patient.name}
                    </TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{patient.email}</div>
                        <div className="text-sm text-gray-500">
                          {patient.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{Date.now()}</TableCell>
                    <TableCell>{Date.now()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          patient.status === "ACTIVE" ? "default" : "secondary"
                        }
                      >
                        {t(`common.${patient.status.toLowerCase()}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setSelectedPatient(patient)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            {t("patients.viewDetails")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setEditingPatient(patient)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {t("common.edit")}
                          </DropdownMenuItem>
                          <PatientDeleteModal
                            id={patient.id}
                            onDelete={handleDelete}
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Patient Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{t("patients.patientDetails")}</CardTitle>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedPatient(null)}
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{selectedPatient.name}</p>
              {/* Add all fields like name, age, contact etc. */}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{t("patients.addPatient")}</CardTitle>
                <Button
                  variant="ghost"
                  onClick={() => setShowAddModal(false)}
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <PatientForm
                onCancel={() => {
                  setShowAddModal(false);
                  fetchPatients();
                }}
                type="CREATE"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Patient Modal */}
      {editingPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{t("patients.editPatient")}</CardTitle>
                <Button
                  variant="ghost"
                  onClick={() => setEditingPatient(null)}
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <PatientForm
                patient={editingPatient}
                onCancel={() => {
                  setEditingPatient(null);
                  fetchPatients();
                }}
                type="UPDATE"
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
