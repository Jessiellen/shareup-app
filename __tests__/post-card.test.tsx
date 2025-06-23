import { render, screen } from '@testing-library/react'
import PostCard from '../components/post-card'

const mockPost = {
  id: '1',
  title: 'Learn Web Development',
  description: 'Complete guide to modern web development with React and Next.js',
  category: 'Programming',
  author: {
    name: 'Jane Smith',
    avatar: '/avatar.jpg',
    rating: 4.8
  },
  image: '/course-image.jpg',
  tags: ['React', 'Next.js', 'JavaScript'],
  skillLevel: 'Intermediate' as const,
  duration: '2 hours',
  price: 50,
  isExchange: false,
  createdAt: new Date('2024-01-15'),
  likes: 25,
  views: 150,
  isLiked: false,
  isBookmarked: false
}

// Mock the posts context
jest.mock('../contexts/posts-context', () => ({
  usePosts: () => ({
    toggleLike: jest.fn(),
    toggleBookmark: jest.fn(),
  }),
}))

describe('PostCard Component', () => {
  test('renders post card with basic information', () => {
    render(<PostCard post={mockPost} onClick={() => {}} />)
    
    expect(screen.getByText('Learn Web Development')).toBeInTheDocument()
    expect(screen.getByText('Complete guide to modern web development with React and Next.js')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Programming')).toBeInTheDocument()
  })

  test('displays tags correctly', () => {
    render(<PostCard post={mockPost} onClick={() => {}} />)
    
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Next.js')).toBeInTheDocument()
    expect(screen.getByText('JavaScript')).toBeInTheDocument()
  })

  test('shows action buttons', () => {
    render(<PostCard post={mockPost} onClick={() => {}} />)
    
    // Check for buttons (they might not have specific accessible names)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  test('displays author information', () => {
    render(<PostCard post={mockPost} onClick={() => {}} />)
    
    expect(screen.getByText('4.8')).toBeInTheDocument()
    expect(screen.getByAltText('Jane Smith')).toBeInTheDocument()
  })
})
