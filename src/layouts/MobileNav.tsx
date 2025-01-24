import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn, navItems } from "@/lib/utils";
import { AlignLeft } from "lucide-react";
import { NavLink } from "react-router";

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="md:hidden -translate-x-2"
          size="icon"
          variant="ghost"
        >
          <AlignLeft className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="px-2" side="left">
        <nav className="mt-10 flex gap-4 flex-col">
          {navItems.map((item) => (
            <SheetClose key={item.label} asChild className="flex">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex gap-4 px-4 py-2 rounded-sm items-center font-semibold text-muted-foreground hover:bg-primary/20 transition-colors",

                    {
                      "bg-primary/30 text-accent-foreground": isActive,
                    }
                  )
                }
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
