import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userApi, auth } from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await userApi.post("/login", form);
      auth.saveToken("user", res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <p className="section-eyebrow">Welcome back</p>
      <h1 className="text-3xl font-semibold mt-2">Sign in</h1>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        {error && <p className="text-spine-fiction text-sm">{error}</p>}
        <div>
          <label className="text-sm font-medium">Email</label>
          <input type="email" name="email" value={form.email} onChange={onChange} required className="input-field mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <input type="password" name="password" value={form.password} onChange={onChange} required className="input-field mt-1" />
        </div>
        <button disabled={loading} className="btn-primary w-full">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-sm text-ink/60 mt-6">
        New to BookEase? <Link to="/signup" className="text-brass-dark hover:underline">Create an account</Link>
      </p>
      <p className="text-xs text-ink/40 mt-2">
        Selling books? <Link to="/seller/login" className="hover:underline">Seller sign in</Link> ·{" "}
        <Link to="/admin/login" className="hover:underline">Admin sign in</Link>
      </p>
    </div>
  );
}
