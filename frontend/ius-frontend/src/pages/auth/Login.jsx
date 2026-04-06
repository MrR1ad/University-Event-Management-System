import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(field, val) { setForm(f => ({ ...f, [field]: val })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = login(form.email, form.password);
      // Redirect based on role
      navigate(`/${user.role.toLowerCase()}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Quick login buttons for dev/demo
  function quickLogin(email) {
    setForm({ email, password: 'any' });
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-badge">IUS</span>
        </div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to IUS Event Management</p>

        {/* Demo shortcuts */}
        <div className="auth-demo">
          <p className="text-xs text-dim" style={{ marginBottom: 8 }}>Quick demo login:</p>
          <div className="auth-demo-btns">
            <button className="btn btn-ghost btn-sm" onClick={() => quickLogin('admin@ius.edu.ba')}>Admin</button>
            <button className="btn btn-ghost btn-sm" onClick={() => quickLogin('organizer@ius.edu.ba')}>Organizer</button>
            <button className="btn btn-ghost btn-sm" onClick={() => quickLogin('student@ius.edu.ba')}>Student</button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="your@ius.edu.ba"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => set('password', e.target.value)}
              required
            />
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
