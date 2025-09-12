import { Route, Routes } from "react-router-dom";
import LoggedInHome from "./pages/LoggedInHome";
import Home from "./pages/Home";
import CreatePost from "./components/posts/CreatePost";
import Header from "./components/Header";
import { useEffect, useState } from "react";
import type { User } from "./types/types";
import AdminDashboard from "./pages/AdminDashboard";
import { supabase } from "./lib/supabase";
import { useAuth } from "@clerk/clerk-react";
// import SearchInput from "./components/search/SearchInput";
import userStore from "./store/userStore";
import UserSearchBar from "./components/search/UserSearchBar";
import FollowersFollowingPage from "./pages/FollowersFollowingPage";
import { MyPostsPage } from "./pages/MyPostsPage";

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

  return (
    <div>
      {userData?.is_blocked ? (
        <div className="h-full w-full text-center">
          You have been blocked by the admin. Please contact the admin for more
          details.
        </div>
      ) : (
        <>
          <Header />
          <Routes>
            <Route
              path="/"
              element={
                isSignedIn ? (
                  userData?.role === "admin" ? (
                    <AdminDashboard />
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
              element={
                isSignedIn && userData?.role === "admin" && <AdminDashboard />
              }
            />
            <Route
              path="/admin/posts"
              element={
                isSignedIn && userData?.role === "admin" && <AdminDashboard />
              }
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
              element={
                isSignedIn && userData?.role === "user" && <MyPostsPage />
              }
            />
          </Routes>

          {isSignedIn && userData?.role === "user" && <CreatePost />}
        </>
      )}
    </div>
  );
}
