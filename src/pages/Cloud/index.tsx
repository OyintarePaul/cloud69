import { Separator } from "@/components/ui/separator";
import Header from "./Header";
import Resources from "./Resources";

const Cloud = () => {
  return (
    <div className="p-2">
      <Header />
      <Separator className="my-2" />
      <Resources/>
    </div>
  );
};
export default Cloud;
