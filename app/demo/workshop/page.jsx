'use client';
import { useState } from 'react';

export default function ChatDemo() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.choices[0].message.content }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Fehler beim Chat.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-2xl shadow-lg flex flex-col">
      <div className="flex-1 p-3 overflow-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className="inline-block p-2 rounded-lg bg-gray-100">{msg.content}</span>
          </div>
        ))}
      </div>
      <div className="p-2 border-t flex">
        <input
          type="text"
          placeholder="Nachricht..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-l-lg"
        />
        <button onClick={sendMessage} disabled={loading} className="p-2 bg-blue-600 text-white rounded-r-lg">
          {loading ? '...' : 'Senden'}
        </button>
      </div>
    </div>
  );
}
