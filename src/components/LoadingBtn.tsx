import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "./ui/button";

interface IProps extends ButtonProps {
  isLoading: boolean;
}

const LoadingBtn = ({ isLoading, children, className, ...rest }: IProps) => {
  return (
    <Button className={className} disabled={isLoading} {...rest}>
      {isLoading ? <Loader2 className="size-4 animate-spin" /> : children}
    </Button>
  );
};
export default LoadingBtn;
