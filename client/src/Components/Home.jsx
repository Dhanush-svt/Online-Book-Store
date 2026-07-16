import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userApi } from "../services/api";
import BookCard from "./BookCard";

const GENRES = ["Fiction", "Non-fiction", "Science", "Romance", "Children"];

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    userApi
      .get("/books")
      .then((res) => setFeatured(res.data.books.slice(0, 8)))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-ink text-paper">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="section-eyebrow text-brass-light">BookEase</p>
            <h1 className="text-5xl font-display font-semibold leading-[1.1] mt-3">
              Every shelf, <span className="italic text-brass-light">open</span> at once.
            </h1>
            <p className="mt-5 text-paper/75 max-w-md">
              Search across genres, compare authors, and order books straight
              from independent sellers — with real-time stock and delivery
              tracking built in.
            </p>
            <div className="mt-8 flex gap-3">
              <Link to="/products" className="btn-brass">Browse the catalog</Link>
              <Link to="/signup" className="border border-paper/40 text-paper px-5 py-2.5 rounded-md hover:border-paper transition-colors">
                Create an account
              </Link>
            </div>
          </div>

          {/* Signature visual: stacked "spines" representing genres */}
          <div className="flex gap-3 h-64 items-end justify-center">
            {[
              { g: "Fiction", h: "70%" },
              { g: "Science", h: "95%" },
              { g: "Romance", h: "55%" },
              { g: "Non-fiction", h: "80%" },
              { g: "Children", h: "65%" },
            ].map(({ g, h }) => (
              <div
                key={g}
                className="w-10 rounded-t-sm flex items-end justify-center pb-2"
                style={{ height: h, backgroundColor: spineFor(g) }}
                title={g}
              >
                <span className="text-[10px] -rotate-90 whitespace-nowrap text-paper/80 font-mono">{g}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category quick-filters */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <p className="section-eyebrow">Browse by category</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {GENRES.map((g) => (
            <Link
              key={g}
              to={`/products?genre=${encodeURIComponent(g)}`}
              className="px-4 py-2 rounded-full border border-ink/15 text-sm hover:bg-ink hover:text-paper transition-colors"
            >
              {g}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured books */}
      <section className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Recently added</h2>
          <Link to="/products" className="text-sm text-brass-dark hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mt-6">
          {featured.length === 0 && (
            <p className="text-ink/50 col-span-full">No books yet — check back soon.</p>
          )}
          {featured.map((book) => (
            <BookCard key={book._id} book={book} linkTo={`/products/${book._id}`} />
          ))}
        </div>
      </section>
    </div>
  );
}

function spineFor(genre) {
  const map = {
    Fiction: "#7A3B3B",
    "Non-fiction": "#3B5D7A",
    Science: "#3B7A5D",
    Romance: "#8F3B6E",
    Children: "#B8863B",
  };
  return map[genre] || "#5A5648";
}
