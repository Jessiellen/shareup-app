import { NextRequest, NextResponse } from 'next/server'
import { PostService } from '@/lib/post-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let posts
    if (category && category !== 'all') {
      posts = await PostService.getPostsByCategory(category)
    } else if (search) {
      posts = await PostService.searchPosts(search)
    } else {
      posts = await PostService.getAllPosts()
    }

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const postData = await request.json()
    const post = await PostService.createPost(postData)
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
