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
    icon: <Image className="size-24" />,
  },
  {
    id: 2,
    label: "Audio",
    bg: "bg-blue-500/20",
    icon: <Music className="size-24" />,
  },
  {
    id: 3,
    label: "Videos",
    bg: "bg-green-500/20",
    icon: <Film className="size-24" />,
  },
] satisfies Category[];

const CategoryCards = () => {
  return (
    <div>
      <ul className="grid grid-cols-3 gap-6">
        {categories.map((cat) => (
          <li key={cat.id} className="space-y-2">
            <Card className={cn(cat.bg, "aspect-square")}>
              <CardContent className="p-6 h-full">
                <div className="flex items-center justify-center h-full">
                  {cat.icon}
                </div>
              </CardContent>
            </Card>
            <p className="text-center font-semibold">{cat.label}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default CategoryCards;
