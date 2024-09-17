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
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const { isPending, isError, mutate } = useMutation({
    mutationFn: () => {
      return logIn(emailRef?.current.value!, passwordRef.current.value!);
    },
    onSuccess: (data) => {
      console.log(data);
      navigate("/dashboard/overview", {
        replace: true,
      });
    },
    retry: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
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
              "Log in"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default Login;
