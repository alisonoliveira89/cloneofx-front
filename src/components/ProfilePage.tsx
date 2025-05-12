'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import MainLayout from '@/components/MainLayout'
import TweetCard from '@/components/TweetCard'
import { Tweet } from '@/types/tweet'

interface User {
  id: number
  username: string
  email: string
  followers_count: number
  following_count: number
}

interface ProfilePageProps {
  id: string
}

const ProfilePage = ({ id }: ProfilePageProps) => {
  const { token, userId, isLoading } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const isMyProfile = userId && Number(userId) === user?.id

  useEffect(() => {
    if (isLoading || !token || !id) return

    const headers = { Authorization: `Bearer ${token}` }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}/`, { headers })
        setUser(res.data)
        if (!isMyProfile) {
          setTweets(res.data.tweets)
        }
      } catch (_) {
        setError('Erro ao carregar perfil')
      }
    }

    const fetchTweets = async () => {
      try {
        if (isMyProfile) {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tweets/my/`, {
            headers,
          })
          setTweets(res.data)
        }
      } catch (_) {
        console.error('Erro ao carregar tweets', err)
      }
    }

    const fetchFollowingStatus = async () => {
      if (isMyProfile) return
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/is_following/`,
          { headers }
        )
        setIsFollowing(res.data.is_following)
      } catch (_) {
        console.error('Erro ao verificar seguimento', err)
      }
    }

    fetchUser()
    fetchTweets()
    fetchFollowingStatus()
  }, [id, token, userId, isLoading])

  const handleFollowToggle = async () => {
    if (!token) return
    setLoading(true)
    try {
      const endpoint = isFollowing ? 'unfollow' : 'follow'
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/${endpoint}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setIsFollowing(!isFollowing)
      setUser((prev) =>
        prev
          ? {
              ...prev,
              followers_count: isFollowing ? prev.followers_count - 1 : prev.followers_count + 1,
            }
          : null
      )
    } catch (_) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTweet = (tweetId: number) => {
    setTweets((prev) => prev.filter((t) => t.id !== tweetId))
  }

  const handleTweetCreated = (newTweet: Tweet) => {
    setTweets((prev) => [newTweet, ...prev])
  }

  if (error) {
    return (
      <MainLayout>
        <p className="text-red-500 p-4">{error}</p>
      </MainLayout>
    )
  }

  if (!user) {
    return (
      <MainLayout>
        <p className="text-gray-500 p-4">Carregando perfil...</p>
      </MainLayout>
    )
  }

  return (
    <MainLayout onTweetCreatedGlobal={isMyProfile ? handleTweetCreated : undefined}>
      <div className="p-4">
        {/* Perfil */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-gray-300" />
          <div>
            <h1 className="text-xl font-bold">{user.username}</h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <div className="flex gap-4 text-sm text-gray-500 mt-1">
              <Link href={`/profile/${id}/follows/following`} className="hover:underline">
                <span>
                  <strong className="text-white">{user.following_count}</strong> seguindo
                </span>
              </Link>
              <Link href={`/profile/${id}/follows/followers`} className="hover:underline">
                <span>
                  <strong className="text-white">{user.followers_count}</strong> seguidores
                </span>
              </Link>
            </div>
          </div>

          {!isMyProfile && (
            <div className="ml-auto">
              <button
                onClick={handleFollowToggle}
                disabled={loading}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  isFollowing
                    ? 'bg-white text-black border border-gray-400 hover:bg-gray-100'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {loading ? '...' : isFollowing ? 'Deixar de seguir' : 'Seguir'}
              </button>
            </div>
          )}
        </div>

        {/* Tweets */}
        <h2 className="text-lg font-semibold mb-3">Tweets</h2>
        <div className="space-y-4">
          {tweets.length > 0 ? (
            tweets.map((tweet) => (
              <TweetCard
                key={tweet.id}
                {...tweet}
                userId={userId ?? undefined}
                onDelete={handleDeleteTweet}
              />
            ))
          ) : (
            <p className="text-gray-400">Este usuário ainda não tweetou.</p>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default ProfilePage
