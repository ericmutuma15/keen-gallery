import { useState } from 'react';
import { apiRequest } from '../services/api';

const inquiryTypes = ['Commission', 'Artwork Purchase', 'Collaboration', 'Brand Project', 'Exhibition', 'General Inquiry'];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    inquiryType: 'Commission',
    message: '',
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      await apiRequest('/contact', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setStatus('Your message has been sent successfully.');
      setForm({ name: '', email: '', phone: '', subject: '', inquiryType: 'Commission', message: '' });
    } catch (error) {
      setStatus(error.message || 'Unable to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#d0b38d]">Contact</p>
          <h1 className="mt-2 font-serif text-5xl text-[#f5efe6]">Commission inquiry</h1>
          <p className="mt-6 text-lg leading-8 text-[#dfe3dd]/80">Reach out to discuss commissions, acquisitions, collaborations, and creative projects rooted in Kenyan identity and modern storytelling.</p>
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-[#10181b]/80 p-6 text-sm text-[#e7e2d9]">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#d0b38d]">Based in</p>
            <p className="mt-3 font-serif text-2xl text-[#f5efe6]">Machakos, Kenya</p>
            <p className="mt-2">Open to commissions, exhibitions, and brand collaborations.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-[#11181b]/80 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-[#f5efe6]">
              Name
              <input name="name" value={form.name} onChange={handleChange} required className="rounded-xl border border-white/10 bg-[#0d1417] px-4 py-3 text-[#f5efe6] outline-none focus:border-[#f2b77a]/50" />
            </label>
            <label className="flex flex-col gap-2 text-sm text-[#f5efe6]">
              Email
              <input type="email" name="email" value={form.email} onChange={handleChange} required className="rounded-xl border border-white/10 bg-[#0d1417] px-4 py-3 text-[#f5efe6] outline-none focus:border-[#f2b77a]/50" />
            </label>
            <label className="flex flex-col gap-2 text-sm text-[#f5efe6]">
              Phone (optional)
              <input name="phone" value={form.phone} onChange={handleChange} className="rounded-xl border border-white/10 bg-[#0d1417] px-4 py-3 text-[#f5efe6] outline-none focus:border-[#f2b77a]/50" />
            </label>
            <label className="flex flex-col gap-2 text-sm text-[#f5efe6]">
              Subject
              <input name="subject" value={form.subject} onChange={handleChange} required className="rounded-xl border border-white/10 bg-[#0d1417] px-4 py-3 text-[#f5efe6] outline-none focus:border-[#f2b77a]/50" />
            </label>
          </div>

          <label className="mt-5 flex flex-col gap-2 text-sm text-[#f5efe6]">
            Inquiry type
            <select name="inquiryType" value={form.inquiryType} onChange={handleChange} className="rounded-xl border border-white/10 bg-[#0d1417] px-4 py-3 text-[#f5efe6] outline-none focus:border-[#f2b77a]/50">
              {inquiryTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>

          <label className="mt-5 flex flex-col gap-2 text-sm text-[#f5efe6]">
            Message
            <textarea name="message" value={form.message} onChange={handleChange} required rows="6" className="rounded-xl border border-white/10 bg-[#0d1417] px-4 py-3 text-[#f5efe6] outline-none focus:border-[#f2b77a]/50" />
          </label>

          <button type="submit" disabled={loading} className="mt-6 rounded-full bg-[#f2b77a] px-6 py-3 text-sm uppercase tracking-[0.18em] text-[#11181b] disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? 'Sending...' : 'Send inquiry'}
          </button>

          {status && <p className="mt-5 text-sm text-[#e7e2d9]">{status}</p>}
        </form>
      </div>
    </div>
  );
}
