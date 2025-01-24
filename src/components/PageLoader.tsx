import { Loader2 } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="h-80 flex justify-center items-center ">
      <Loader2 className="text-foreground animate-spin size-8" />
    </div>
  );
};
export default PageLoader;
