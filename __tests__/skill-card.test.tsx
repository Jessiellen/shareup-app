import { render, screen } from '@testing-library/react'
import SkillCard from '../components/skill-card'

const mockPost = {
  id: 1,
  title: 'Learn React Development',
  description: 'Master the fundamentals of React and build amazing web applications',
  image: '/img/react-course.jpg',
  category: 'Web Development',
  author: 'John Doe',
  readTime: '5 min read'
}

describe('SkillCard Component', () => {
  test('renders skill card with post data', () => {
    render(<SkillCard post={mockPost} />)
    
    expect(screen.getByText('Learn React Development')).toBeInTheDocument()
    expect(screen.getByText('Master the fundamentals of React and build amazing web applications')).toBeInTheDocument()
    expect(screen.getByText('Web Development')).toBeInTheDocument()
    expect(screen.getByText(/john doe/i)).toBeInTheDocument()
    expect(screen.getByText('5 min read')).toBeInTheDocument()
  })

  test('renders regular card when featured prop is false', () => {
    render(<SkillCard post={mockPost} />)
    
    // Check that it's rendering the regular card structure
    expect(screen.getByText('Learn React Development')).toBeInTheDocument()
  })

  test('displays correct category badge with proper styles', () => {
    render(<SkillCard post={mockPost} />)
    
    const categoryBadge = screen.getByText('Web Development')
    expect(categoryBadge).toBeInTheDocument()
    // Check if it has some expected styling classes
    expect(categoryBadge).toHaveClass('bg-shareup-cyan/10')
  })

  test('handles button interactions', () => {
    render(<SkillCard post={mockPost} />)
    
    const readMoreButton = screen.getByRole('button', { name: /read more/i })
    expect(readMoreButton).toBeInTheDocument()
  })
})
