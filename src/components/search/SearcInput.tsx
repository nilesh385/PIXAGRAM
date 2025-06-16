import { LoaderCircleIcon, SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import useSearchUsers from "@/hooks/useSearchUsers";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import SearchedUser from "./SearchedUser";
import type { User } from "@/types/types";

export default function SearcInput() {
  const [searchText, setSearchText] = useState<string>("");
  const { data: searchedUsers, isLoading, error } = useSearchUsers(searchText);
  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        <Input
          type="text"
          placeholder="Enter username or fullname..."
          className="flex-grow"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          autoFocus
        />
        <Button size={"icon"}>
          <SearchIcon />
        </Button>
      </form>

      <div>
        <Card className="h-[90%] w-full">
          <ScrollArea className="h-full w-full p-3 ">
            {error && (
              <div className="h-full w-full flex justify-center items-center">
                {error.message}
              </div>
            )}
            {isLoading && !searchedUsers && (
              <div className="h-full w-full flex justify-center items-center">
                <LoaderCircleIcon className="animate-spin " size={40} />
              </div>
            )}
            {!isLoading &&
              Array.isArray(searchedUsers) &&
              searchedUsers.length == 0 && (
                <div className="h-full w-full flex justify-center items-center">
                  No users found...
                </div>
              )}

            {!isLoading &&
              Array.isArray(searchedUsers) &&
              searchedUsers.length > 0 &&
              searchedUsers.map((user: User) => (
                <SearchedUser key={user.user_id} user={user} />
              ))}
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
