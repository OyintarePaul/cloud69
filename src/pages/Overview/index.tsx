import { useQuery } from "@tanstack/react-query";
import Analytics from "./Analytics";
import CategoryCards from "./CategoryCards";
import RecentFiles from "./RecentFiles";
import WelcomeCard from "./WelcomeCard";

const Overview = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["overview"],
    queryFn: () => {},
  });

  return (
    <>
      <div className="lg:flex">
        <div className="flex-1 p-4 space-y-8">
          <section>
            <WelcomeCard />
          </section>
          <section>
            <CategoryCards />
          </section>
          <section>
            <RecentFiles />
          </section>
        </div>
        <aside className="w-1/3 p-4">
          <Analytics />
        </aside>
      </div>
    </>
  );
};
export default Overview;
