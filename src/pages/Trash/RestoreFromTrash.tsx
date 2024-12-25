import ActivityIndicator from "@/components/ActivityIndicator";
import { Button } from "@/components/ui/button";
import { restoreFromTrash } from "@/firebase/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Undo } from "lucide-react";

const RestoreFromTrash = ({ resourceID }: { resourceID: string }) => {
  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: () => restoreFromTrash(resourceID),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["trash"],
      });
    },
  });

  const handleRestore = () => {
    mutate();
  };
  return (
    <Button
      size="icon"
      variant="ghost"
      disabled={isPending}
      onClick={handleRestore}
    >
      {isPending ? (
        <ActivityIndicator className="size-4" />
      ) : (
        <Undo className="size-4" />
      )}
    </Button>
  );
};
export default RestoreFromTrash;
