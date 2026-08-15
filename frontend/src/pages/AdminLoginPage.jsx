import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const res = await apiRequest('/auth/request-access', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setStatus(res.message || 'If this email is authorized, you will receive an email shortly.');
    } catch (error) {
      setStatus(error.message || 'Unable to process request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-sable/10 bg-white/70 p-8 shadow-soft">
        <p className="text-[10px] uppercase tracking-[0.24em] text-sable/60">Admin access</p>
        <h1 className="mt-2 font-serif text-4xl text-sable">Request access</h1>
        <p className="mt-4 text-sable/70">Enter your authorized email to receive a secure setup link.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm text-sable">
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-2 w-full rounded-xl border border-sable/10 bg-white px-4 py-3 outline-none focus:border-sable/40" />
          </label>
          <button type="submit" disabled={loading} className="w-full rounded-full bg-sable px-6 py-3 text-sm uppercase tracking-[0.18em] text-ivory disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? 'Sending...' : 'Request access'}
          </button>
        </form>
        {status && <p className="mt-5 text-sm text-sable/80">{status}</p>}
        <div className="mt-6 text-sm text-sable/70">
          Already set up? <Link to="/admin/setup" className="font-medium underline">Create your password</Link>
        </div>
      </div>
    </div>
  );
}
