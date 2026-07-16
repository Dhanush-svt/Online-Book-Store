import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../services/api";

export default function Anavbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const logout = () => {
    auth.clearToken("admin");
    navigate("/admin/login");
  };

  const linkClass = (to) =>
    `px-3 py-2 rounded-md text-sm font-medium ${pathname === to ? "bg-brass text-ink" : "text-paper/80 hover:text-paper"}`;

  return (
    <header className="bg-ink text-paper">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/admin/home" className="font-display text-xl font-semibold">
          Book<span className="text-brass-light">Ease</span> <span className="text-xs text-paper/50 font-body align-middle">admin</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link to="/admin/home" className={linkClass("/admin/home")}>Dashboard</Link>
          <Link to="/admin/users" className={linkClass("/admin/users")}>Users</Link>
          <Link to="/admin/sellers" className={linkClass("/admin/sellers")}>Sellers</Link>
          <Link to="/admin/books" className={linkClass("/admin/books")}>Books</Link>
        </nav>
        <button onClick={logout} className="text-sm border border-paper/30 px-3 py-1.5 rounded-md hover:border-paper">
          Logout
        </button>
      </div>
    </header>
  );
}
