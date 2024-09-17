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
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { FirebaseError } from "firebase/app";

const Signup = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const { isPending, isError, mutate, error } = useMutation({
    mutationFn: () => {
      return signUp(emailRef.current.value, passwordRef.current.value);
    },
    onSuccess: (data) => {
      console.log(data);
      navigate("/dashboard/overview", {
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
    mutate();
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
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Your username"
              required
              ref={emailRef}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required ref={passwordRef} />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full transition-colors" disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Create an Account"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default Signup;
