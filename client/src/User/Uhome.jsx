import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userApi } from "../services/api";
import BookCard from "../Components/BookCard";

export default function Uhome() {
  const [profile, setProfile] = useState(null);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    userApi.get("/profile").then((res) => setProfile(res.data.user)).catch(() => {});
    userApi.get("/books").then((res) => setBooks(res.data.books)).catch(() => {});
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <p className="section-eyebrow">Your shelf</p>
      <h1 className="text-3xl font-semibold mt-1">
        Welcome back{profile ? `, ${profile.name.split(" ")[0]}` : ""}
      </h1>

      <div className="flex gap-3 mt-6">
        <Link to="/products" className="btn-primary">Browse all books</Link>
        <Link to="/orders" className="btn-outline">View my orders</Link>
      </div>

      <h2 className="text-xl font-semibold mt-12 mb-4">Recommended for you</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {books.slice(0, 8).map((book) => (
          <BookCard key={book._id} book={book} linkTo={`/products/${book._id}`} />
        ))}
        {books.length === 0 && <p className="text-ink/50 col-span-full">No recommendations yet.</p>}
      </div>
    </div>
  );
}
