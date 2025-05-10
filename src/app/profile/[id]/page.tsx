'use client';

import { useParams } from 'next/navigation';  // Usando useParams de next/navigation
import ProfilePage from '@/components/ProfilePage';  // Assumindo que você tenha o componente ProfilePage

const UserProfilePage = () => {
  const { id } = useParams();  // Pega o parâmetro `id` diretamente da URL

  if (!id) {
    return <p>Carregando...</p>;
  }

  return <ProfilePage id={id as string} />;
};

export default UserProfilePage;
