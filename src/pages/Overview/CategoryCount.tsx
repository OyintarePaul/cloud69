import { getFileCategoryCount } from "@/appwrite/services";
import { useQuery } from "@tanstack/react-query";

const CategoryCount = ({
  category,
  id,
}: {
  category: string[];
  id: number;
}) => {
  const { data: count, isLoading } = useQuery({
    queryKey: ["category-count", id],
    queryFn: () => getFileCategoryCount(category),
  });

  //   useEffect(() => {
  //     if (count) console.log(count);
  //     if (error) console.log(error);
  //   }, [count, error]);
  return <span>{isLoading ? "Calculating..." : `${count} file(s)`}</span>;
};
export default CategoryCount;
