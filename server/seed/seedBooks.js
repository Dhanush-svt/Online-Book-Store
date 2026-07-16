/**
 * Seeds the database with real book data pulled from the (free, keyless)
 * Google Books API: https://developers.google.com/books
 *
 * Usage:
 *   npm run seed
 *
 * What it does:
 *   1. Connects to MongoDB using MONGO_URI from .env
 *   2. Creates (or reuses) a "Demo Seller" account to own the imported books
 *   3. For each genre bucket, queries Google Books and maps the results onto
 *      our BookSchema (title, author, genre, description, itemImage, price, quantity)
 *   4. Skips any book that already exists (matched by title + author) so the
 *      script is safe to run more than once
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/connect");
const Seller = require("../models/Seller/SellerSchema");
const Book = require("../models/Seller/BookSchema");

// genre -> search query sent to Google Books
const GENRE_QUERIES = {
  Fiction: "subject:fiction",
  "Non-fiction": "subject:nonfiction",
  Science: "subject:science",
  Romance: "subject:romance",
  Children: "subject:juvenile+fiction",
};

const BOOKS_PER_GENRE = 8;

async function getOrCreateDemoSeller() {
  let seller = await Seller.findOne({ email: "demo.seller@bookease.com" });
  if (seller) return seller;

  const hashedPassword = await bcrypt.hash("Demo@1234", 10);
  seller = await Seller.create({
    name: "BookEase Curated",
    email: "demo.seller@bookease.com",
    password: hashedPassword,
    isApproved: true, // pre-approved so seeded books are immediately visible
  });
  console.log("Created demo seller (email: demo.seller@bookease.com, password: Demo@1234)");
  return seller;
}

// Google Books doesn't give a real price, so we generate a plausible one
function randomPrice() {
  return Math.floor(Math.random() * (799 - 199 + 1) + 199); // ₹199 - ₹799
}
function randomStock() {
  return Math.floor(Math.random() * 20) + 5; // 5 - 25 copies
}

async function fetchBooksForGenre(genre, query) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    query
  )}&maxResults=${BOOKS_PER_GENRE}&printType=books`;

  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  ⚠ Google Books request failed for "${genre}" (${res.status})`);
    return [];
  }
  const data = await res.json();
  return data.items || [];
}

async function run() {
  await connectDB();
  const seller = await getOrCreateDemoSeller();

  let inserted = 0;
  let skipped = 0;

  for (const [genre, query] of Object.entries(GENRE_QUERIES)) {
    console.log(`\nFetching "${genre}" books…`);
    const items = await fetchBooksForGenre(genre, query);

    for (const item of items) {
      const info = item.volumeInfo || {};
      if (!info.title) continue;

      const author = (info.authors && info.authors.join(", ")) || "Unknown Author";

      const alreadyExists = await Book.findOne({ title: info.title, author });
      if (alreadyExists) {
        skipped++;
        continue;
      }

      await Book.create({
        title: info.title,
        author,
        genre,
        description: (info.description || "No description available.").slice(0, 1000),
        itemImage: info.imageLinks?.thumbnail?.replace("http://", "https://") || "",
        price: randomPrice(),
        quantity: randomStock(),
        sellerId: seller._id,
        sellerName: seller.name,
      });
      inserted++;
      console.log(`  + ${info.title} — ${author}`);
    }
  }

  console.log(`\nDone. Inserted ${inserted} new books, skipped ${skipped} duplicates.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});
