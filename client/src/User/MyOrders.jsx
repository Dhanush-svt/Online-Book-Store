import { useEffect, useState } from "react";
import { userApi } from "../services/api";
import OrderItem from "./OrderItem";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi
      .get("/orders")
      .then((res) => setOrders(res.data.orders))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <p className="section-eyebrow">Order history</p>
      <h1 className="text-3xl font-semibold mt-1">My orders</h1>

      {loading ? (
        <p className="text-ink/50 mt-8">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="text-ink/50 mt-8">You haven't placed any orders yet.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <OrderItem key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
