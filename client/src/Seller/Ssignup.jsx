import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sellerApi } from "../services/api";

export default function Ssignup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await sellerApi.post("/signup", form);
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  if (done) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold">Account created</h1>
        <p className="text-ink/60 mt-3">
          An admin needs to approve your seller account before you can sign in and list books.
        </p>
        <button onClick={() => navigate("/seller/login")} className="btn-primary mt-6">Go to sign in</button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <p className="section-eyebrow">Sell on BookEase</p>
      <h1 className="text-3xl font-semibold mt-2">Create a seller account</h1>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        {error && <p className="text-spine-fiction text-sm">{error}</p>}
        <div>
          <label className="text-sm font-medium">Business / seller name</label>
          <input required className="input-field mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input required type="email" className="input-field mt-1" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <input required type="password" minLength={6} className="input-field mt-1" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="btn-primary w-full">Create account</button>
      </form>

      <p className="text-sm text-ink/60 mt-6">
        Already approved? <Link to="/seller/login" className="text-brass-dark hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
