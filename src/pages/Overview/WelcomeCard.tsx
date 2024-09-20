import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const WelcomeCard = () => {
  return (
    <Card className="bg-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome to Cloud69</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Cloud69 is a secure cloud storage platform that offers advanced
          encryption and robust security measures to protect your files. Upgrade
          to the premium plan for unlimited storage, faster speeds, and other
          exclusive features.
        </p>
      </CardContent>
      <CardFooter>
        <Button>Upgrade</Button>
      </CardFooter>
    </Card>
  );
};
export default WelcomeCard;
