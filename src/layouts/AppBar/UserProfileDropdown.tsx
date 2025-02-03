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
import { useMutation } from "@tanstack/react-query";

const UserProfileDropdown = () => {
  const { user, logout } = useAuth();
  const { mutate } = useMutation({
    mutationFn: logout,
  });
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
        <DropdownMenuItem onClick={() => mutate()}>Log Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserProfileDropdown;
