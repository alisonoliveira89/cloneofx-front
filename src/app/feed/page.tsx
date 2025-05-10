'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import TweetCard from '@/components/TweetCard'
import MainLayout from '@/components/MainLayout'
import NewTweetModal from '@/components/NewTweetModal'
import { useRouter } from 'next/navigation'
import UserSearch from '@/components/UserSearch'

type Tweet = {
  id: number
  user: string
  username: string
  content: string
  created_at: string
}

export default function FeedPage() {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/tweets/feed/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTweets(res.data))
      .catch(() => {
        localStorage.removeItem('token')
        router.push('/login')
      })
  }, [])

  function handleTweetCreated(newTweet: Tweet) {
    setTweets([newTweet, ...tweets])
    setShowModal(false)
  }

  return (
    <MainLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Seu Feed</h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
          >
            Novo Tweet
          </button>
        </div>

        <div className="mb-6">
          <UserSearch />
        </div>

        {tweets.length === 0 && <p className="text-gray-400">Nenhum tweet encontrado.</p>}

        {tweets.map((tweet) => (
          <TweetCard key={tweet.id} {...tweet} />
        ))}
      </div>

      {showModal && (
        <NewTweetModal onClose={() => setShowModal(false)} onTweetCreated={handleTweetCreated} />
      )}
    </MainLayout>
  )
}
