import CategoryCards from "./CategoryCards";
import WelcomeCard from "./WelcomeCard";

const Overview = () => {
  return (
    <>
      <div className="flex">
        <div className="flex-1 p-4 space-y-8">
          <WelcomeCard />
          <CategoryCards />
        </div>
        <div className="w-1/3 p-4">Hello</div>
      </div>
    </>
  );
};
export default Overview;
