import { imageUrl } from "../services/api";
import { formatPrice } from "../utils";

const STATUS_STEPS = ["Placed", "Shipped", "Out for Delivery", "Delivered"];

export default function OrderItem({ order }) {
  const stepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="spine-card" style={{ "--spine-color": "#B8863B" }}>
      <div className="flex gap-4">
        <div className="w-16 h-20 bg-ink/5 rounded overflow-hidden shrink-0">
          {order.itemImage && <img src={imageUrl(order.itemImage)} alt="" className="w-full h-full object-cover" />}
        </div>
        <div className="flex-1">
          <p className="font-semibold">{order.booktitle}</p>
          <p className="text-sm text-ink/60">by {order.bookauthor} · Qty {order.quantity}</p>
          <p className="text-xs text-ink/40 mt-1 font-mono">Order #{order._id.slice(-8).toUpperCase()}</p>
        </div>
        <p className="font-mono font-semibold">{formatPrice(order.totalamount)}</p>
      </div>

      {order.status !== "Cancelled" ? (
        <div className="mt-4 flex items-center gap-1">
          {STATUS_STEPS.map((step, i) => (
            <div key={step} className="flex-1 flex items-center">
              <div
                className={`h-1.5 flex-1 rounded-full ${i <= stepIndex ? "bg-brass" : "bg-ink/10"}`}
                title={step}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-spine-fiction mt-3">Order cancelled</p>
      )}
      <div className="flex justify-between text-xs text-ink/50 mt-2">
        <span>Ordered {order.BookingDate}</span>
        <span className="font-semibold text-ink/70">{order.status}</span>
        <span>Est. delivery {order.Delivery}</span>
      </div>
    </div>
  );
}
