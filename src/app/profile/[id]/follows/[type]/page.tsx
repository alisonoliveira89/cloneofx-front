'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import MainLayout from '@/components/MainLayout'
import { IoArrowBack } from 'react-icons/io5'

interface User {
  id: string
  username: string
  email: string
}

export default function FollowListPage() {
  const { id, type } = useParams() as { id: string; type: 'followers' | 'following' }
  const { token } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [profileName, setProfileName] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (!token || !id || !['followers', 'following'].includes(type)) return

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}/${type}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err))

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfileName(res.data.username))
      .catch(() => setProfileName(''))
  }, [id, type, token])

  const title = type === 'followers' ? 'Seguidores' : 'Seguindo'

  return (
    <MainLayout>
      <div className="p-4 text-white">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => router.back()}
            className="text-xl text-gray-400 hover:text-white"
            title="Voltar"
          >
            <IoArrowBack />
          </button>
          <h1 className="text-xl font-bold">
            {title} de <span className="text-gray-400">@{profileName}</span>
          </h1>
        </div>

        {users.length === 0 ? (
          <p className="text-gray-400">Nenhum resultado encontrado.</p>
        ) : (
          <ul className="space-y-3">
            {users.map((user) => (
              <li key={user.id}>
                <Link href={`/profile/${user.id}`} className="text-blue-400 hover:underline">
                  @{user.username}
                </Link>{' '}
                <span className="text-sm text-gray-400">{user.email}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </MainLayout>
  )
}
