import { type User } from "@/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

type Props = {
  user: User;
};
export default function SearchedUser({ user }: Props) {
  return (
    <div className="w-full h-16 flex justify-center items-center gap-3 border-2 p-3 rounded-md">
      <Avatar className="cursor-pointer border-[1px] border-gray-300">
        <AvatarImage src={user.image} />
        <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className=" w-full h-full flex flex-col justify-center">
        <p>{user.username}</p>
        <p className="text-sm text-gray-300">{user.fullname}</p>
      </div>
      <Button>Follow</Button>
    </div>
  );
}
