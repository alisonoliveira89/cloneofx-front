'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'

import NewTweetModal from './NewTweetModal'
import ModalPortal from './ModalPortal'

import { BiHomeAlt2 } from 'react-icons/bi'
import { IoMdContact } from 'react-icons/io'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { Tweet } from '@/types/tweet'

export default function MainLayout({
  children,
  onTweetCreatedGlobal,
}: {
  children: React.ReactNode
  onTweetCreatedGlobal?: (tweet: Tweet) => void
}) {
  const pathname = usePathname()
  const { userId, username, logout } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  const handleTweetCreated = (newTweet: Tweet) => {
    setShowModal(false)
    onTweetCreatedGlobal?.(newTweet)
  }

  return (
    <>
      {/* Modal sobreposto à página */}
      {showModal && (
        <ModalPortal>
          <NewTweetModal onClose={() => setShowModal(false)} onTweetCreated={handleTweetCreated} />
        </ModalPortal>
      )}

      <div className="min-h-screen flex flex-col md:flex-row max-w-6xl mx-auto relative z-0">
        {/* Esquerda */}
        <aside className="hidden md:flex flex-col justify-between w-full md:w-1/4 border-r border-gray-200 p-4 text-white">
          <div>
            <div className="mb-6">
              <img src="/icons/x-logo.svg" alt="Logo X" className="w-10 h-10 object-contain" />
            </div>
            <nav className="mt-4 space-y-4 text-xl font-semibold text-white">
              <Link
                href="/feed"
                className={`flex items-center gap-3 px-2 py-1 rounded hover:bg-zinc-800 transition ${
                  pathname === '/feed' ? 'border-l-4 border-gray-300 text-gray-100 bg-zinc-800' : ''
                }`}
              >
                <BiHomeAlt2 size={26} />
                Home
              </Link>

              {userId && (
                <Link
                  href={`/profile/${userId}`}
                  className={`flex items-center gap-3 px-2 py-1 rounded hover:bg-zinc-800 transition ${
                    pathname === `/profile/${userId}`
                      ? 'border-l-4 border-gray-300 text-gray-100 bg-zinc-800'
                      : ''
                  }`}
                >
                  <IoMdContact size={26} />
                  Perfil
                </Link>
              )}

              <button
                onClick={() => setShowModal(true)}
                className="w-full px-4 py-2 mt-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition duration-200 cursor-pointer"
              >
                Novo Tweet
              </button>
            </nav>
          </div>

          {/* Avatar + nome + logout */}
          {userId && username && (
            <div className="relative mt-6">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setShowMenu(!showMenu)}
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold uppercase">
                  {username.charAt(0)}
                </div>
                <span className="font-semibold text-white truncate">@{username}</span>
                <BsThreeDotsVertical size={20} className="text-gray-400 hover:text-white" />
              </div>

              {showMenu && (
                <div className="absolute bottom-12 left-0 bg-zinc-800 text-white text-sm rounded shadow-lg py-2 w-32 z-50">
                  <button
                    onClick={() => {
                      logout()
                      router.push('/login')
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-zinc-700"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          )}
        </aside>

        {/* Conteúdo */}
        <main className="w-full md:flex-1 border-x border-gray-200 relative z-0">{children}</main>

        {/* Direita */}
        <aside className="hidden lg:block lg:w-1/4 p-4">
          <h2 className="font-semibold">Trends</h2>
          {/* ... */}
        </aside>
      </div>

      {/* Navbar inferior para mobile */}
      {userId && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-700 flex justify-around items-center h-14 z-50">
          <Link href="/feed" className="flex flex-col items-center text-white hover:text-blue-400">
            <BiHomeAlt2 size={24} />
          </Link>
          <Link
            href={`/profile/${userId}`}
            className="flex flex-col items-center text-white hover:text-blue-400"
          >
            <IoMdContact size={24} />
          </Link>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center w-10 h-10 bg-white text-black rounded-full hover:bg-gray-200 transition"
          >
            +
          </button>
        </nav>
      )}
    </>
  )
}
