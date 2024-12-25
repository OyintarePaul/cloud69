import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { logIn } from "@/firebase/auth";
import { useNavigate, Link } from "react-router";
import { Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { isPending, isError, mutate } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      return logIn(email, password);
    },
    onSuccess: () => {
      navigate("/", {
        replace: true,
      });
    },
    retry: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(e.currentTarget);
    const formData = new FormData(e.target as HTMLFormElement);
    mutate({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Please enter your username and password to login.
            {isError && (
              <p className="text-foreground-">Something went wrong</p>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="text"
              placeholder="Your email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full transition-colors" disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Log in"
            )}
          </Button>
          <p className="mt-2">
            New user? <Link to="/sign-up">Register now</Link>
          </p>
        </CardFooter>
      </Card>
    </form>
  );
};

export default Login;
