import { useAuth } from "@clerk/clerk-react";
import { Route, Routes } from "react-router-dom";
import LoggedInHome from "./components/home/LoggedInHome";
import Home from "./components/home/Home";
import CreatePost from "./components/posts/CreatePost";
import Header from "./components/Header";

export default function App() {
  const { isSignedIn } = useAuth();
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={isSignedIn ? <LoggedInHome /> : <Home />} />
      </Routes>
      {isSignedIn && <CreatePost />}
    </div>
  );
}
