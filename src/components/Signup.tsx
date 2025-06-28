import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "./ui/button";

export default function Signup() {
  return (
    <header>
      <SignedOut>
        <Button variant={"default"}>
          <SignInButton />
        </Button>
      </SignedOut>
      <SignedIn>
        <Button size={"icon"} className="p-0 rounded-full ">
          <UserButton />
        </Button>
      </SignedIn>
    </header>
  );
}
