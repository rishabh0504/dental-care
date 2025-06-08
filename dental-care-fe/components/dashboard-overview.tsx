import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Clock, TrendingUp } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import type { PatientFormValues } from "@/lib/schema";
export type Patient = PatientFormValues & { id: number };

type DashboardOverviewProps = {
  patients?: Patient[];
};

export default function DashboardOverview({
  patients = [],
}: DashboardOverviewProps) {
  const { t } = useTranslation();

  const activePatients = patients.filter((p) => p.status === "ACTIVE").length;
  const upcomingAppointments = patients.filter((p) => {
    const appointmentDate = new Date();
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return appointmentDate >= today && appointmentDate <= nextWeek;
  }).length;

  const recentPatients = patients
    .sort((a, b) => new Date().getTime() - new Date().getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          {t("dashboard.overview")}
        </h2>
        <p className="text-gray-600">{t("dashboard.welcomeMessage")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.totalPatients")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
            <p className="text-xs text-muted-foreground">
              {activePatients} {t("dashboard.activePatients")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.upcomingAppointments")}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments}</div>
            <p className="text-xs text-muted-foreground">
              {t("dashboard.nextDays")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.recentVisits")}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                patients.filter((p) => {
                  const lastVisit = new Date();
                  const thirtyDaysAgo = new Date(
                    Date.now() - 30 * 24 * 60 * 60 * 1000
                  );
                  return lastVisit >= thirtyDaysAgo;
                }).length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {t("dashboard.lastDays")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.growthRate")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <p className="text-xs text-muted-foreground">
              {t("dashboard.fromLastMonth")}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.recentPatientsTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-gray-500">
                      {t("dashboard.lastVisit")} {Date.now()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {t("dashboard.age")} {patient.age}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t(`common.${patient.status.toLowerCase()}`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.quickActions")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="font-medium">
                  {t("dashboard.scheduleAppointment")}
                </div>
                <div className="text-sm text-gray-500">
                  {t("dashboard.scheduleAppointmentDesc")}
                </div>
              </button>
              <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="font-medium">
                  {t("dashboard.viewTodaySchedule")}
                </div>
                <div className="text-sm text-gray-500">
                  {t("dashboard.viewTodayScheduleDesc")}
                </div>
              </button>
              <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="font-medium">
                  {t("dashboard.patientReports")}
                </div>
                <div className="text-sm text-gray-500">
                  {t("dashboard.patientReportsDesc")}
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
