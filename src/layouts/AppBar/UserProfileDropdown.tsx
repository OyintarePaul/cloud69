import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";

import { useAuth } from "@/providers/auth";
import { CircleUserRound } from "lucide-react";

const UserProfileDropdown = () => {
  const { user, logout } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span className="flex gap-1 items-center">
          <span className="hidden lg:block">{user?.email}</span>
          <Avatar>
            <AvatarFallback className="bg-transparent">
              <CircleUserRound className="size-8" />
            </AvatarFallback>
          </Avatar>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()}>Log Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserProfileDropdown;
