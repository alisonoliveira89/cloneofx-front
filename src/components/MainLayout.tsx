'use client';

import Link from "next/link";
import { useAuth } from '@/contexts/AuthContext'; // importe o contexto

import { BiHomeAlt2 } from "react-icons/bi";
import { IoMdContact } from "react-icons/io";


export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth(); // pega o ID do usuário logado

  return (
    <div className="min-h-screen flex max-w-6xl mx-auto">
      {/* Esquerda */}
      <aside className="hidden md:block w-1/4 border-r border-gray-200 p-4">
      <div className="mb-4">
        <img
          src="/icons/x-logo.svg"
          alt="Logo X"
          className="w-8 h-8 object-contain"
        />
      </div>
      <nav className="mt-4 space-y-2 text-white">
        <Link href="/feed" className="flex items-center gap-2 hover:underline">
          <BiHomeAlt2 size={20} />
          Feed
        </Link>
        {userId && (
          <Link href={`/profile/${userId}`} className="flex items-center gap-2 hover:underline">
            <IoMdContact size={20} />
            Perfil
          </Link>
        )}
      </nav>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 border-x border-gray-200">
        {children}
      </main>

      {/* Direita */}
      <aside className="hidden lg:block w-1/4 p-4">
        <h2 className="font-semibold">Trends</h2>
        {/* ... */}
      </aside>
    </div>
  );
}
