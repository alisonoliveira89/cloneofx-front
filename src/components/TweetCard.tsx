'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FaHeart } from 'react-icons/fa'
import { FaRegComment } from 'react-icons/fa'
import { FiTrash2 } from 'react-icons/fi'
import axios from 'axios'
import toast from 'react-hot-toast'

import CommentSection from './CommentSection'

type TweetProps = {
  id: number
  user: number
  username: string
  content: string
  created_at: string
  likes_count?: number
  liked_by_me?: boolean
  comments_count?: number
  userId?: string // ID do usuário logado
  onDelete?: (id: number) => void
}

export default function TweetCard({
  id,
  user,
  username,
  content,
  created_at,
  likes_count = 0,
  liked_by_me = false,
  comments_count,
  userId,
  onDelete,
}: TweetProps) {
  const [likes, setLikes] = useState(likes_count)
  const [liked, setLiked] = useState(liked_by_me)
  const [showComments, setShowComments] = useState(false)

  async function handleLike() {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/tweets/${id}/like/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setLiked(res.data.liked)
      setLikes((prev) => prev + (res.data.liked ? 1 : -1))
    } catch (_) {
      console.error('Erro ao curtir:', err)
    }
  }

  async function handleDelete() {
    const token = localStorage.getItem('token')
    if (!token) return

    const confirmDelete = window.confirm('Deseja realmente excluir este tweet?')
    if (!confirmDelete) return

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tweets/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Tweet excluído com sucesso!')
      onDelete?.(id)
    } catch (_) {
      toast.error('Erro ao excluir tweet')
      console.error(err)
    }
  }

  return (
    <div className="border-b border-zinc-700 p-4 hover:bg-zinc-800 transition-colors">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-zinc-600" />
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <Link href={`/profile/${user}`}>
              <div className="font-semibold text-white hover:underline cursor-pointer">
                @{username}
              </div>
            </Link>
            {String(userId) === String(user) && (
              <button
                onClick={handleDelete}
                title="Excluir tweet"
                className="text-gray-400 hover:text-red-500 transition"
              >
                <FiTrash2 size={16} />
              </button>
            )}
          </div>

          <div className="text-gray-400 text-sm">{new Date(created_at).toLocaleString()}</div>
          <p className="mt-2 text-gray-200">{content}</p>

          <div className="flex items-center gap-4 mt-3 text-sm">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition"
            >
              <FaHeart className={liked ? 'text-red-500' : 'text-gray-400'} />
              <span>{likes}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition"
            >
              <FaRegComment />
              <span>{showComments ? 'Ocultar' : 'Comentar'}</span>
              <span>{comments_count}</span>
            </button>
          </div>

          {showComments && <CommentSection tweetId={id} />}
        </div>
      </div>
    </div>
  )
}
