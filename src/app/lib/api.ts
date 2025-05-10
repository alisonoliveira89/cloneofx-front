const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getTweets() {
  const res = await fetch(`${API_URL}/tweets/`);
  return res.json();
}
