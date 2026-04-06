import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { getUsers, updateUserRole, toggleUserStatus } from '../../api/index';
import { useToast } from '../../components/Toast';

const ROLES = ['Student', 'Organizer', 'Admin'];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const { toast } = useToast();

  useEffect(() => { getUsers().then(setUsers); }, []);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'All' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  async function handleRoleChange(userId, newRole) {
    await updateUserRole(userId, newRole);
    setUsers(u => u.map(x => x.id === userId ? { ...x, role: newRole } : x));
    toast('Role updated');
  }

  async function handleToggleStatus(user) {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    await toggleUserStatus(user.id, newStatus);
    setUsers(u => u.map(x => x.id === user.id ? { ...x, status: newStatus } : x));
    toast(`User ${newStatus === 'Active' ? 'activated' : 'deactivated'}`);
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Users</h1>
          <p className="page-subtitle">Manage accounts and roles</p>
        </div>
        <div className="flex gap-2">
          <span className="badge badge-blue">{users.length} total</span>
        </div>
      </div>

      <div className="card">
        <div className="filter-row">
          <input
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 300 }}
          />
          <select value={filterRole} onChange={e => setFilterRole(e.target.value)} style={{ maxWidth: 160 }}>
            <option value="All">All Roles</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="table-wrap" style={{ marginTop: 16 }}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="flex flex-center gap-2">
                      <div className="user-avatar-sm">{u.name.charAt(0)}</div>
                      <span style={{ fontWeight: 500, color: 'var(--text-head)' }}>{u.name}</span>
                    </div>
                  </td>
                  <td className="text-dim text-sm mono">{u.email}</td>
                  <td>
                    <select
                      value={u.role}
                      onChange={e => handleRoleChange(u.id, e.target.value)}
                      className="role-select"
                    >
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td>
                    <span className={`badge ${u.status === 'Active' ? 'badge-green' : 'badge-red'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="text-dim text-sm">{u.joinedAt}</td>
                  <td>
                    <button
                      className={`btn btn-sm ${u.status === 'Active' ? 'btn-danger' : 'btn-ghost'}`}
                      onClick={() => handleToggleStatus(u)}
                    >
                      {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-dim)', padding: 32 }}>No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
