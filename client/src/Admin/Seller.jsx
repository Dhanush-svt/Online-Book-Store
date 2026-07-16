import { useEffect, useState } from "react";
import { adminApi } from "../services/api";

export default function Seller() {
  const [sellers, setSellers] = useState([]);
  const load = () => adminApi.get("/sellers").then((res) => setSellers(res.data.sellers));

  useEffect(() => {
    load();
  }, []);

  const approve = async (id) => {
    await adminApi.put(`/sellers/${id}/approve`);
    load();
  };
  const toggleBlock = async (id) => {
    await adminApi.put(`/sellers/${id}/block`);
    load();
  };
  const remove = async (id, name) => {
    if (!confirm(`Delete seller "${name}"? This cannot be undone.`)) return;
    await adminApi.delete(`/sellers/${id}`);
    load();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <p className="section-eyebrow">Partners</p>
      <h1 className="text-3xl font-semibold mt-1">Sellers</h1>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/50 border-b border-ink/10">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((s) => (
              <tr key={s._id} className="border-b border-ink/5">
                <td className="py-3 pr-4 font-medium">{s.name}</td>
                <td className="py-3 pr-4 text-ink/70">{s.email}</td>
                <td className="py-3 pr-4">
                  {!s.isApproved ? (
                    <span className="text-brass-dark">Pending approval</span>
                  ) : s.isBlocked ? (
                    <span className="text-spine-fiction">Blocked</span>
                  ) : (
                    <span className="text-spine-science">Active</span>
                  )}
                </td>
                <td className="py-3 pr-4 space-x-3">
                  {!s.isApproved && (
                    <button onClick={() => approve(s._id)} className="text-spine-science hover:underline">Approve</button>
                  )}
                  {s.isApproved && (
                    <button onClick={() => toggleBlock(s._id)} className="text-brass-dark hover:underline">
                      {s.isBlocked ? "Unblock" : "Block"}
                    </button>
                  )}
                  <button onClick={() => remove(s._id, s.name)} className="text-spine-fiction hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {sellers.length === 0 && (
              <tr><td colSpan={4} className="py-6 text-ink/40">No sellers yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
