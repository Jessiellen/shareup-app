"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Post } from '@/contexts/posts-context'
import { toast } from 'sonner'

// Query Keys - centralizadas para reutilização
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: string) => [...postKeys.lists(), { filters }] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
}

// Hook para buscar todos os posts
export function usePosts() {
  return useQuery({
    queryKey: postKeys.lists(),
    queryFn: async () => {
      try {
        const response = await fetch('/api/posts')
        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }
        const posts = await response.json()
        
        // Ensure createdAt is always a Date object
        return posts.map((post: any) => ({
          ...post,
          createdAt: new Date(post.createdAt)
        }))
      } catch (error) {
        console.error('Error fetching posts:', error)
        return []
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

// Hook para buscar um post específico
export function usePost(id: string) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: async () => {
      const response = await fetch(`/api/posts/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch post')
      }
      return response.json()
    },
    enabled: !!id, // Só executa se o ID existir
  })
}

// Hook para criar post
export function useCreatePost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.createPost,
    onSuccess: () => {
      // Invalidar cache para refetch automático
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
      toast.success('Post criado com sucesso!')
    },
    onError: (error) => {
      toast.error('Erro ao criar post')
      console.error('Erro ao criar post:', error)
    },
  })
}

// Hook para atualizar post
export function useUpdatePost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<any> }) =>
      api.updatePost(id, data),
    onSuccess: (updatedPost, { id }) => {
      // Atualizar cache específico do post
      queryClient.setQueryData(
        postKeys.detail(id.toString()),
        updatedPost
      )
      // Invalidar lista de posts
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
      toast.success('Post atualizado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao atualizar post')
    },
  })
}

// Hook para deletar post
export function useDeletePost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.deletePost,
    onSuccess: (_, deletedId) => {
      // Remover do cache
      queryClient.removeQueries({ queryKey: postKeys.detail(deletedId.toString()) })
      // Invalidar lista
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
      toast.success('Post deletado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao deletar post')
    },
  })
}

// Hook para curtir post (com optimistic update)
export function useLikePost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: string, isLiked: boolean }) => {
      // Simular API call para like/unlike
      await new Promise(resolve => setTimeout(resolve, 500))
      return { postId, isLiked }
    },
    onMutate: async ({ postId, isLiked }) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: postKeys.lists() })
      
      // Snapshot do estado anterior
      const previousPosts = queryClient.getQueryData(postKeys.lists())
      
      // Optimistic update - atualizar UI imediatamente
      queryClient.setQueryData(postKeys.lists(), (old: Post[] | undefined) =>
        old?.map(post =>
          post.id === postId 
            ? { 
                ...post, 
                isLiked, 
                likes: post.likes + (isLiked ? 1 : -1)
              }
            : post
        )
      )
      
      return { previousPosts }
    },
    onError: (error, variables, context) => {
      // Reverter mudanças em caso de erro
      if (context?.previousPosts) {
        queryClient.setQueryData(postKeys.lists(), context.previousPosts)
      }
      toast.error('Erro ao curtir post')
    },
    onSuccess: ({ isLiked }) => {
      toast.success(isLiked ? 'Post curtido!' : 'Curtida removida')
    },
  })
}

// Hook para marcar/desmarcar bookmark (com optimistic update)
export function useBookmarkPost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ postId, isBookmarked }: { postId: string, isBookmarked: boolean }) => {
      // Simular API call para bookmark/unbookmark
      await new Promise(resolve => setTimeout(resolve, 300))
      return { postId, isBookmarked }
    },
    onMutate: async ({ postId, isBookmarked }) => {
      await queryClient.cancelQueries({ queryKey: postKeys.lists() })
      
      const previousPosts = queryClient.getQueryData(postKeys.lists())
      
      // Optimistic update
      queryClient.setQueryData(postKeys.lists(), (old: Post[] | undefined) =>
        old?.map(post =>
          post.id === postId 
            ? { ...post, isBookmarked }
            : post
        )
      )
      
      return { previousPosts }
    },
    onError: (error, variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(postKeys.lists(), context.previousPosts)
      }
      toast.error('Erro ao marcar post')
    },
    onSuccess: ({ isBookmarked }) => {
      toast.success(isBookmarked ? 'Post salvo!' : 'Post removido dos salvos')
    },
  })
}

// Hook para incrementar views
export function useIncrementViews() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`/api/posts/${postId}/views`, {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('Failed to increment views')
      }
      return postId
    },
    onSuccess: (postId) => {
      // Atualizar views no cache
      queryClient.setQueryData(postKeys.lists(), (old: Post[] | undefined) =>
        old?.map(post =>
          post.id === postId 
            ? { ...post, views: post.views + 1 }
            : post
        )
      )
    },
    // Não mostrar toast para views (silencioso)
  })
}
