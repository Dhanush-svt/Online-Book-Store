import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userApi } from "../services/api";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await userApi.post("/signup", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <p className="section-eyebrow">Join BookEase</p>
      <h1 className="text-3xl font-semibold mt-2">Create your account</h1>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        {error && <p className="text-spine-fiction text-sm">{error}</p>}
        <div>
          <label className="text-sm font-medium">Full name</label>
          <input name="name" value={form.name} onChange={onChange} required className="input-field mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input type="email" name="email" value={form.email} onChange={onChange} required className="input-field mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <input type="password" name="password" value={form.password} onChange={onChange} required minLength={6} className="input-field mt-1" />
        </div>
        <button disabled={loading} className="btn-primary w-full">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-sm text-ink/60 mt-6">
        Already have an account? <Link to="/login" className="text-brass-dark hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
