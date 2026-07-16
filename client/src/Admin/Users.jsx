import { useEffect, useState } from "react";
import { adminApi } from "../services/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const load = () => adminApi.get("/users").then((res) => setUsers(res.data.users));

  useEffect(() => {
    load();
  }, []);

  const toggleBlock = async (id) => {
    await adminApi.put(`/users/${id}/block`);
    load();
  };

  const remove = async (id, name) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    await adminApi.delete(`/users/${id}`);
    load();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <p className="section-eyebrow">People</p>
      <h1 className="text-3xl font-semibold mt-1">Users</h1>

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
            {users.map((u) => (
              <tr key={u._id} className="border-b border-ink/5">
                <td className="py-3 pr-4 font-medium">{u.name}</td>
                <td className="py-3 pr-4 text-ink/70">{u.email}</td>
                <td className="py-3 pr-4">
                  <span className={u.isBlocked ? "text-spine-fiction" : "text-spine-science"}>
                    {u.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="py-3 pr-4 space-x-3">
                  <button onClick={() => toggleBlock(u._id)} className="text-brass-dark hover:underline">
                    {u.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button onClick={() => remove(u._id, u.name)} className="text-spine-fiction hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={4} className="py-6 text-ink/40">No users yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
