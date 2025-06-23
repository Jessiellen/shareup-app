import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addMorePosts() {
  // Adicionar mais posts para demonstrar as categorias
  const additionalPosts = [
    {
      id: 'post-4',
      title: 'Composição Fotográfica Avançada',
      description: 'Aprenda técnicas avançadas de composição fotográfica, incluindo regra dos terços, linhas guia e enquadramento.',
      category: 'Arte',
      image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=400&fit=crop',
      tags: JSON.stringify(['Fotografia', 'Composição', 'Arte Visual']),
      skillLevel: 'Intermediário',
      duration: '3 horas',
      isExchange: true,
      likes: 18,
      views: 134,
      authorId: 'user-1',
    },
    {
      id: 'post-5',
      title: 'Culinária Italiana - Massas Artesanais',
      description: 'Domine a arte de fazer massas italianas do zero. Receitas tradicionais e técnicas profissionais.',
      category: 'Culinária',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
      tags: JSON.stringify(['Culinária', 'Italiana', 'Massas']),
      skillLevel: 'Iniciante',
      duration: '2.5 horas',
      isExchange: true,
      likes: 41,
      views: 223,
      authorId: 'user-2',
    },
    {
      id: 'post-6',
      title: 'Design UI/UX Moderno',
      description: 'Aprenda os princípios fundamentais do design de interface e experiência do usuário.',
      category: 'Design',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
      tags: JSON.stringify(['UI', 'UX', 'Design', 'Figma']),
      skillLevel: 'Intermediário',
      duration: '3.5 horas',
      isExchange: true,
      likes: 73,
      views: 425,
      authorId: 'user-3',
    },
    {
      id: 'post-7',
      title: 'Estratégias de Negócios Digitais',
      description: 'Desenvolva estratégias eficazes para negócios no ambiente digital. Marketing e vendas online.',
      category: 'Negócios',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
      tags: JSON.stringify(['Negócios', 'Marketing Digital', 'Estratégia']),
      skillLevel: 'Avançado',
      duration: '4 horas',
      isExchange: true,
      likes: 56,
      views: 312,
      authorId: 'user-1',
    },
    {
      id: 'post-8',
      title: 'Francês Conversacional',
      description: 'Melhore suas habilidades de conversação em francês com práticas interativas e situações reais.',
      category: 'Idiomas',
      image: 'https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?w=600&h=400&fit=crop',
      tags: JSON.stringify(['Francês', 'Conversação', 'Idiomas']),
      skillLevel: 'Intermediário',
      duration: '1.5 horas',
      isExchange: true,
      likes: 44,
      views: 268,
      authorId: 'user-2',
    },
    {
      id: 'post-9',
      title: 'Piano Clássico para Iniciantes',
      description: 'Comece sua jornada musical com piano clássico. Aprenda técnicas básicas e peças famosas.',
      category: 'Música',
      image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&h=400&fit=crop',
      tags: JSON.stringify(['Piano', 'Música Clássica', 'Iniciante']),
      skillLevel: 'Iniciante',
      duration: '2 horas',
      isExchange: true,
      likes: 29,
      views: 176,
      authorId: 'user-3',
    }
  ]

  for (const postData of additionalPosts) {
    await prisma.post.upsert({
      where: { id: postData.id },
      update: {},
      create: postData,
    })
  }

  console.log('✅ Additional posts added successfully!')
}

addMorePosts()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
