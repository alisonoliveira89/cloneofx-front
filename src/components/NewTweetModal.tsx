'use client';

import { useState } from 'react';
import axios from 'axios';

type NewTweetModalProps = {
  onClose: () => void;
  onTweetCreated: (newTweet: { id: number; user: string; username: string; content: string; created_at: string }) => void;
};

export default function NewTweetModal({ onClose, onTweetCreated }: NewTweetModalProps) {
  const [content, setContent] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/tweets/`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onTweetCreated(response.data);
    } catch (err) {
      alert('Erro ao criar tweet');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md text-white border border-zinc-700 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Novo Tweet</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="O que está acontecendo?"
            rows={4}
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-md resize-none text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Tweetar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
