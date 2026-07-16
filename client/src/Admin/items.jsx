import { useEffect, useState } from "react";
import { adminApi, imageUrl } from "../services/api";
import { formatPrice } from "../utils";

export default function Items() {
  const [books, setBooks] = useState([]);
  const load = () => adminApi.get("/books").then((res) => setBooks(res.data.books));

  useEffect(() => {
    load();
  }, []);

  const remove = async (id, title) => {
    if (!confirm(`Remove "${title}" from the store?`)) return;
    await adminApi.delete(`/books/${id}`);
    load();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <p className="section-eyebrow">Catalog</p>
      <h1 className="text-3xl font-semibold mt-1">All books</h1>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/50 border-b border-ink/10">
              <th className="py-2 pr-4"></th>
              <th className="py-2 pr-4">Title</th>
              <th className="py-2 pr-4">Seller</th>
              <th className="py-2 pr-4">Price</th>
              <th className="py-2 pr-4">Stock</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b._id} className="border-b border-ink/5">
                <td className="py-2 pr-4">
                  <div className="w-10 h-12 bg-ink/5 rounded overflow-hidden">
                    {b.itemImage && <img src={imageUrl(b.itemImage)} alt="" className="w-full h-full object-cover" />}
                  </div>
                </td>
                <td className="py-3 pr-4 font-medium">{b.title}<p className="text-xs text-ink/40">{b.genre}</p></td>
                <td className="py-3 pr-4 text-ink/70">{b.sellerName}</td>
                <td className="py-3 pr-4 font-mono">{formatPrice(b.price)}</td>
                <td className="py-3 pr-4">{b.quantity}</td>
                <td className="py-3 pr-4">
                  <button onClick={() => remove(b._id, b.title)} className="text-spine-fiction hover:underline">Remove</button>
                </td>
              </tr>
            ))}
            {books.length === 0 && (
              <tr><td colSpan={6} className="py-6 text-ink/40">No books listed yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
