import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center gap-4 text-center">
      <h1 className="text-6xl font-bold">Cloud 69</h1>
      <p className="tracking-tight text-gray-600">
        A very simple file management solution for work and personal needs
      </p>
      <Button asChild>
        <Link to="/dashboard/overview">Get Started Now</Link>
      </Button>
    </div>
  );
};
export default Home;
