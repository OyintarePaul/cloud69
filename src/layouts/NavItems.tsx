import { LayoutDashboard, Cloudy, Star, Trash2, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
const items = [
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
  {
    label: "Settings",
    path: "/settings",
    icon: <Settings className="size-4" />,
  },
];

const NavItems = () => {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.label}>
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex gap-2 px-4 py-2 rounded-sm items-center font-semibold text-muted-foreground hover:bg-primary/20 transition-colors",
                {
                  "bg-primary/30 text-accent-foreground": isActive,
                }
              )
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default NavItems;
