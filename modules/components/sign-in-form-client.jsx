"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Chrome, Github } from "lucide-react";
import {
  signInWithGoogle,
  signInWithGithub,
} from "@/modules/auth/server-actions";

const SignInFormClient = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Sign In
        </CardTitle>
        <CardDescription className="text-center">
          Choose your preferred sign-in method
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
        <form action={signInWithGoogle}>
          <Button type="submit" variant="outline" className="w-full">
            <Chrome className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
        </form>

        <form action={signInWithGithub}>
          <Button type="submit" variant="outline" className="w-full">
            <Github className="mr-2 h-4 w-4" />
            Sign in with GitHub
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignInFormClient;
