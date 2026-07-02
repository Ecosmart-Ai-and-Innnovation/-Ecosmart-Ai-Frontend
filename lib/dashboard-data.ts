import {
  Camera,
  Upload,
  Keyboard,
  History,
  Home,
  ScanLine,
  BarChart3,
  UserCircle2,
} from "lucide-react";
import type { QuickAction, NavItem } from "@/types/dashboard";

//Quick Actions
export const quickActions: QuickAction[] = [
  { id: "scan", label: "Scan", icon: Camera },
  { id: "upload", label: "Upload", icon: Upload },
  { id: "type", label: "Type", icon: Keyboard },
  { id: "history", label: "History", icon: History },
];

//Nav
export const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "scan", label: "Scan", icon: ScanLine },
  { id: "activity", label: "Activity", icon: BarChart3 },
  { id: "profile", label: "Profile", icon: UserCircle2 },
];