import { ClassValue } from "clsx";
import { Loader2 } from "lucide-react";

const ActivityIndicator = ({ className }: { className?: ClassValue }) => {
  return <Loader2 className={`animate-spin ${className}`} />;
};
export default ActivityIndicator;
