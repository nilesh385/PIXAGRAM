import PostsFeed from "@/components/posts/PostFeed";
import userStore from "@/store/userStore";

export default function LoggedInHome() {
  const currentUser = userStore((state: any) => state.currentUser);
  return (
    <>
      <PostsFeed currentUserId={currentUser?.user_id} />
    </>
  );
}
