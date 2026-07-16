import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../services/api";
import { formatPrice } from "../utils";

export default function Ahome() {
  const [stats, setStats] = useState({ users: 0, sellers: 0, books: 0, orders: 0, revenue: 0, pendingSellers: 0 });

  useEffect(() => {
    Promise.all([
      adminApi.get("/users"),
      adminApi.get("/sellers"),
      adminApi.get("/books"),
      adminApi.get("/orders"),
    ]).then(([users, sellers, books, orders]) => {
      const revenue = orders.data.orders.reduce((s, o) => s + (o.totalamount || 0), 0);
      const pendingSellers = sellers.data.sellers.filter((s) => !s.isApproved).length;
      setStats({
        users: users.data.count,
        sellers: sellers.data.count,
        books: books.data.count,
        orders: orders.data.count,
        revenue,
        pendingSellers,
      });
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <p className="section-eyebrow">System overview</p>
      <h1 className="text-3xl font-semibold mt-1">Admin dashboard</h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5 mt-8">
        <Stat label="Users" value={stats.users} />
        <Stat label="Sellers" value={stats.sellers} />
        <Stat label="Books listed" value={stats.books} />
        <Stat label="Total revenue" value={formatPrice(stats.revenue)} accent />
      </div>

      {stats.pendingSellers > 0 && (
        <p className="mt-6 text-sm bg-brass/15 border border-brass/30 text-brass-dark px-4 py-3 rounded-md">
          {stats.pendingSellers} seller account{stats.pendingSellers > 1 ? "s" : ""} awaiting approval.{" "}
          <Link to="/admin/sellers" className="underline font-semibold">Review sellers →</Link>
        </p>
      )}

      <div className="flex gap-3 mt-8">
        <Link to="/admin/users" className="btn-outline">Manage users</Link>
        <Link to="/admin/sellers" className="btn-outline">Manage sellers</Link>
        <Link to="/admin/books" className="btn-outline">Manage books</Link>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="spine-card" style={{ "--spine-color": accent ? "#B8863B" : "#5A5648" }}>
      <p className="text-sm text-ink/60">{label}</p>
      <p className="text-3xl font-display font-semibold mt-1">{value}</p>
    </div>
  );
}
