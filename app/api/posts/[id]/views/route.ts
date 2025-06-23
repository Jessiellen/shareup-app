import { NextRequest, NextResponse } from 'next/server'
import { PostService } from '@/lib/post-service'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await PostService.incrementViews(params.id)
    return NextResponse.json({ message: 'Views incremented successfully' })
  } catch (error) {
    console.error('Error incrementing views:', error)
    return NextResponse.json(
      { error: 'Failed to increment views' },
      { status: 500 }
    )
  }
}
