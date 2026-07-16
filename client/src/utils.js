// Maps a book genre to one of the "spine" accent colors defined in tailwind.config.js
export function spineColorVar(genre = "") {
  const key = genre.toLowerCase();
  const map = {
    fiction: "#7A3B3B",
    "non-fiction": "#3B5D7A",
    nonfiction: "#3B5D7A",
    science: "#3B7A5D",
    romance: "#8F3B6E",
    children: "#B8863B",
    "children's": "#B8863B",
  };
  return map[key] || "#5A5648";
}

export function formatPrice(price) {
  const value = Number(price) || 0;
  return `₹${value.toFixed(2)}`;
}
