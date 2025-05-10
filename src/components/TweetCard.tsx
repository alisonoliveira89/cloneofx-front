import Link from 'next/link';

type TweetProps = {
  user: string; // ID do usuário
  username: string;
  content: string;
  created_at: string
};

export default function TweetCard({ user, username, content, created_at }: TweetProps) {
  return (
    <div className="border-b border-zinc-700 p-4 hover:bg-zinc-800 transition-colors">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-zinc-600" />
        <div>
          <Link href={`/profile/${user}`}>
            <div className="font-semibold text-white hover:underline cursor-pointer">
              @{username}
            </div>
          </Link>
          <div className="text-gray-400 text-sm">
            {new Date(created_at).toLocaleString()}
          </div>
          <p className="mt-2 text-gray-200">{content}</p>
        </div>
      </div>
    </div>
  );
}
