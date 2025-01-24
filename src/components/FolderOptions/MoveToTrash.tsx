import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moveToTrash } from "@/appwrite/services";
import { useParams } from "react-router";
import { Trash2 } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";

const MoveToTrash = ({
  id,
  closeDropdown,
}: {
  id: string;
  closeDropdown: () => void;
}) => {
  const { id: parentID } = useParams();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () => {
      return moveToTrash(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["resources", parentID],
      });
      queryClient.invalidateQueries({
        queryKey: ["recent"],
      });

      closeDropdown();
    },
  });
  const handleMoveToTrash = () => {
    mutate();
  };

  return (
    <DropdownMenuItem
      className="flex gap-2 items-center text-red-600"
      onClick={(e) => {
        e.stopPropagation();
        handleMoveToTrash();
      }}
    >
      <Trash2 className="size-4" /> Move to trash
    </DropdownMenuItem>
  );
};
export default MoveToTrash;
