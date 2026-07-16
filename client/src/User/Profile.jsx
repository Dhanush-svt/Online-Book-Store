import { useEffect, useState } from "react";
import { userApi } from "../services/api";

export default function Profile() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    userApi.get("/profile").then((res) =>
      setForm({ name: res.data.user.name, email: res.data.user.email, password: "" })
    );
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await userApi.put("/profile", form);
      setMessage("Profile updated.");
      setForm({ ...form, password: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-14">
      <p className="section-eyebrow">Account</p>
      <h1 className="text-3xl font-semibold mt-1">Your profile</h1>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        {message && <p className="text-brass-dark text-sm">{message}</p>}
        <div>
          <label className="text-sm font-medium">Full name</label>
          <input className="input-field mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input className="input-field mt-1" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium">New password (optional)</label>
          <input type="password" className="input-field mt-1" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Leave blank to keep current" />
        </div>
        <button className="btn-primary w-full">Save changes</button>
      </form>
    </div>
  );
}
