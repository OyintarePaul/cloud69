import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Film, Image, Music } from "lucide-react";
import CategoryCount from "./CategoryCount";
import { audio, document, image, video } from "@/lib/mime-types";
import { Link } from "react-router";

type Category = {
  id: number;
  label: string;
  bg: string;
  icon: React.ReactNode;
  category: string[];
  href: string;
};
const categories = [
  {
    id: 1,
    label: "Images",
    bg: "bg-red-500/20",
    icon: <Image className="size-24 text-red-500" />,
    category: image,
    href: "category/image",
  },
  {
    id: 2,
    label: "Audio",
    bg: "bg-blue-500/20",
    icon: <Music className="size-24 text-blue-500" />,
    category: audio,
    href: "category/audio",
  },
  {
    id: 3,
    label: "Documents",
    bg: "bg-green-500/20",
    icon: <Film className="size-24 text-green-500" />,
    category: document,
    href: "category/document",
  },
] satisfies Category[];

const CategoryCards = () => {
  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {categories.map(({ id, bg, icon, label, category, href }) => (
        <li key={id}>
          <Link to={href}>
            <Card className={cn(bg)}>
              <CardContent className="p-6 aspect-square flex flex-col gap-1 items-center justify-center">
                {icon}
                <div className="text-center leading-tight">
                  <p className="font-semibold">{label}</p>
                  <span className="text-muted-foreground text-sm">
                    <CategoryCount category={category} id={id} />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
};
export default CategoryCards;
