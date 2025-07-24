'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function LeadForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError('Bitte gültige E-Mail angeben.');
      return;
    }
    setLoading(true);
    const { error: supabaseError } = await supabase
      .from('leads')
      .insert([{ name, email, message }]);
    setLoading(false);
    if (supabaseError) {
      setError('Fehler beim Senden. Bitte versuche es später erneut.');
    } else {
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded-2xl shadow-lg">
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">Danke für deine Nachricht!</p>}
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        type="email"
        placeholder="E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full mb-3 p-2 border rounded"
      />
      <textarea
        placeholder="Nachricht"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        className="w-full mb-3 p-2 border rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full p-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        {loading ? 'Senden...' : 'Absenden'}
      </button>
    </form>
  );
}
