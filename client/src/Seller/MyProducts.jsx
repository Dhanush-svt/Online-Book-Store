import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { sellerApi } from "../services/api";
import Book from "./Book";
import "./List.css";

export default function MyProducts() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => sellerApi.get("/books").then((res) => setBooks(res.data.books)).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="section-eyebrow">Inventory</p>
          <h1 className="text-3xl font-semibold mt-1">My books</h1>
        </div>
        <Link to="/seller/add-book" className="btn-brass">+ Add book</Link>
      </div>

      {loading ? (
        <p className="text-ink/50 mt-8">Loading…</p>
      ) : books.length === 0 ? (
        <p className="text-ink/50 mt-8">You haven't listed any books yet.</p>
      ) : (
        <div className="book-list-grid mt-8">
          {books.map((book) => (
            <Book key={book._id} book={book} onChanged={load} />
          ))}
        </div>
      )}
    </div>
  );
}
