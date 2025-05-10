'use client'

import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { IoSearch } from 'react-icons/io5'

interface User {
  id: string
  username: string
  email: string
}

export default function UserSearch() {
  const [showInput, setShowInput] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<User[]>([])
  const { token } = useAuth()

  const handleSearch = async () => {
    if (!query || !token) return

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/?search=${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setResults(response.data)
    } catch (err) {
      console.error('Erro ao buscar usuários', err)
    }
  }

  return (
    <div className="text-white">
      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          className="text-gray-400 hover:text-white transition"
          title="Buscar usuários"
        >
          <IoSearch size={24} />
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Buscar usuário..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-3 py-2 text-sm bg-black border border-gray-700 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              title="Buscar"
            >
              <IoSearch size={20} />
            </button>
          </div>

          {results.length > 0 && (
            <ul className="space-y-2">
              {results.map((user) => (
                <li key={user.id}>
                  <Link href={`/profile/${user.id}`} className="text-blue-400 hover:underline">
                    @{user.username}
                  </Link>
                  <span className="text-sm text-gray-400 ml-2">{user.email}</span>
                </li>
              ))}
            </ul>
          )}

          {results.length === 0 && query && (
            <p className="text-sm text-gray-500">Nenhum usuário encontrado.</p>
          )}
        </div>
      )}
    </div>
  )
}
