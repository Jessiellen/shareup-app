const API_BASE_URL = 'https://jsonplaceholder.typicode.com'

export interface ApiPost {
  id: number
  title: string
  body: string
  userId: number
}

export const api = {
  // GET - Buscar posts
  async getPosts(): Promise<ApiPost[]> {
    const response = await fetch(`${API_BASE_URL}/posts`)
    if (!response.ok) throw new Error('Failed to fetch posts')
    return response.json()
  },

  // POST - Criar post
  async createPost(post: Omit<ApiPost, 'id'>): Promise<ApiPost> {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    })
    if (!response.ok) throw new Error('Failed to create post')
    return response.json()
  },

  // PUT - Atualizar post
  async updatePost(id: number, post: Partial<ApiPost>): Promise<ApiPost> {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    })
    if (!response.ok) throw new Error('Failed to update post')
    return response.json()
  },

  // DELETE - Deletar post
  async deletePost(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete post')
  },

  // GET - Buscar post específico
  async getPost(id: number): Promise<ApiPost> {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`)
    if (!response.ok) throw new Error('Failed to fetch post')
    return response.json()
  }
}