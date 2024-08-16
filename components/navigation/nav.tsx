import { auth } from "@/server/auth";
import { UserButton } from "./user-button";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
const nav = async () => {
  const session = await auth();

  return (
    <header className="bg-slate-500 py-4">
      <nav>
        <ul className="flex justify-between">
          <Link href="/"></Link>
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
