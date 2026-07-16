import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { userApi } from "../services/api";
import BookCard from "../Components/BookCard";

const GENRES = ["", "Fiction", "Non-fiction", "Science", "Romance", "Children"];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const search = searchParams.get("search") || "";
  const genre = searchParams.get("genre") || "";

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (genre) params.genre = genre;

    userApi
      .get("/books", { params })
      .then((res) => setBooks(res.data.books))
      .finally(() => setLoading(false));
  }, [search, genre]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <p className="section-eyebrow">Catalog</p>
      <h1 className="text-3xl font-semibold mt-1">Browse books</h1>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <input
          placeholder="Search by title or author…"
          defaultValue={search}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSearchParams({ ...(genre && { genre }), search: e.target.value });
            }
          }}
          className="input-field sm:max-w-sm"
        />
        <select
          value={genre}
          onChange={(e) =>
            setSearchParams({ ...(search && { search }), ...(e.target.value && { genre: e.target.value }) })
          }
          className="input-field sm:max-w-xs"
        >
          {GENRES.map((g) => (
            <option key={g} value={g}>{g || "All genres"}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-ink/50 mt-10">Loading books…</p>
      ) : books.length === 0 ? (
        <p className="text-ink/50 mt-10">No books match your search.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mt-8">
          {books.map((book) => (
            <BookCard key={book._id} book={book} linkTo={`/products/${book._id}`} />
          ))}
        </div>
      )}
    </div>
  );
}
