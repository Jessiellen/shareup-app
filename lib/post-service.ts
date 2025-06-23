import { prisma } from '@/lib/prisma'
import { Post } from '@/contexts/posts-context'

export class PostService {
  static async getAllPosts(): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return posts.map(this.mapPrismaPostToPost)
  }

  static async getPostById(id: string): Promise<Post | null> {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
      },
    })

    return post ? this.mapPrismaPostToPost(post) : null
  }

  static async createPost(postData: Omit<Post, 'id' | 'likes' | 'views' | 'createdAt'>): Promise<Post> {
    const post = await prisma.post.create({
      data: {
        title: postData.title,
        description: postData.description,
        category: postData.category,
        image: postData.image,
        tags: JSON.stringify(postData.tags),
        skillLevel: postData.skillLevel,
        duration: postData.duration,
        isExchange: postData.isExchange,
        authorId: postData.author.name, // This should be the actual user ID
      },
      include: {
        author: true,
      },
    })

    return this.mapPrismaPostToPost(post)
  }

  static async updatePost(id: string, updates: Partial<Post>): Promise<Post | null> {
    const updateData: any = {}
    
    if (updates.title) updateData.title = updates.title
    if (updates.description) updateData.description = updates.description
    if (updates.category) updateData.category = updates.category
    if (updates.image) updateData.image = updates.image
    if (updates.tags) updateData.tags = JSON.stringify(updates.tags)
    if (updates.skillLevel) updateData.skillLevel = updates.skillLevel
    if (updates.duration) updateData.duration = updates.duration
    if (updates.isExchange !== undefined) updateData.isExchange = updates.isExchange
    if (updates.likes !== undefined) updateData.likes = updates.likes
    if (updates.views !== undefined) updateData.views = updates.views

    const post = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: true,
      },
    })

    return this.mapPrismaPostToPost(post)
  }

  static async deletePost(id: string): Promise<boolean> {
    try {
      await prisma.post.delete({
        where: { id },
      })
      return true
    } catch (error) {
      return false
    }
  }

  static async incrementViews(id: string): Promise<void> {
    await prisma.post.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    })
  }

  static async toggleLike(id: string, increment: boolean): Promise<void> {
    await prisma.post.update({
      where: { id },
      data: {
        likes: {
          increment: increment ? 1 : -1,
        },
      },
    })
  }

  static async getPostsByCategory(category: string): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      where: {
        category: category,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return posts.map(this.mapPrismaPostToPost)
  }

  static async searchPosts(query: string): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            tags: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return posts.map(this.mapPrismaPostToPost)
  }
  private static mapPrismaPostToPost(prismaPost: any): Post {
    return {
      id: prismaPost.id,
      title: prismaPost.title,
      description: prismaPost.description,
      category: prismaPost.category,
      image: prismaPost.image,
      tags: prismaPost.tags ? JSON.parse(prismaPost.tags) : [],
      skillLevel: prismaPost.skillLevel,
      duration: prismaPost.duration,
      isExchange: prismaPost.isExchange,
      likes: prismaPost.likes,
      views: prismaPost.views,
      createdAt: new Date(prismaPost.createdAt), // Ensure it's always a Date object
      author: {
        name: prismaPost.author.name || '',
        avatar: prismaPost.author.avatar || '',
        rating: prismaPost.author.rating,
      },
    }
  }
}
