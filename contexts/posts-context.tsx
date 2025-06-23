"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { toast } from "@/hooks/use-toast"

export interface Post {
  id: string
  title: string
  description: string
  category: string
  author: {
    name: string
    avatar: string
    rating: number
  }
  image: string
  tags: string[]
  skillLevel: "Beginner" | "Intermediate" | "Advanced" | "Iniciante" | "Intermediário" | "Avançado"
  duration: string
  price?: number
  isExchange: boolean
  createdAt: Date
  likes: number
  views: number
  isLiked?: boolean
  isBookmarked?: boolean
}

interface PostsContextType {
  posts: Post[]
  likedPosts: string[]
  bookmarkedPosts: string[]
  toggleLike: (postId: string) => void
  toggleBookmark: (postId: string) => void
  sharePost: (post: Post) => void
  incrementViews: (postId: string) => void
  addPost: (post: Omit<Post, 'id' | 'likes' | 'views' | 'createdAt'>) => void
  updatePost: (postId: string, updates: Partial<Post>) => void
  deletePost: (postId: string) => void
  getPostById: (postId: string) => Post | undefined
}

const PostsContext = createContext<PostsContextType | undefined>(undefined)

export function PostsProvider({ children }: { children: ReactNode }) {
  // Mock data para inicializar
  const initialPosts: Post[] = [    {
      id: "1",
      title: "Fundamentos da Arte Digital",
      description:
        "Aprenda os fundamentos da arte digital, desde esboços até colorização. Perfeito para iniciantes que querem começar sua jornada artística.",
      category: "Arte",
      author: {
        name: "Maria Silva",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
        rating: 4.8,
      },
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop",
      tags: ["Arte Digital", "Photoshop", "Ilustração"],
      skillLevel: "Iniciante",
      duration: "2 horas",
      isExchange: true,
      createdAt: new Date("2024-01-15"),
      likes: 24,
      views: 156,
      isLiked: false,
      isBookmarked: false,
    },    {
      id: "2",
      title: "Masterclass de Desenvolvimento React",
      description:
        "Domine React.js do básico aos conceitos avançados. Construa aplicações do mundo real e aprenda as melhores práticas.",
      category: "Tecnologia",
      author: {
        name: "João Pedro",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        rating: 4.9,
      },
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
      tags: ["React", "JavaScript", "Frontend"],
      skillLevel: "Intermediário",
      duration: "4 horas",
      isExchange: true,
      createdAt: new Date("2024-01-14"),
      likes: 45,
      views: 289,
      isLiked: false,
      isBookmarked: false,
    },    {
      id: "3",
      title: "Aulas de Violão para Iniciantes",
      description: "Comece sua jornada musical com técnicas básicas de violão, acordes e músicas simples.",
      category: "Música",
      author: {
        name: "Carlos Santos",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        rating: 4.7,
      },
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
      tags: ["Violão", "Música", "Iniciante"],
      skillLevel: "Iniciante",
      duration: "1.5 horas",
      isExchange: true,
      createdAt: new Date("2024-01-13"),
      likes: 32,
      views: 198,
      isLiked: false,
      isBookmarked: false,
    },    {
      id: "4",
      title: "Composição Fotográfica",
      description: "Aprenda a arte da composição na fotografia. Entenda regra dos terços, linhas guias e muito mais.",
      category: "Arte",
      author: {
        name: "Ana Costa",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
        rating: 4.6,
      },
      image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=400&fit=crop",
      tags: ["Fotografia", "Composição", "Artes Visuais"],
      skillLevel: "Intermediário",
      duration: "3 horas",
      isExchange: true,
      createdAt: new Date("2024-01-12"),
      likes: 18,
      views: 134,
      isLiked: false,
      isBookmarked: false,
    },    {
      id: "5",
      title: "Prática de Conversação em Espanhol",
      description: "Melhore suas habilidades de conversação em espanhol através de prática e imersão cultural.",
      category: "Idiomas",
      author: {
        name: "Isabella Rodriguez",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b829?w=400&h=400&fit=crop&crop=face",
        rating: 4.9,
      },
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop",
      tags: ["Espanhol", "Conversação", "Idioma"],
      skillLevel: "Intermediário",
      duration: "1 hora",
      isExchange: true,
      createdAt: new Date("2024-01-11"),
      likes: 27,
      views: 167,
      isLiked: false,
      isBookmarked: false,
    },    {
      id: "6",
      title: "Culinária Italiana - Massas",
      description:
        "Domine a arte de fazer massas italianas autênticas do zero. Aprenda receitas tradicionais e técnicas.",
      category: "Culinária",
      author: {
        name: "Giuseppe Rossi",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
        rating: 4.8,
      },
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
      tags: ["Culinária", "Italiana", "Massas"],
      skillLevel: "Iniciante",
      duration: "2.5 horas",
      isExchange: true,
      createdAt: new Date("2024-01-10"),
      likes: 41,
      views: 223,
      isLiked: false,
      isBookmarked: false,
    },    {
      id: "7",
      title: "Bootcamp Python para Ciência de Dados",
      description: "Aprenda análise de dados, visualização e machine learning com Python. Perfeito para iniciantes em ciência de dados.",
      category: "Tecnologia",
      author: {
        name: "Dr. Juliana Santos",
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
        rating: 4.9,
      },
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      tags: ["Python", "Ciência de Dados", "Machine Learning"],
      skillLevel: "Iniciante",
      duration: "5 horas",
      isExchange: true,
      createdAt: new Date("2024-01-09"),
      likes: 67,
      views: 341,
      isLiked: false,
      isBookmarked: false,
    },    {
      id: "8",
      title: "Técnicas de Aquarela",
      description: "Explore técnicas avançadas de aquarela incluindo molhado sobre molhado, pincel seco e mistura de cores.",
      category: "Arte",
      author: {
        name: "Isabella Rodriguez",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b829?w=400&h=400&fit=crop&crop=face",
        rating: 4.7,
      },
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop",
      tags: ["Aquarela", "Pintura", "Técnicas Artísticas"],
      skillLevel: "Avançado",
      duration: "3 horas",
      isExchange: true,
      createdAt: new Date("2024-01-08"),
      likes: 52,
      views: 287,
      isLiked: false,
      isBookmarked: false,
    },    {
      id: "9",
      title: "Fundamentos de Plano de Negócios",
      description: "Aprenda a criar um plano de negócios abrangente do zero. Essencial para empreendedores.",
      category: "Negócios",
      author: {
        name: "Fernanda Lima",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
        rating: 4.8,
      },
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop",
      tags: ["Negócios", "Empreendedorismo", "Planejamento"],
      skillLevel: "Intermediário",
      duration: "4 horas",
      isExchange: true,
      createdAt: new Date("2024-01-07"),
      likes: 38,
      views: 195,
      isLiked: false,
      isBookmarked: false,
    },    {
      id: "10",
      title: "Princípios de Design UI/UX",
      description: "Domine os fundamentos de design de interface e experiência do usuário. Crie designs bonitos e funcionais.",
      category: "Design",
      author: {
        name: "Letícia Rocha",
        avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&crop=face",
        rating: 4.9,
      },
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
      tags: ["UI", "UX", "Design", "Figma"],
      skillLevel: "Intermediário",
      duration: "3.5 horas",
      isExchange: true,
      createdAt: new Date("2024-01-06"),
      likes: 73,
      views: 425,
      isLiked: false,
      isBookmarked: false,
    },    {
      id: "11",
      title: "Piano para Iniciantes",
      description: "Comece sua jornada musical com piano. Aprenda acordes básicos, escalas e músicas simples passo a passo.",
      category: "Música",
      author: {
        name: "Rafael Almeida",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
        rating: 4.6,
      },
      image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&h=400&fit=crop",
      tags: ["Piano", "Música", "Iniciante"],
      skillLevel: "Iniciante",
      duration: "2 horas",
      isExchange: true,
      createdAt: new Date("2024-01-05"),
      likes: 29,
      views: 176,
      isLiked: false,
      isBookmarked: false,
    },    {
      id: "12",
      title: "Prática de Conversação em Francês",
      description: "Melhore suas habilidades de conversação em francês através de sessões interativas e insights culturais.",
      category: "Idiomas",
      author: {
        name: "Sophie Dubois",
        avatar: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=400&fit=crop&crop=face",
        rating: 4.8,
      },
      image: "https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?w=600&h=400&fit=crop",
      tags: ["Francês", "Conversação", "Idioma"],
      skillLevel: "Intermediário",
      duration: "1.5 horas",
      isExchange: true,
      createdAt: new Date("2024-01-04"),
      likes: 44,
      views: 268,
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: "13",
      title: "Técnicas de Marketing Digital",
      description: "Aprenda estratégias eficazes de marketing digital, SEO, redes sociais e campanhas online para fazer seu negócio crescer.",
      category: "Negócios",
      author: {
        name: "Lucas Martins",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
        rating: 4.7,
      },
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      tags: ["Marketing", "SEO", "Redes Sociais"],
      skillLevel: "Intermediário",
      duration: "3 horas",
      isExchange: true,
      createdAt: new Date("2024-01-03"),
      likes: 56,
      views: 312,
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: "14",
      title: "Ilustração Digital com Procreate",
      description: "Domine o Procreate para criar ilustrações digitais incríveis. Do esboço inicial à arte finalizada.",
      category: "Arte",
      author: {
        name: "Camila Ribeiro",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
        rating: 4.9,
      },
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop",
      tags: ["Procreate", "Ilustração", "iPad"],
      skillLevel: "Intermediário",
      duration: "4 horas",
      isExchange: true,
      createdAt: new Date("2024-01-02"),
      likes: 82,
      views: 456,
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: "15",
      title: "Desenvolvimento de APIs com Node.js",
      description: "Construa APIs robustas e escaláveis usando Node.js, Express e MongoDB. Aprenda sobre autenticação e segurança.",
      category: "Tecnologia",
      author: {
        name: "Felipe Santos",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        rating: 4.8,
      },
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&h=400&fit=crop",
      tags: ["Node.js", "API", "Backend"],
      skillLevel: "Avançado",
      duration: "5 horas",
      isExchange: true,
      createdAt: new Date("2024-01-01"),
      likes: 91,
      views: 534,
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: "16",
      title: "Canto e Técnica Vocal",
      description: "Desenvolva sua voz com técnicas profissionais de canto. Respiração, afinação e interpretação musical.",
      category: "Música",
      author: {
        name: "Beatriz Oliveira",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b829?w=400&h=400&fit=crop&crop=face",
        rating: 4.6,
      },
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
      tags: ["Canto", "Voz", "Música"],
      skillLevel: "Iniciante",
      duration: "2.5 horas",
      isExchange: true,
      createdAt: new Date("2023-12-31"),
      likes: 37,
      views: 218,
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: "17",
      title: "Culinária Japonesa - Sushi",
      description: "Aprenda a fazer sushi autêntico em casa. Técnicas tradicionais, cortes de peixe e apresentação.",
      category: "Culinária",
      author: {
        name: "Hiroshi Tanaka",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        rating: 4.9,
      },
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&h=400&fit=crop",
      tags: ["Sushi", "Culinária Japonesa", "Peixe"],
      skillLevel: "Intermediário",
      duration: "3.5 horas",
      isExchange: true,
      createdAt: new Date("2023-12-30"),
      likes: 65,
      views: 389,
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: "18",
      title: "Design de Logotipos e Identidade Visual",
      description: "Crie logotipos memoráveis e sistemas de identidade visual completos. Do conceito à aplicação.",
      category: "Design",
      author: {
        name: "Amanda Costa",
        avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&crop=face",
        rating: 4.8,
      },
      image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop",
      tags: ["Logo", "Branding", "Identidade Visual"],
      skillLevel: "Intermediário",
      duration: "4.5 horas",
      isExchange: true,
      createdAt: new Date("2023-12-29"),
      likes: 78,
      views: 445,
      isLiked: false,
      isBookmarked: false,
    },
  ]

  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [likedPosts, setLikedPosts] = useState<string[]>([])
  const [bookmarkedPosts, setBookmarkedPosts] = useState<string[]>([])

  const toggleLike = useCallback((postId: string) => {
    const isLiked = likedPosts.includes(postId)
    
    if (isLiked) {
      setLikedPosts(prev => prev.filter(id => id !== postId))
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes - 1, isLiked: false }
          : post
      ))
      toast({
        title: "Like removido",
        description: "Você não curte mais este post",
      })
    } else {
      setLikedPosts(prev => [...prev, postId])
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1, isLiked: true }
          : post
      ))
      toast({
        title: "Post curtido!",
        description: "Você curtiu este post",
      })
    }
  }, [likedPosts])

  const toggleBookmark = useCallback((postId: string) => {
    const isBookmarked = bookmarkedPosts.includes(postId)
    
    if (isBookmarked) {
      setBookmarkedPosts(prev => prev.filter(id => id !== postId))
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, isBookmarked: false }
          : post
      ))
      toast({
        title: "Bookmark removido",
        description: "Post removido dos salvos",
      })
    } else {
      setBookmarkedPosts(prev => [...prev, postId])
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, isBookmarked: true }
          : post
      ))
      toast({
        title: "Post salvo!",
        description: "Post adicionado aos salvos",
      })
    }
  }, [bookmarkedPosts])

  const sharePost = useCallback(async (post: Post) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: `${window.location.origin}/posts/${post.id}`,
        })
        toast({
          title: "Post compartilhado!",
          description: "O post foi compartilhado com sucesso",
        })
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          fallbackShare(post)
        }
      }
    } else {
      fallbackShare(post)
    }
  }, [])

  const fallbackShare = useCallback((post: Post) => {
    const shareUrl = `${window.location.origin}/posts/${post.id}`
    const shareText = `Confira este post incrível: ${post.title}`
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
      toast({
        title: "Link copiado!",
        description: "O link do post foi copiado para a área de transferência",
      })
    } else {
      // Fallback para navegadores sem suporte ao clipboard
      const textArea = document.createElement('textarea')
      textArea.value = `${shareText}\n${shareUrl}`
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      
      toast({
        title: "Link copiado!",
        description: "O link do post foi copiado para a área de transferência",
      })
    }
  }, [])

  const incrementViews = useCallback((postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, views: post.views + 1 }
        : post
    ))
  }, [])

  const addPost = useCallback((newPost: Omit<Post, 'id' | 'likes' | 'views' | 'createdAt'>) => {
    const post: Post = {
      ...newPost,
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      likes: 0,
      views: 0,
      createdAt: new Date(),
      isLiked: false,
      isBookmarked: false,
    }
    
    setPosts(prev => [post, ...prev])
    
    toast({
      title: "Post criado!",
      description: "Seu post foi publicado com sucesso",
    })
    
    return post
  }, [])

  const updatePost = useCallback((postId: string, updates: Partial<Post>) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, ...updates }
        : post
    ))
    
    toast({
      title: "Post atualizado!",
      description: "As alterações foram salvas",
    })
  }, [])

  const deletePost = useCallback((postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId))
    setLikedPosts(prev => prev.filter(id => id !== postId))
    setBookmarkedPosts(prev => prev.filter(id => id !== postId))
    
    toast({
      title: "Post excluído",
      description: "O post foi removido com sucesso",
    })
  }, [])

  const getPostById = useCallback((postId: string): Post | undefined => {
    return posts.find(post => post.id === postId)
  }, [posts])

  return (
    <PostsContext.Provider
      value={{
        posts,
        likedPosts,
        bookmarkedPosts,
        toggleLike,
        toggleBookmark,
        sharePost,
        incrementViews,
        addPost,
        updatePost,
        deletePost,
        getPostById,
      }}
    >
      {children}
    </PostsContext.Provider>
  )
}

export function usePosts() {
  const context = useContext(PostsContext)
  if (context === undefined) {
    throw new Error("usePosts must be used within a PostsProvider")
  }
  return context
}
