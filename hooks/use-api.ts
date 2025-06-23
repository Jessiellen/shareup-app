import { useState, useEffect } from 'react'
import { api, type ApiPost } from '@/lib/api'

export function useApiPosts() {
  const [posts, setPosts] = useState<ApiPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const data = await api.getPosts()
      setPosts(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createPost = async (postData: Omit<ApiPost, 'id'>) => {
    try {
      const newPost = await api.createPost(postData)
      setPosts(prev => [newPost, ...prev])
      return newPost
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post')
      throw err
    }
  }

  const updatePost = async (id: number, postData: Partial<ApiPost>) => {
    try {
      const updatedPost = await api.updatePost(id, postData)
      setPosts(prev => prev.map(post => post.id === id ? updatedPost : post))
      return updatedPost
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post')
      throw err
    }
  }

  const deletePost = async (id: number) => {
    try {
      await api.deletePost(id)
      setPosts(prev => prev.filter(post => post.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post')
      throw err
    }
  }

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
  }
}