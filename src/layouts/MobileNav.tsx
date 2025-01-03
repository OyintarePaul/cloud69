import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AlignLeft } from "lucide-react";
import NavItems from "./NavItems";

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
        <nav className="mt-10">
          <NavItems />
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
