import { Link, useNavigate } from "react-router-dom";
import { auth } from "../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const isUser = auth.isLoggedIn("user");

  const logout = () => {
    auth.clearToken("user");
    navigate("/");
  };

  return (
    <header className="bg-paper/95 backdrop-blur border-b border-ink/10 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight">
          Book<span className="text-brass-dark">Ease</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
          <Link to="/products" className="hover:text-brass-dark">Browse</Link>
          {isUser && <Link to="/cart" className="hover:text-brass-dark">Cart</Link>}
          {isUser && <Link to="/orders" className="hover:text-brass-dark">My Orders</Link>}
        </nav>

        <div className="flex items-center gap-3 text-sm">
          {isUser ? (
            <>
              <Link to="/profile" className="hover:text-brass-dark">Profile</Link>
              <button onClick={logout} className="btn-outline !px-3 !py-1.5">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-brass-dark">Sign in</Link>
              <Link to="/signup" className="btn-primary !px-3 !py-1.5">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
