import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { userApi, auth, imageUrl } from "../services/api";
import { spineColorVar, formatPrice } from "../utils";

export default function Uitem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    userApi.get(`/books/${id}`).then((res) => setBook(res.data.book));
  }, [id]);

  const addToCart = async () => {
    if (!auth.isLoggedIn("user")) {
      navigate("/login");
      return;
    }
    try {
      await userApi.post("/cart", { bookId: id, quantity });
      setMessage("Added to your cart.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not add to cart.");
    }
  };

  if (!book) return <p className="max-w-6xl mx-auto px-6 py-16 text-ink/50">Loading…</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10">
      <div
        className="aspect-[3/4] bg-ink/5 rounded-lg overflow-hidden relative"
        style={{ boxShadow: `inset 6px 0 0 ${spineColorVar(book.genre)}` }}
      >
        {book.itemImage ? (
          <img src={imageUrl(book.itemImage)} alt={book.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink/30 font-display">No cover</div>
        )}
      </div>

      <div>
        <Link to="/products" className="text-sm text-ink/50 hover:underline">← Back to catalog</Link>
        <p className="section-eyebrow mt-4">{book.genre}</p>
        <h1 className="text-3xl font-semibold mt-1">{book.title}</h1>
        <p className="text-ink/60 mt-1">by {book.author}</p>

        <p className="text-2xl font-mono font-semibold mt-6">{formatPrice(book.price)}</p>
        <p className={`text-sm mt-1 ${book.quantity > 0 ? "text-spine-science" : "text-spine-fiction"}`}>
          {book.quantity > 0 ? `${book.quantity} copies in stock` : "Currently out of stock"}
        </p>

        <p className="mt-6 text-ink/80 leading-relaxed">{book.description || "No description provided."}</p>

        {book.quantity > 0 && (
          <div className="mt-8 flex items-center gap-4">
            <input
              type="number"
              min={1}
              max={book.quantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(book.quantity, Number(e.target.value))))}
              className="input-field w-20"
            />
            <button onClick={addToCart} className="btn-brass">Add to cart</button>
          </div>
        )}
        {message && (
          <p className="mt-3 text-sm text-brass-dark">
            {message}{" "}
            {message.startsWith("Added") && (
              <Link to="/cart" className="underline font-semibold">View cart →</Link>
            )}
          </p>
        )}

        <p className="text-xs text-ink/40 mt-8">Sold by {book.sellerName}</p>
      </div>
    </div>
  );
}
