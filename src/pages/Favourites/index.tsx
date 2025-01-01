import ActivityIndicator from "@/components/ActivityIndicator";
import { getFavourites } from "@/firebase/services";
import { useQuery } from "@tanstack/react-query";
import FavouritesList from "./FavouritesList";

const Favourites = () => {
  const {
    isLoading,
    data: resources,
    error,
  } = useQuery({
    queryKey: ["favourites"],
    queryFn: () => getFavourites(),
  });
  if (error) return <div>Error: {error.message}</div>;
  if (isLoading) return <ActivityIndicator />;
  if (resources) return <FavouritesList resources={resources} />;
};
export default Favourites;
