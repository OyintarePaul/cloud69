import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toggleFavourites } from "@/firebase/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useParams } from "react-router";

const AddToFavourites = ({
  resourceID,
  favourite,
}: {
  resourceID: string;
  closeDropdown: () => void;
  favourite: boolean;
}) => {
  const { id: parentID } = useParams();
  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: () => {
      return toggleFavourites(resourceID, !favourite);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["resources", parentID],
      });
    },
  });

  const handleAddToFavourites = () => {
    mutate();
  };

  return (
    <DropdownMenuItem
      className="flex gap-2 items-center"
      onClick={handleAddToFavourites}
      disabled={isPending}
    >
      <Star className="size-4" />
      {favourite ? "Remove from favourites" : "Add to favourites"}
    </DropdownMenuItem>
  );
};
export default AddToFavourites;
