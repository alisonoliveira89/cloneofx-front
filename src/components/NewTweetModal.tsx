'use client'

import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

import { Tweet } from '@/types/tweet'

import toast from 'react-hot-toast'

type NewTweetModalProps = {
  onClose: () => void
  onTweetCreated: (newTweet: Tweet) => void
}

export default function NewTweetModal({ onClose, onTweetCreated }: NewTweetModalProps) {
  const [content, setContent] = useState('')
  const modalRef = useRef<HTMLDivElement>(null)

  // Detecta clique fora do modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/tweets/`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      onTweetCreated(response.data)
      toast.success('Tweet publicado com sucesso!')
    } catch (err) {
      toast.error('Erro ao criar tweet')
      console.error(err)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl shadow-xl w-full max-w-md mx-4 text-white"
      >
        <h2 className="text-xl font-bold mb-4">Novo Tweet</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="O que está acontecendo?"
            rows={4}
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-md resize-none text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="flex justify-end gap-2">
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
  )
}
