import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiRequest } from '../services/api';

export default function AdminSetupPage() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const token = searchParams.get('token');
      const res = await apiRequest('/auth/setup-password', {
        method: 'POST',
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      setStatus(res.message || 'Password created successfully.');
    } catch (error) {
      setStatus(error.message || 'Unable to set password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-sable/10 bg-white/70 p-8 shadow-soft">
        <p className="text-[10px] uppercase tracking-[0.24em] text-sable/60">Setup</p>
        <h1 className="mt-2 font-serif text-4xl text-sable">Create your administrator password</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm text-sable">
            New password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-2 w-full rounded-xl border border-sable/10 bg-white px-4 py-3 outline-none focus:border-sable/40" />
          </label>
          <label className="block text-sm text-sable">
            Confirm password
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="mt-2 w-full rounded-xl border border-sable/10 bg-white px-4 py-3 outline-none focus:border-sable/40" />
          </label>
          <button type="submit" disabled={loading} className="w-full rounded-full bg-sable px-6 py-3 text-sm uppercase tracking-[0.18em] text-ivory disabled:opacity-70">
            {loading ? 'Setting up...' : 'Create password'}
          </button>
        </form>
        {status && <p className="mt-5 text-sm text-sable/80">{status}</p>}
      </div>
    </div>
  );
}
