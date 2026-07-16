import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sellerApi } from "../services/api";

const GENRES = ["Fiction", "Non-fiction", "Science", "Romance", "Children"];

export default function Addbook() {
  const [form, setForm] = useState({
    title: "", author: "", genre: GENRES[0], description: "", price: "", quantity: "",
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (image) data.append("itemImage", image);

      // Don't set Content-Type manually here — the browser needs to add its own
      // multipart boundary based on the FormData contents. Setting it explicitly
      // (without a boundary) breaks the upload with a "Boundary not found" error.
      await sellerApi.post("/books", data);
      navigate("/seller/products");
    } catch (err) {
      setError(err.response?.data?.message || "Could not add book");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <p className="section-eyebrow">List a new title</p>
      <h1 className="text-3xl font-semibold mt-1">Add a book</h1>

      <form onSubmit={onSubmit} className="mt-8 space-y-4" encType="multipart/form-data">
        {error && <p className="text-spine-fiction text-sm">{error}</p>}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <input required className="input-field mt-1" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium">Author</label>
            <input required className="input-field mt-1" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium">Genre</label>
            <select className="input-field mt-1" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}>
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Price (₹)</label>
            <input required type="number" min="0" step="0.01" className="input-field mt-1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium">Stock quantity</label>
            <input required type="number" min="0" className="input-field mt-1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium">Cover image</label>
            <input type="file" accept="image/*" className="input-field mt-1" onChange={(e) => setImage(e.target.files[0])} />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea rows={4} className="input-field mt-1" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>

        <button disabled={saving} className="btn-brass w-full">
          {saving ? "Adding…" : "Add book to store"}
        </button>
      </form>
    </div>
  );
}
