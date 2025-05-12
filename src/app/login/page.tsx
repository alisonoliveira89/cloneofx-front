'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuthData } = useAuth() // pega o setter do contexto
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/login/`, {
        username,
        password,
      })
      // Salva no contexto + localStorage
      setAuthData(response.data.user_id, response.data.access, response.data.username)

      router.push('/feed')
    } catch (err) {
      alert('Login inválido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
      {/* Lado esquerdo: logo */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-12">
        <img src="/icons/x-logo.svg" alt="Logo X" className="max-h-[220px] h-1/2 object-contain" />
      </div>

      {/* Lado direito: conteúdo */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-6 sm:p-8 md:p-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold">Acontecendo agora</h1>
        <h2 className="text-xl sm:text-2xl font-bold mt-4 mb-6">Entre no X</h2>

        <div className="w-full max-w-sm">
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="text"
              placeholder="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-black border border-gray-700 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-black border border-gray-700 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-3 py-2 text-sm font-bold rounded-full transition duration-300 flex items-center justify-center gap-2 ${
                loading
                  ? 'bg-gray-600 text-white cursor-not-allowed'
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              {loading ? (
                <>
                  <img src="/icons/x-logo.svg" alt="Loading" className="w-5 h-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="text-center text-sm text-gray-400 mt-4">
            Não tem uma conta?
            <button
              onClick={() => router.push('/register')}
              className="ml-1 text-blue-500 hover:underline cursor-pointer"
            >
              Cadastre-se
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
