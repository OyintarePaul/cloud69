import ActivityIndicator from "@/components/ActivityIndicator";
import { getTrash } from "@/firebase/services";
import { useQuery } from "@tanstack/react-query";
import TrashList from "./TrashList";

const Trash = () => {
  const {
    isLoading,
    data: resources,
    error,
  } = useQuery({
    queryKey: ["trash"],
    queryFn: () => getTrash(),
  });
  if (error) return <div>Error: {error.message}</div>;
  if (isLoading) return <ActivityIndicator />;
  if (resources) return <TrashList resources={resources} />;
};
export default Trash;
