import { useState } from "react";
import { sellerApi, imageUrl } from "../services/api";
import { spineColorVar, formatPrice } from "../utils";
import "./List.css";

export default function Book({ book, onChanged }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: book.title, author: book.author, price: book.price, quantity: book.quantity,
  });

  const save = async () => {
    await sellerApi.put(`/books/${book._id}`, form);
    setEditing(false);
    onChanged();
  };

  const remove = async () => {
    if (!confirm(`Remove "${book.title}" from your store?`)) return;
    await sellerApi.delete(`/books/${book._id}`);
    onChanged();
  };

  return (
    <div className="spine-card" style={{ "--spine-color": spineColorVar(book.genre) }}>
      <div className="aspect-[3/4] bg-ink/5 rounded overflow-hidden mb-3">
        {book.itemImage && <img src={imageUrl(book.itemImage)} alt={book.title} className="w-full h-full object-cover" />}
      </div>

      {editing ? (
        <div className="space-y-2">
          <input className="input-field text-sm" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className="input-field text-sm" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          <div className="flex gap-2">
            <input type="number" className="input-field text-sm" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input type="number" className="input-field text-sm" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          </div>
        </div>
      ) : (
        <>
          <h3 className="font-display font-semibold leading-snug">{book.title}</h3>
          <p className="text-sm text-ink/60">{book.author}</p>
          <p className="font-mono font-semibold mt-1">{formatPrice(book.price)} · {book.quantity} in stock</p>
        </>
      )}

      <div className="book-list-actions">
        {editing ? (
          <button className="book-list-edit" onClick={save}>Save</button>
        ) : (
          <button className="book-list-edit" onClick={() => setEditing(true)}>Edit</button>
        )}
        <button className="book-list-delete" onClick={remove}>Delete</button>
      </div>
    </div>
  );
}
