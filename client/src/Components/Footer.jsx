export default function Footer() {
  return (
    <footer className="bg-ink text-paper mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <h3 className="text-2xl font-display font-semibold text-brass-light">BookEase</h3>
          <p className="mt-2 text-sm text-paper/70 max-w-xs">
            A shelf that never closes. Browse, buy, and track every book you
            bring home.
          </p>
        </div>

        <div>
          <p className="section-eyebrow text-brass-light">Shop</p>
          <ul className="mt-3 space-y-2 text-sm text-paper/80">
            <li><a href="/products" className="hover:text-brass-light">Browse books</a></li>
            <li><a href="/login" className="hover:text-brass-light">Sign in</a></li>
            <li><a href="/signup" className="hover:text-brass-light">Create account</a></li>
          </ul>
        </div>

        <div>
          <p className="section-eyebrow text-brass-light">For partners</p>
          <ul className="mt-3 space-y-2 text-sm text-paper/80">
            <li><a href="/seller/login" className="hover:text-brass-light">Seller sign in</a></li>
            <li><a href="/admin/login" className="hover:text-brass-light">Admin sign in</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/10 py-4 text-center text-xs text-paper/50">
        © {new Date().getFullYear()} BookEase. Built on the MERN stack.
      </div>
    </footer>
  );
}
