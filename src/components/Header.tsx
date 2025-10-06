import { Link, useLocation } from "react-router-dom";
import Signup from "./Signup";
import { ThemeToggle } from "./theme/mode-toggle";
import { useUser } from "@clerk/clerk-react";
import userStore from "@/store/userStore";
import { HomeIcon, UserSearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import { RiUserFollowFill } from "react-icons/ri";
import { TbUserScreen } from "react-icons/tb";
import TooltipWrapper from "./TooltipWrapper";

export default function Header() {
  const { isSignedIn } = useUser();
  const currentUser = userStore((state: any) => state.currentUser);
  const location = useLocation();
  return (
    <header className="md:min-w-screen h-20  flex justify-between py-4 px-10 shadow-sm shadow-gray-500">
      <div>
        <Link to={"/"}>
          <img src="/fulllogo.png" alt="PixaGram" className="h-12" />
        </Link>
      </div>
      <div className="flex gap-4">
        {isSignedIn &&
          currentUser?.role === "user" &&
          currentUser.is_blocked === "false" && (
            <div className="flex gap-4">
              <TooltipWrapper content="Home" side="top" align="center">
                <Button
                  variant={location.pathname === "/" ? "default" : "outline"}
                  size={"icon"}
                  className="cursor-pointer"
                >
                  <Link to={"/"}>
                    <HomeIcon />
                  </Link>
                </Button>
              </TooltipWrapper>
              <TooltipWrapper content="Search" side="top" align="center">
                <Button
                  variant={
                    location.pathname === "/search" ? "default" : "outline"
                  }
                  size={"icon"}
                  className="cursor-pointer"
                >
                  <Link to={"/search"}>
                    <UserSearchIcon />
                  </Link>
                </Button>
              </TooltipWrapper>
              <TooltipWrapper
                content="Followers & Following"
                side="top"
                align="center"
              >
                <Button
                  variant={
                    location.pathname === "/followersAndFollowing"
                      ? "default"
                      : "outline"
                  }
                  size={"icon"}
                  className="cursor-pointer"
                >
                  <Link to={"/followersAndFollowing"}>
                    <RiUserFollowFill />
                  </Link>
                </Button>
              </TooltipWrapper>
              <TooltipWrapper content="My Posts" side="top" align="center">
                <Button
                  variant={
                    location.pathname === "/myPosts" ? "default" : "outline"
                  }
                  size={"icon"}
                  className="cursor-pointer"
                >
                  <Link to={"/myPosts"}>
                    <TbUserScreen />
                  </Link>
                </Button>
              </TooltipWrapper>
            </div>
          )}
        <ThemeToggle />
        <Signup />
      </div>
    </header>
  );
}
