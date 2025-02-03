import { clsx, type ClassValue } from "clsx";
import { Cloudy, LayoutDashboard, Star, Trash2 } from "lucide-react";
import { twMerge } from "tailwind-merge";

export const navItems = [
  {
    label: "Overview",
    path: "/",
    icon: <LayoutDashboard className="size-4" />,
  },
  {
    label: "My Cloud",
    path: "/cloud/root",
    icon: <Cloudy className="size-4" />,
  },
  {
    label: "Favourites",
    path: "/favourites",
    icon: <Star className="size-4" />,
  },
  {
    label: "Trash",
    path: "/trash",
    icon: <Trash2 className="size-4" />,
  },
  // {
  //   label: "Settings",
  //   path: "/settings",
  //   icon: <Settings className="size-4" />,
  // },
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const randomID = () => {
  return Math.random().toString(20).substring(2, 16);
};

export const getFileExtension = (fileName: string) => fileName.split(".").pop();

export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < Math.pow(1024, 2)) {
    return `${(bytes / Math.pow(1024, 1)).toFixed(1)}KB`;
  }
  if (bytes < Math.pow(1024, 3)) {
    return `${(bytes / Math.pow(1024, 2)).toFixed(1)}MB`;
  }
};
