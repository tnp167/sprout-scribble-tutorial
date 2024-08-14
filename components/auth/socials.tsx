"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

const Socials = () => {
  return (
    <div>
      <Button
        onClick={() =>
          signIn("google", {
            redirect: false,
            callbackUrl: "/",
            allowDangerousEmailAccountingLinking: true,
          })
        }
      >
        Sign in with Google
      </Button>
      <Button
        onClick={() =>
          signIn("github", {
            redirect: false,
            callbackUrl: "/",
            allowDangerousEmailAccountingLinking: true,
          })
        }
      >
        Sign in with Github
      </Button>
    </div>
  );
};

export default Socials;
