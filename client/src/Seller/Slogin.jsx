import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sellerApi, auth } from "../services/api";

export default function Slogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await sellerApi.post("/login", form);
      auth.saveToken("seller", res.data.token);
      navigate("/seller/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <p className="section-eyebrow">Seller portal</p>
      <h1 className="text-3xl font-semibold mt-2">Sign in</h1>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        {error && <p className="text-spine-fiction text-sm">{error}</p>}
        <div>
          <label className="text-sm font-medium">Email</label>
          <input required type="email" className="input-field mt-1" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <input required type="password" className="input-field mt-1" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="btn-primary w-full">Sign in</button>
      </form>

      <p className="text-sm text-ink/60 mt-6">
        New seller? <Link to="/seller/signup" className="text-brass-dark hover:underline">Create an account</Link>
      </p>
    </div>
  );
}
