export type Tweet = {
  id: number
  user: number
  username: string
  content: string
  created_at: string
  likes_count?: number
  liked_by_me?: boolean
  comments_count?: number
}
