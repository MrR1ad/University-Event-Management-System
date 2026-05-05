import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'Student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(f, v) { setForm(x => ({ ...x, [f]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password, form.role);
      navigate(`/${user.role.toLowerCase()}`);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="canvas">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div style={{ zIndex: 10, width: '100%', maxWidth: 480, padding: '0 16px' }}>
        <div style={{
          background: 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.8)',
          borderRadius: 45, padding: 40,
          boxShadow: '0 40px 100px rgba(0,0,0,0.1)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
            <div className="ius-logo" style={{ width: 60, height: 60, fontSize: 16, borderRadius: 18, marginBottom: 12 }}>IUS</div>
            <h2 style={{ margin: 0, fontWeight: 800, color: '#2d3436', fontSize: '1.5rem' }}>Create Account</h2>
            <p style={{ margin: '6px 0 0', color: '#888', fontSize: '0.9rem' }}>Join IUS Event Management</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input placeholder="Amir Hodžić" value={form.name}
                onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="your@ius.edu.ba" value={form.email}
                onChange={e => set('email', e.target.value)} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="Min 6 chars" value={form.password}
                  onChange={e => set('password', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Confirm</label>
                <input type="password" placeholder="••••••••" value={form.confirm}
                  onChange={e => set('confirm', e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label>Role</label>
              <select value={form.role} onChange={e => set('role', e.target.value)}>
                <option value="Student">Student</option>
                <option value="Organizer">Event Organizer</option>
              </select>
            </div>

            {error && (
              <div style={{
                background: '#fff5f5', border: '1.5px solid #fecaca', borderRadius: 15,
                padding: '11px 16px', color: '#e74c3c', fontSize: '0.85rem',
                fontWeight: 600, marginBottom: 16
              }}>{error}</div>
            )}

            <button type="submit" className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '13px' }}
              disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#888', marginTop: 20 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 700 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
