'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/register/`, {
        username,
        email,
        password,
      });
      alert('Cadastro realizado com sucesso!');
      router.push('/login'); // ou direto para o feed, se quiser logar após o registro
    } catch (err) {
      alert('Erro ao registrar. Verifique os dados.');
    }
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <div className="w-full max-w-md mx-auto my-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold mb-6">Crie sua conta</h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Nome de usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 bg-black border border-gray-700 rounded-md placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-black border border-gray-700 rounded-md placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-black border border-gray-700 rounded-md placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="w-full px-4 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition duration-300 text-sm"
          >
            Criar conta
          </button>
        </form>

        <div className="text-sm text-gray-400 mt-6 text-center">
          Já tem uma conta?
          <button
            onClick={() => router.push('/login')}
            className="ml-1 text-blue-500 hover:underline cursor-pointer"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}
