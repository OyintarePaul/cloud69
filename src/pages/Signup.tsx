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

import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";

import { useAuth } from "@/providers/auth";
import LoadingBtn from "@/components/LoadingBtn";

const Signup = () => {
  const navigate = useNavigate();
  const { createUser } = useAuth();
  const { isPending, mutate, error } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      return createUser(email, password);
    },
    onSuccess: () => {
      navigate("/", {
        replace: true,
      });
    },
    onError: () => {
      console.log(error);
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
          <CardDescription>Create a new account below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Your email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <LoadingBtn
            className="w-full transition-colors"
            disabled={isPending}
            isLoading={isPending}
          >
            Create an Account
          </LoadingBtn>
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
