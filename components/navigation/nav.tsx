import { auth } from "@/server/auth";
import { UserButton } from "./user-button";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import Logo from "./logo";
const nav = async () => {
  const session = await auth();

  return (
    <header className="py-12">
      <nav>
        <ul className="flex justify-between items-center">
          <li>
            <Link href="/" aria-label="sprout and scribble logo ">
              <Logo />
            </Link>
          </li>
          {!session ? (
            <li>
              <Button asChild>
                <Link className="flex gap-2" href="/auth/login">
                  <LogIn />
                  <span>Login</span>
                </Link>
              </Button>
            </li>
          ) : (
            <li>
              <UserButton expires={session?.expires} user={session?.user} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default nav;
