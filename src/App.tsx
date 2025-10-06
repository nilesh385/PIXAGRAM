import { Route, Routes } from "react-router-dom";
import LoggedInHome from "./pages/LoggedInHome";
import Home from "./pages/Home";
import CreatePost from "./components/posts/CreatePost";
import Header from "./components/Header";
import { useEffect, useState } from "react";
import type { User } from "./types/types";
import { supabase } from "./lib/supabase";
import { useAuth } from "@clerk/clerk-react";
import userStore from "./store/userStore";
import UserSearchBar from "./components/search/UserSearchBar";
import FollowersFollowingPage from "./pages/FollowersFollowingPage";
import { MyPostsPage } from "./pages/MyPostsPage";
import AdminHome from "./pages/admin/DashboardPage";
import AdminPosts from "./pages/admin/AdminPostsPage";
import AdminUsers from "./pages/admin/AdminUserPage";

export default function App() {
  const { isSignedIn, userId } = useAuth();
  const [userData, setUserData] = useState<User | any>();
  const setCurrentUser = userStore((state: any) => state.setCurrentUser);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", userId!);
      if (error) {
        console.error("Error fetching user data:", error);
        return;
      }
      console.log("\nuserdata=>>>>>> ", data);
      setUserData(data?.[0] ?? null);
      setCurrentUser(data?.[0] ?? null);
    };
    if (isSignedIn) {
      fetchUserData();
    }
  }, [isSignedIn, userId]);
  if (userData?.is_blocked) {
    return (
      <div className="h-full w-full text-center">
        You have been blocked by the admin. Please contact the admin for more
        details.
      </div>
    );
  }

  return (
    <div>
      <>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              isSignedIn ? (
                userData?.role === "admin" ? (
                  <AdminHome />
                ) : (
                  <LoggedInHome />
                )
              ) : (
                <Home />
              )
            }
          />

          <Route
            path="/admin/users"
            element={isSignedIn && userData?.role === "admin" && <AdminUsers />}
          />
          <Route
            path="/admin/posts"
            element={isSignedIn && userData?.role === "admin" && <AdminPosts />}
          />
          <Route
            path="/search"
            element={
              isSignedIn && userData?.role === "user" && <UserSearchBar />
            }
          />
          <Route
            path="/followersAndFollowing"
            element={
              isSignedIn &&
              userData?.role === "user" && <FollowersFollowingPage />
            }
          />
          <Route
            path="/myPosts"
            element={isSignedIn && userData?.role === "user" && <MyPostsPage />}
          />
        </Routes>

        {isSignedIn && userData?.role === "user" && <CreatePost />}
      </>
    </div>
  );
}
