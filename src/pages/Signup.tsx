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
import { signUp } from "@/firebase/auth";
import { Link, useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { FirebaseError } from "firebase/app";

const Signup = () => {
  const navigate = useNavigate();
  const { isPending, isError, mutate, error } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      return signUp(email, password);
    },
    onSuccess: (data) => {
      console.log(data);
      navigate("/", {
        replace: true,
      });
    },
    onError: (e: FirebaseError) => {
      console.log(e);
    },
    retry: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    mutate({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
  };
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>
            Create a new account below.
            {isError && (
              <span className="block text-red-500">{error.code}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Your email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full transition-colors" disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Create an Account"
            )}
          </Button>
          <p className="mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-primary">
              Login instead
            </Link>
          </p>
        </CardFooter>
      </Card>
    </form>
  );
};

export default Signup;
