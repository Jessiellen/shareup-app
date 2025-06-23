import type { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Posts - Descobrir Habilidades',
  description: 'Explore posts de profissionais oferecendo suas habilidades. Encontre cursos, workshops e oportunidades de troca de conhecimento em diversas áreas.',
  keywords: ['posts', 'habilidades', 'cursos', 'workshops', 'aprendizado', 'design', 'tecnologia', 'idiomas'],
  openGraph: {
    title: 'Posts - Descobrir Habilidades | ShareUp',
    description: 'Explore posts de profissionais oferecendo suas habilidades.',
    url: '/posts',
    images: [
      {
        url: '/img/og-posts.jpg',
        width: 1200,
        height: 630,
        alt: 'Posts de habilidades na ShareUp',
      },
    ],
  },
}

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}