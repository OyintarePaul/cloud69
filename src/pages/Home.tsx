import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center gap-4 text-center">
      <h1 className="text-6xl font-bold">Cloud 69</h1>
      <p className="tracking-tight text-gray-600">
        A very simple storage file management solution for work and personal
        needs
      </p>
      <Button>Get Started Now</Button>
    </div>
  );
};
export default Home;
