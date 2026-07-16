import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminApi } from "../services/api";

export default function Asignup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await adminApi.post("/signup", form);
      navigate("/admin/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <p className="section-eyebrow">System access</p>
      <h1 className="text-3xl font-semibold mt-2">Create an admin account</h1>
      <p className="text-sm text-ink/50 mt-2">
        Note: in production this page should be locked down — anyone able to reach it can create a full admin account.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        {error && <p className="text-spine-fiction text-sm">{error}</p>}
        <div>
          <label className="text-sm font-medium">Name</label>
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
        <button className="btn-primary w-full">Create admin account</button>
      </form>

      <p className="text-sm text-ink/60 mt-6">
        <Link to="/admin/login" className="text-brass-dark hover:underline">Back to sign in</Link>
      </p>
    </div>
  );
}
