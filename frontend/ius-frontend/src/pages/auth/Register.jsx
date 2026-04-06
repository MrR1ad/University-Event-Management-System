import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'Student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(field, val) { setForm(f => ({ ...f, [field]: val })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      const user = register(form.name, form.email, form.password, form.role);
      navigate(`/${user.role.toLowerCase()}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-badge">IUS</span>
        </div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join IUS Event Management</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input placeholder="Amir Hodžić" value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="your@ius.edu.ba" value={form.email} onChange={e => set('email', e.target.value)} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" placeholder="••••••••" value={form.confirm} onChange={e => set('confirm', e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label>Role</label>
            <select value={form.role} onChange={e => set('role', e.target.value)}>
              <option value="Student">Student</option>
              <option value="Organizer">Event Organizer</option>
            </select>
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
