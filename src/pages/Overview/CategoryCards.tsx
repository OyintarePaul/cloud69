import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Film, Image, Music } from "lucide-react";

type Category = {
  id: number;
  label: string;
  bg: string;
  icon: React.ReactNode;
};
const categories = [
  {
    id: 1,
    label: "Images",
    bg: "bg-red-500/20",
    icon: <Image className="size-24 text-red-500" />,
  },
  {
    id: 2,
    label: "Audio",
    bg: "bg-blue-500/20",
    icon: <Music className="size-24 text-blue-500" />,
  },
  {
    id: 3,
    label: "Videos",
    bg: "bg-green-500/20",
    icon: <Film className="size-24 text-green-500" />,
  },
] satisfies Category[];

const CategoryCards = () => {
  return (
    <ul className="grid grid-cols-3 gap-6">
      {categories.map(({ id, bg, icon, label }) => (
        <li key={id}>
          <Card className={cn(bg)}>
            <CardContent className="p-6 aspect-square flex flex-col gap-1 items-center justify-center">
              {icon}
              <div className="text-center leading-tight">
                <p className="font-semibold">{label}</p>
                <span className="text-muted-foreground text-sm">
                  300+ files
                </span>
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
};
export default CategoryCards;
