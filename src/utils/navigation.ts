import {
  LayoutDashboard,
  CheckSquare,
  Tags,
  User,
  LogOut,
} from "lucide-react";
import type { NavItem, UserMenuAction } from "@/types/layout.types";

export const dashboardNavItems: NavItem[] = [
  {
    title: "dashboard.nav.dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "dashboard.nav.tasks",
    href: "/dashboard/tasks",
    icon: CheckSquare,
  },
  {
    title: "dashboard.nav.categories",
    href: "/dashboard/categories",
    icon: Tags,
  },
];

export const getUserMenuActions = (logout: () => void): UserMenuAction[] => [
  {
    label: "dashboard.nav.profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    label: "dashboard.nav.logout",
    onClick: logout,
    icon: LogOut,
    variant: "destructive",
  },
];
