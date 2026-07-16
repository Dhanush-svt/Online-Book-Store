import { Link } from "react-router-dom";
import { spineColorVar, formatPrice } from "../utils";
import { imageUrl } from "../services/api";

export default function BookCard({ book, linkTo, footer }) {
  const content = (
    <div className="spine-card h-full flex flex-col" style={{ "--spine-color": spineColorVar(book.genre) }}>
      <div className="aspect-[3/4] bg-ink/5 rounded overflow-hidden mb-3">
        {book.itemImage ? (
          <img
            src={imageUrl(book.itemImage)}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink/30 font-display text-sm">
            No cover
          </div>
        )}
      </div>
      <p className="section-eyebrow">{book.genre}</p>
      <h3 className="font-display text-lg font-semibold leading-snug mt-1">{book.title}</h3>
      <p className="text-sm text-ink/60">by {book.author}</p>
      <div className="mt-auto pt-3 flex items-center justify-between">
        <span className="font-mono font-semibold">{formatPrice(book.price)}</span>
        <span className={`text-xs ${book.quantity > 0 ? "text-spine-science" : "text-spine-fiction"}`}>
          {book.quantity > 0 ? `${book.quantity} in stock` : "Out of stock"}
        </span>
      </div>
      {footer && <div className="mt-3">{footer}</div>}
    </div>
  );

  return linkTo ? <Link to={linkTo}>{content}</Link> : content;
}
