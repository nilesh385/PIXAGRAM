// components/admin/Navbar.tsx
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: supabase.auth.signOut() or clear Zustand store
    navigate("/signin");
  };

  return (
    <header className="h-16 flex items-center justify-between border-b bg-background px-6 shadow-sm">
      <h1 className="text-lg font-semibold">Pixagram Admin</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Welcome, Admin</span>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
