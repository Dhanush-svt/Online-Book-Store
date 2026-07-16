import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi, imageUrl } from "../services/api";
import { formatPrice } from "../utils";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState({ flatno: "", pincode: "", city: "", state: "" });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadCart = () => userApi.get("/cart").then((res) => setCart(res.data.cart));

  useEffect(() => {
    loadCart();
  }, []);

  const remove = async (bookId) => {
    await userApi.delete(`/cart/${bookId}`);
    loadCart();
  };

  const total = cart.reduce((sum, item) => sum + (item.bookId?.price || 0) * item.quantity, 0);

  const checkout = async (e) => {
    e.preventDefault();
    setError("");
    setPlacing(true);
    try {
      await userApi.post("/checkout", address);
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.message || "Checkout failed");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <p className="section-eyebrow">Cart</p>
      <h1 className="text-3xl font-semibold mt-1">Your cart</h1>

      {cart.length === 0 ? (
        <p className="text-ink/50 mt-8">Your cart is empty.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {cart.map((item) => (
            <div key={item.bookId?._id} className="flex items-center gap-4 border-b border-ink/10 pb-4">
              <div className="w-16 h-20 bg-ink/5 rounded overflow-hidden shrink-0">
                {item.bookId?.itemImage && (
                  <img src={imageUrl(item.bookId.itemImage)} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{item.bookId?.title}</p>
                <p className="text-sm text-ink/60">Qty {item.quantity} · {formatPrice(item.bookId?.price)} each</p>
              </div>
              <button onClick={() => remove(item.bookId?._id)} className="text-sm text-spine-fiction hover:underline">
                Remove
              </button>
            </div>
          ))}

          <p className="text-right font-mono text-lg font-semibold">Total: {formatPrice(total)}</p>

          <form onSubmit={checkout} className="mt-8 border-t border-ink/10 pt-6 space-y-4">
            <h2 className="text-xl font-semibold">Delivery address</h2>
            {error && <p className="text-spine-fiction text-sm">{error}</p>}
            <div className="grid sm:grid-cols-2 gap-4">
              <input required placeholder="Flat / House no." className="input-field"
                value={address.flatno} onChange={(e) => setAddress({ ...address, flatno: e.target.value })} />
              <input required placeholder="Pincode" className="input-field"
                value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
              <input required placeholder="City" className="input-field"
                value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              <input required placeholder="State" className="input-field"
                value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
            </div>
            <button disabled={placing} className="btn-primary w-full">
              {placing ? "Placing order…" : "Place order"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
