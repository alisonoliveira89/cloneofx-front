'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import TweetCard from '@/components/TweetCard'
import MainLayout from '@/components/MainLayout'
import NewTweetModal from '@/components/NewTweetModal'
import { useRouter } from 'next/navigation'
import UserSearch from '@/components/UserSearch'

import { Tweet } from '@/types/tweet'
import { useAuth } from '@/contexts/AuthContext'

export default function FeedPage() {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [showModal, setShowModal] = useState(false)
  const [view, setView] = useState<'feed' | 'my'>('feed')
  const router = useRouter()
  const { userId } = useAuth()

  const fetchTweets = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const endpoint = view === 'feed' ? '/tweets/feed/' : '/tweets/my/'

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTweets(res.data))
      .catch(() => {
        localStorage.removeItem('token')
        router.push('/login')
      })
  }

  useEffect(() => {
    fetchTweets()
  }, [view])

  function handleTweetCreated(newTweet: Tweet) {
    setTweets((prev) => [newTweet, ...prev])
    setShowModal(false)
  }

  function handleDeleteTweet(id: number) {
    setTweets((prev) => prev.filter((tweet) => tweet.id !== id))
  }

  return (
    <MainLayout>
      <div className="p-4">
        {/* Toggle entre feeds */}
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-xl font-bold">Seu Feed</h1>
          <button
            onClick={() => setView(view === 'feed' ? 'my' : 'feed')}
            className="px-4 py-2 bg-transparent border border-gray-600 rounded-full text-sm text-white hover:bg-zinc-800 transition duration-200 cursor-pointer"
          >
            {view === 'feed' ? 'Ver meus tweets' : 'Ver feed geral'}
          </button>
        </div>

        <div className="mb-6">
          <UserSearch />
        </div>

        {tweets.length === 0 && <p className="text-gray-400">Nenhum tweet encontrado.</p>}

        {tweets.map((tweet) => (
          <TweetCard
            key={tweet.id}
            {...tweet}
            userId={userId ?? undefined}
            onDelete={handleDeleteTweet}
          />
        ))}
      </div>

      {showModal && (
        <NewTweetModal onClose={() => setShowModal(false)} onTweetCreated={handleTweetCreated} />
      )}
    </MainLayout>
  )
}
