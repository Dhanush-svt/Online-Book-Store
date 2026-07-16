import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../services/api";

export default function Snavbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const logout = () => {
    auth.clearToken("seller");
    navigate("/seller/login");
  };

  const linkClass = (to) =>
    `px-3 py-2 rounded-md text-sm font-medium ${pathname === to ? "bg-brass text-ink" : "text-paper/80 hover:text-paper"}`;

  return (
    <header className="bg-ink text-paper">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/seller/home" className="font-display text-xl font-semibold">
          Book<span className="text-brass-light">Ease</span> <span className="text-xs text-paper/50 font-body align-middle">seller</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link to="/seller/home" className={linkClass("/seller/home")}>Dashboard</Link>
          <Link to="/seller/products" className={linkClass("/seller/products")}>My Books</Link>
          <Link to="/seller/add-book" className={linkClass("/seller/add-book")}>Add Book</Link>
          <Link to="/seller/orders" className={linkClass("/seller/orders")}>Orders</Link>
        </nav>
        <button onClick={logout} className="text-sm border border-paper/30 px-3 py-1.5 rounded-md hover:border-paper">
          Logout
        </button>
      </div>
    </header>
  );
}
