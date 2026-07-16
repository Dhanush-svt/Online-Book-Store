import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { sellerApi } from "../services/api";
import { formatPrice } from "../utils";

export default function Shome() {
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    sellerApi.get("/books").then((res) => setBooks(res.data.books));
    sellerApi.get("/orders").then((res) => setOrders(res.data.orders));
  }, []);

  const revenue = orders.reduce((sum, o) => sum + (o.totalamount || 0), 0);
  const pending = orders.filter((o) => o.status === "Placed").length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <p className="section-eyebrow">Seller dashboard</p>
      <h1 className="text-3xl font-semibold mt-1">Your store at a glance</h1>

      <div className="grid sm:grid-cols-3 gap-5 mt-8">
        <Stat label="Books listed" value={books.length} />
        <Stat label="Orders received" value={orders.length} accent />
        <Stat label="Total revenue" value={formatPrice(revenue)} />
      </div>

      {pending > 0 && (
        <p className="mt-6 text-sm bg-brass/15 border border-brass/30 text-brass-dark px-4 py-3 rounded-md">
          You have {pending} order{pending > 1 ? "s" : ""} awaiting fulfillment.{" "}
          <Link to="/seller/orders" className="underline font-semibold">Review orders →</Link>
        </p>
      )}

      <div className="flex gap-3 mt-8">
        <Link to="/seller/add-book" className="btn-brass">+ Add a book</Link>
        <Link to="/seller/products" className="btn-outline">Manage listings</Link>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className={`spine-card`} style={{ "--spine-color": accent ? "#B8863B" : "#5A5648" }}>
      <p className="text-sm text-ink/60">{label}</p>
      <p className="text-3xl font-display font-semibold mt-1">{value}</p>
    </div>
  );
}
