import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import BreadCrumb from "./BreadCrumb";
import { useNavigate } from "react-router";
const Navigation = () => {
  const navigate = useNavigate();
  return (
    <div className="flex gap-4 items-center">
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>
        <Button variant="ghost" size="icon">
          <ArrowRight />
        </Button>
      </div>
      <BreadCrumb />
    </div>
  );
};
export default Navigation;
