import { Link } from "react-router-dom";
import Signup from "./Signup";
import { ThemeToggle } from "./theme/mode-toggle";

export default function Header() {
  return (
    <header className="flex justify-between p-4 shadow-md shadow-gray-500">
      <div>
        <Link to={"/"}>
          <img src="/fulllogo.png" alt="PixaGram" className="h-12" />
        </Link>
      </div>
      <div className="flex gap-4">
        <ThemeToggle />
        <Signup />
      </div>
    </header>
  );
}
