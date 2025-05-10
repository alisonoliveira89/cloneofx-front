'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from "@/components/MainLayout";

interface Tweet {
  id: string;
  content: string;
  created_at: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  tweets: Tweet[];
}

interface ProfilePageProps {
  id: string;
}

const ProfilePage = ({ id }: ProfilePageProps) => {
  const { token, userId, isLoading  } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Espera carregar

    if (!token) {
      router.push('/login');
      return;
    }

    if (!id) return;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        setError("Erro ao carregar perfil");
        console.error(err);
      }
    };

    const checkFollowing = async () => {
        if (!token) return;
      
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}/is_following/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsFollowing(response.data.is_following);
        } catch (err) {
          console.error("Erro ao verificar seguimento", err);
        }
    };
      

    fetchUserData();
    checkFollowing();
  }, [id, token, userId, router, isLoading]);

  const handleFollowToggle = async () => {
    if (!token) return;
  
    setLoading(true);
    try {
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/${endpoint}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (endpoint === 'follow') {
        // Se a resposta indicar que já segue, mesmo com erro 200
        if (response.data.detail?.includes('já está seguindo')) {
          setIsFollowing(true);
        } else {
          setIsFollowing(true);
        }
      } else {
        setIsFollowing(false);
      }
    } catch (err: any) {
      // Se mesmo no catch o retorno indicar que já segue
      if (
        err?.response?.data?.detail &&
        err.response.data.detail.includes('já está seguindo')
      ) {
        setIsFollowing(true);
      } else {
        console.error(`Erro ao ${isFollowing ? 'deixar de seguir' : 'seguir'} o usuário`, err);
      }
    } finally {
      setLoading(false);
    }
  };
  

  if (error) return <MainLayout><p className="text-red-500 p-4">{error}</p></MainLayout>;
  if (!user) return <MainLayout><p className="text-gray-500 p-4">Carregando perfil...</p></MainLayout>;

  return (
    <MainLayout>
      <div className="p-4">
        {/* Perfil do usuário com avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-gray-300" />
          <div>
            <h1 className="text-xl font-bold">{user.username}</h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
          {user.id !== userId && (
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
          {user.tweets.length > 0 ? (
            user.tweets.map((tweet) => (
              <div key={tweet.id} className="p-4 border border-gray-200 rounded-lg shadow-sm">
                <p className="text-gray-800">{tweet.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(tweet.created_at).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">Este usuário ainda não tweetou.</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
