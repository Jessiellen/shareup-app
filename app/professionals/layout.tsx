import type { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Profissionais - Conectar',
  description: 'Encontre profissionais qualificados em diversas áreas. Conecte-se, aprenda e compartilhe conhecimentos com especialistas.',
  keywords: ['profissionais', 'especialistas', 'networking', 'conexões', 'mentores'],
  openGraph: {
    title: 'Profissionais - Conectar | ShareUp',
    description: 'Encontre profissionais qualificados em diversas áreas.',
    url: '/professionals',
    images: [
      {
        url: '/img/og-professionals.jpg',
        width: 1200,
        height: 630,
        alt: 'Profissionais qualificados na ShareUp',
      },
    ],
  },
}

export default function ProfessionalsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}