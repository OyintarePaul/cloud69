import { NavLink } from "react-router";
import { cn, navItems } from "@/lib/utils";

const NavItems = () => {
  return (
    <ul className="space-y-4">
      {navItems.map((item) => (
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
