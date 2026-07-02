import type { ComponentType } from "react";

export type Status = "Recycled" | "Pending";

export type ActivityItem = {
  _id: string;
  title: string;
  time?: string;
  amount: number;
  status: Status;
};

export type QuickAction = {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

export type NavItem = {
  id: "home" | "scan" | "activity" | "profile";
  label: string;
  icon: ComponentType<{ className?: string }>;
};