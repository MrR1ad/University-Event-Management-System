import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(f, v) { setForm(x => ({ ...x, [f]: v })); }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = login(form.email, form.password);
      navigate(`/${user.role.toLowerCase()}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="canvas">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div style={{ zIndex: 10, width: '100%', maxWidth: 440, padding: '0 16px' }}>
        <div style={{
          background: 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.8)',
          borderRadius: 45, padding: clamp(32, 48),
          boxShadow: '0 40px 100px rgba(0,0,0,0.1)',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
            <div className="ius-logo" style={{ width: 60, height: 60, fontSize: 16, borderRadius: 18, marginBottom: 12 }}>IUS</div>
            <h2 style={{ margin: 0, fontWeight: 800, color: '#2d3436', fontSize: '1.6rem' }}>Welcome back</h2>
            <p style={{ margin: '6px 0 0', color: '#888', fontSize: '0.9rem' }}>Sign in to Event Management</p>
          </div>

          {/* Demo quick-login */}
          <div style={{
            background: 'rgba(255,255,255,0.5)', border: '1.5px dashed rgba(0,51,102,0.2)',
            borderRadius: 20, padding: 16, marginBottom: 24, textAlign: 'center'
          }}>
            <p style={{ fontSize: '0.78rem', color: '#888', marginBottom: 10, fontWeight: 600 }}>Quick demo login</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { label: 'Admin',     email: 'admin@ius.edu.ba'     },
                { label: 'Organizer', email: 'organizer@ius.edu.ba' },
                { label: 'Student',   email: 'student@ius.edu.ba'   },
              ].map(r => (
                <button key={r.label} className="btn btn-ghost btn-sm"
                  onClick={() => setForm({ email: r.email, password: 'demo' })}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="your@ius.edu.ba"
                value={form.email} onChange={e => set('email', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••"
                value={form.password} onChange={e => set('password', e.target.value)} required />
            </div>

            {error && (
              <div style={{
                background: '#fff5f5', border: '1.5px solid #fecaca', borderRadius: 15,
                padding: '11px 16px', color: '#e74c3c', fontSize: '0.85rem',
                fontWeight: 600, marginBottom: 16
              }}>{error}</div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px' }} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#888', marginTop: 20 }}>
            No account? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 700 }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// tiny helper for inline style readability
function clamp(min, max) { return `clamp(${min}px, 5vw, ${max}px)`; }
