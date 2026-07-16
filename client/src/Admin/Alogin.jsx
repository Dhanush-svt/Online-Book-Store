import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi, auth } from "../services/api";

export default function Alogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await adminApi.post("/login", form);
      auth.saveToken("admin", res.data.token);
      navigate("/admin/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <p className="section-eyebrow">System access</p>
      <h1 className="text-3xl font-semibold mt-2">Admin sign in</h1>

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
    </div>
  );
}
