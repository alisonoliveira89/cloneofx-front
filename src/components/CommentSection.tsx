'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

type Comment = {
  id: number
  username: string
  content: string
  created_at: string
}

type Props = {
  tweetId: number
}

export default function CommentSection({ tweetId }: Props) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)

  function fetchComments() {
    const token = localStorage.getItem('token')
    if (!token) return

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/tweets/${tweetId}/comments/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setComments(res.data))
      .catch((err) => console.error(err))
  }

  useEffect(() => {
    fetchComments()
  }, [])

  function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token || !newComment.trim()) return

    setLoading(true)

    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/tweets/${tweetId}/comment/`,
        { content: newComment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setNewComment('')
        fetchComments()
      })
      .finally(() => setLoading(false))
  }

  return (
    <div className="mt-3 space-y-4 text-sm text-gray-200">
      <form onSubmit={handleCommentSubmit} className="flex gap-2 items-center">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 px-3 py-1 bg-zinc-800 border border-zinc-600 rounded-md text-white"
          placeholder="Comente algo..."
        />
        <button
          className="text-blue-500 hover:underline text-sm disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          Enviar
        </button>
      </form>

      {comments.length === 0 && <p className="text-gray-500">Nenhum comentário ainda.</p>}

      {comments.map((c) => (
        <div key={c.id}>
          <strong className="text-white">@{c.username}</strong>{' '}
          <span className="text-gray-400">{c.content}</span>
        </div>
      ))}
    </div>
  )
}
