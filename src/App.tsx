import { useAuth } from "@clerk/clerk-react";
import { Route, Routes } from "react-router-dom";
import LoggedInHome from "./pages/LoggedInHome";
import Home from "./pages/Home";
import CreatePost from "./components/posts/CreatePost";
import Header from "./components/Header";
import useCreateClerkSupabaseClient from "./hooks/useCreateClerkSupabaseClient";
import { useEffect, useState } from "react";
import type { User } from "./types/types";
import AdminDashboard from "./pages/AdminDashboard";
import UsersList from "./components/admin-components/UsersList";
import PostsList from "./components/admin-components/PostsList";

export default function App() {
  const { isSignedIn, userId } = useAuth();
  const supabase = useCreateClerkSupabaseClient();
  const [userData, setUserData] = useState<User | null>();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", userId);
      if (error) {
        console.error("Error fetching user data:", error);
        return;
      }
      setUserData(data[0]);
    };
    if (isSignedIn) {
      fetchUserData();
    }
  }, []);

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={isSignedIn ? <LoggedInHome /> : <Home />} />
        <Route
          path="/admin"
          element={
            isSignedIn && userData?.role === "admin" && <AdminDashboard />
          }
        />
        <Route
          path="/admin/users"
          element={isSignedIn && userData?.role === "admin" && <UsersList />}
        />
        <Route
          path="/admin/posts"
          element={isSignedIn && userData?.role === "admin" && <PostsList />}
        />
      </Routes>
      {isSignedIn && <CreatePost />}
    </div>
  );
}
