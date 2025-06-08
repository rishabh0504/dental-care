"use client";

import {
  Users,
  MessageSquare,
  BarChart3,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";

type AppSidebarProps = {
  activeView: "overview" | "patients" | "chatbot";
  onViewChange: (view: "overview" | "patients" | "chatbot") => void;
  patientCount: number;
  onSignout: () => void;
  userEmail: string;
};

export function AppSidebar({
  activeView,
  onViewChange,
  patientCount,
  onSignout,
  userEmail,
}: AppSidebarProps) {
  const { t, isRTL } = useTranslation();

  const menuItems = [
    {
      title: t("navigation.dashboard"),
      icon: BarChart3,
      view: "overview" as const,
      badge: null,
    },
    {
      title: t("navigation.patients"),
      icon: Users,
      view: "patients" as const,
      badge: patientCount,
    },
    {
      title: t("navigation.aiAssistant"),
      icon: MessageSquare,
      view: "chatbot" as const,
      badge: null,
    },
  ];

  return (
    <Sidebar className="border-r">
      {/* Header */}
      <SidebarHeader className="p-6 border-b">
        <div
          className={`flex items-center gap-3 ${isRTL ? "no-rtl-flip" : ""}`}
        >
          <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <Calendar className="h-4 w-4 text-white" />
          </div>
          <div className="leading-tight">
            <h2 className="text-lg font-semibold text-gray-900">
              {t("brand.name")}
            </h2>
            <p className="text-sm text-gray-500">
              {t("navigation.patientManagement")}
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Main Menu */}
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.view}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.view)}
                    isActive={activeView === item.view}
                    className={`w-full justify-start ${
                      isRTL ? "no-rtl-flip" : ""
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                    {item.badge ? (
                      <Badge
                        variant="secondary"
                        className={isRTL ? "mr-auto" : "ml-auto"}
                      >
                        {item.badge}
                      </Badge>
                    ) : null}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with Settings, LanguageSwitcher, and Logout */}
      <SidebarFooter className="border-t">
        <div className="space-y-3">
          <div className="text-sm">
            <p className="font-medium text-gray-700">{t("auth.signedInAs")}</p>
            <p className="text-gray-600 truncate">{userEmail}</p>
          </div>

          <SidebarMenu className="">
            <SidebarMenuItem>
              <SidebarMenuButton className={isRTL ? "no-rtl-flip" : ""}>
                <Settings className="h-4 w-4" />
                <span>{t("navigation.settings")}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <div className={`w-full ${isRTL ? "no-rtl-flip" : ""}`}>
                <LanguageSwitcher />
              </div>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={onSignout}
                className={isRTL ? "no-rtl-flip" : ""}
              >
                <LogOut className="h-4 w-4" />
                <span>{t("auth.signout")}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
