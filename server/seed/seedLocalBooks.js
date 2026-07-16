/**
 * Seeds the database with a curated set of books whose cover images already
 * live in /server/uploads (uploaded locally, not fetched from an API).
 *
 * Usage:
 *   npm run seed:local
 *
 * What it does:
 *   1. Connects to MongoDB using MONGO_URI from .env
 *   2. Creates (or reuses) a "Demo Seller" account to own these books
 *   3. Inserts each book below, pointing itemImage at its local file in
 *      /uploads (served statically by server.js at /uploads/<filename>)
 *   4. Skips any book that already exists (matched by title + author) so the
 *      script is safe to run more than once
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/connect");
const Seller = require("../models/Seller/SellerSchema");
const Book = require("../models/Seller/BookSchema");

const BOOKS = [
  {
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    genre: "Non-fiction",
    itemImage: "/uploads/rich-dad-poor-dad.jpg",
    description:
      "A personal-finance classic that contrasts two father figures' views on money, work, and investing, challenging readers to rethink how they build wealth and financial independence.",
  },
  {
    title: "Elon Musk",
    author: "Walter Isaacson",
    genre: "Non-fiction",
    itemImage: "/uploads/elon-musk.jpg",
    description:
      "A sweeping biography that goes behind the scenes of Tesla, SpaceX, and X, exploring the drive, risk-taking, and turbulence behind one of the most polarizing entrepreneurs of our time.",
  },
  {
    title: "Mister Magic",
    author: "Kiersten White",
    genre: "Fiction",
    itemImage: "/uploads/mister-magic.jpg",
    description:
      "A haunting novel about the surviving cast of a mysterious, beloved children's show who reunite decades later to confront the dark secrets behind its sudden, unexplained end.",
  },
  {
    title: "Think and Grow Rich",
    author: "Napoleon Hill & Ben Holden-Crowther",
    genre: "Non-fiction",
    itemImage: "/uploads/think-and-grow-rich.jpg",
    description:
      "One of the best-selling motivational books of all time, distilling the habits and mindset of history's wealthiest self-made individuals into practical principles for success.",
  },
  {
    title: "Harry Potter and the Deathly Hallows",
    author: "J.K. Rowling",
    genre: "Fiction",
    itemImage: "/uploads/harry-potter-deathly-hallows.jpg",
    description:
      "The epic conclusion to the Harry Potter series, following Harry, Ron, and Hermione as they hunt down the remaining Horcruxes in a final stand against Lord Voldemort.",
  },
  {
    title: "Journey on the James",
    author: "Earl Swift",
    genre: "Non-fiction",
    itemImage: "/uploads/journey-on-the-james.jpg",
    description:
      "A vivid travel memoir chronicling a three-week solo journey down Virginia's James River, weaving history, ecology, and the people who live along its banks.",
  },
  {
    title: "The Mosquito",
    author: "Timothy C. Winegard",
    genre: "Science",
    itemImage: "/uploads/the-mosquito.jpg",
    description:
      "A gripping account of how the humble mosquito has shaped human history, toppled empires, and killed more people than any other creature on Earth.",
  },
  {
    title: "Auto Biography",
    author: "Earl Swift",
    genre: "Non-fiction",
    itemImage: "/uploads/autobiography.jpg",
    description:
      "The story of a battered 1957 Chevy and the eccentric outlaw mechanic obsessed with restoring it, offering a wry meditation on cars, class, and the American Dream.",
  },
  {
    title: "River Sing Me Home",
    author: "Eleanor Shearer",
    genre: "Fiction",
    itemImage: "/uploads/river-sing-me-home.jpg",
    description:
      "Set in the aftermath of slavery's abolition in the Caribbean, this novel follows a mother's determined journey to find the children who were torn from her.",
  },
  {
    title: "Don't Let Her Stay",
    author: "Nicola Sanders",
    genre: "Fiction",
    itemImage: "/uploads/dont-let-her-stay.jpg",
    description:
      "A twisty psychological thriller about a woman convinced someone inside her own home wants her dead, and no one around her believes her.",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    itemImage: "/uploads/to-kill-a-mockingbird.jpg",
    description:
      "A timeless Pulitzer Prize-winning novel about racial injustice and moral growth in the American South, seen through the eyes of young Scout Finch.",
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction",
    itemImage: "/uploads/the-alchemist.jpg",
    description:
      "A lyrical fable about a shepherd boy's journey across the desert in search of treasure, and the wisdom he gains about following one's personal calling.",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Non-fiction",
    itemImage: "/uploads/atomic-habits.jpg",
    description:
      "A practical, science-backed guide to building good habits and breaking bad ones through small, consistent changes that compound into remarkable results.",
  },
];

function randomPrice() {
  // ₹200 - ₹500
  return Math.floor(Math.random() * (500 - 200 + 1)) + 200;
}
function randomStock() {
  return Math.floor(Math.random() * 20) + 5; // 5 - 25 copies
}

async function getOrCreateDemoSeller() {
  let seller = await Seller.findOne({ email: "demo.seller@bookease.com" });
  if (seller) return seller;

  const hashedPassword = await bcrypt.hash("Demo@1234", 10);
  seller = await Seller.create({
    name: "BookEase Curated",
    email: "demo.seller@bookease.com",
    password: hashedPassword,
    isApproved: true,
  });
  console.log("Created demo seller (email: demo.seller@bookease.com, password: Demo@1234)");
  return seller;
}

async function run() {
  await connectDB();
  const seller = await getOrCreateDemoSeller();

  let inserted = 0;
  let skipped = 0;

  for (const b of BOOKS) {
    const exists = await Book.findOne({ title: b.title, author: b.author });
    if (exists) {
      skipped++;
      continue;
    }

    await Book.create({
      ...b,
      price: randomPrice(),
      quantity: randomStock(),
      sellerId: seller._id,
      sellerName: seller.name,
    });
    inserted++;
    console.log(`  + ${b.title} — ${b.author}`);
  }

  console.log(`\nDone. Inserted ${inserted} new books, skipped ${skipped} duplicates.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});
