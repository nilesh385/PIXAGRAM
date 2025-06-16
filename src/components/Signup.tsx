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
        <Button className="p-0">
          <SignInButton />
        </Button>
      </SignedOut>
      <SignedIn>
        <Button className="p-0">
          <UserButton />
        </Button>
      </SignedIn>
    </header>
  );
}
