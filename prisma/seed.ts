import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Criar usuários de exemplo
  const users = [
    {
      id: 'user-1',
      email: 'maria.silva@email.com',
      name: 'Maria Silva',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',      bio: 'Artista digital apaixonada por ensinar.',
      location: 'São Paulo, SP',
      rating: 4.8,
      skills: JSON.stringify(['Arte Digital', 'Photoshop', 'Ilustração']),
      interests: JSON.stringify(['Design', 'Tecnologia']),
    },
    {
      id: 'user-2',
      email: 'joao.pedro@email.com',
      name: 'João Pedro',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',      bio: 'Desenvolvedor Full Stack com experiência em React.',
      location: 'Rio de Janeiro, RJ',
      rating: 4.9,
      skills: JSON.stringify(['React', 'JavaScript', 'Node.js']),
      interests: JSON.stringify(['Programação', 'Tecnologia']),
    },
    {
      id: 'user-3',
      email: 'carlos.santos@email.com',
      name: 'Carlos Santos',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',      bio: 'Músico e professor de violão há 10 anos.',
      location: 'Belo Horizonte, MG',
      rating: 4.7,
      skills: JSON.stringify(['Violão', 'Música', 'Teoria Musical']),
      interests: JSON.stringify(['Música', 'Artes']),
    },
  ]

  for (const userData of users) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    })
  }

  // Criar posts de exemplo
  const posts = [
    {
      id: 'post-1',
      title: 'Fundamentos da Arte Digital',
      description: 'Aprenda os fundamentos da arte digital, desde esboços até colorização. Perfeito para iniciantes que querem começar sua jornada artística.',      category: 'Arte',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop',
      tags: JSON.stringify(['Arte Digital', 'Photoshop', 'Ilustração']),
      skillLevel: 'Iniciante',
      duration: '2 horas',
      isExchange: true,
      likes: 24,
      views: 156,
      authorId: 'user-1',
    },
    {
      id: 'post-2',
      title: 'Masterclass de Desenvolvimento React',
      description: 'Domine React.js do básico aos conceitos avançados. Construa aplicações do mundo real e aprenda as melhores práticas.',      category: 'Tecnologia',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop',
      tags: JSON.stringify(['React', 'JavaScript', 'Frontend']),
      skillLevel: 'Intermediário',
      duration: '4 horas',
      isExchange: true,
      likes: 45,
      views: 289,
      authorId: 'user-2',
    },
    {
      id: 'post-3',
      title: 'Aulas de Violão para Iniciantes',
      description: 'Comece sua jornada musical com técnicas básicas de violão, acordes e músicas simples.',      category: 'Música',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop',
      tags: JSON.stringify(['Violão', 'Música', 'Iniciante']),
      skillLevel: 'Iniciante',
      duration: '1.5 horas',
      isExchange: true,
      likes: 32,
      views: 198,
      authorId: 'user-3',
    },
  ]

  for (const postData of posts) {
    await prisma.post.upsert({
      where: { id: postData.id },
      update: {},
      create: postData,
    })
  }

  console.log('✅ Seed data created successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
