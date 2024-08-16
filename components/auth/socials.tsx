"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const Socials = () => {
  return (
    <div className="flex flex-col items-center w-full gap-4">
      <Button
        variant={"ghost"}
        className="flex gap-4"
        onClick={() =>
          signIn("google", {
            redirect: false,
            callbackUrl: "/",
            allowDangerousEmailAccountingLinking: true,
          })
        }
      >
        <p>Sign in with Google</p>
        <FcGoogle className="w-5 h-5" />
      </Button>
      <Button
        variant={"ghost"}
        className="flex gap-4"
        onClick={() =>
          signIn("github", {
            redirect: false,
            callbackUrl: "/",
            allowDangerousEmailAccountingLinking: true,
          })
        }
      >
        <p>Sign in with Github</p>
        <FaGithub className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default Socials;
