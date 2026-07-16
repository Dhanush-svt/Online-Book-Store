import { useEffect, useState } from "react";
import { sellerApi } from "../services/api";
import { formatPrice } from "../utils";

const STATUS_OPTIONS = ["Placed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => sellerApi.get("/orders").then((res) => setOrders(res.data.orders)).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    await sellerApi.put(`/orders/${id}`, { status });
    load();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <p className="section-eyebrow">Fulfillment</p>
      <h1 className="text-3xl font-semibold mt-1">Orders</h1>

      {loading ? (
        <p className="text-ink/50 mt-8">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="text-ink/50 mt-8">No orders yet.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink/50 border-b border-ink/10">
                <th className="py-2 pr-4">Order</th>
                <th className="py-2 pr-4">Buyer</th>
                <th className="py-2 pr-4">Qty</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b border-ink/5">
                  <td className="py-3 pr-4">
                    <p className="font-medium">{o.booktitle}</p>
                    <p className="text-xs text-ink/40 font-mono">#{o._id.slice(-8).toUpperCase()}</p>
                  </td>
                  <td className="py-3 pr-4">{o.userName}</td>
                  <td className="py-3 pr-4">{o.quantity}</td>
                  <td className="py-3 pr-4 font-mono">{formatPrice(o.totalamount)}</td>
                  <td className="py-3 pr-4">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                      className="input-field !py-1 text-sm"
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
