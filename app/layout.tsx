import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "@/components/providers"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: 'ShareUp - Plataforma de Troca de Habilidades',
    template: '%s | ShareUp'
  },
  description: 'Conecte-se com profissionais, compartilhe conhecimentos e desenvolva novas habilidades através de trocas colaborativas na maior plataforma de networking do Brasil.',
  keywords: ['troca de habilidades', 'networking', 'aprendizado colaborativo', 'profissionais', 'compartilhamento de conhecimento', 'educação', 'desenvolvimento profissional'],
  authors: [{ name: 'ShareUp Team', url: 'https://shareup.com.br' }],
  creator: 'ShareUp',
  publisher: 'ShareUp',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://shareup.com.br'),
  alternates: {
    canonical: '/',
    languages: {
      'pt-BR': '/pt-BR',
    },
  },
  openGraph: {
    title: 'ShareUp - Plataforma de Troca de Habilidades',
    description: 'Conecte-se com profissionais e desenvolva novas habilidades através de trocas colaborativas.',
    url: 'https://shareup.com.br',
    siteName: 'ShareUp',
    images: [
      {
        url: '/img/og-shareup.jpg',
        width: 1200,
        height: 630,
        alt: 'ShareUp - Conectando profissionais através do conhecimento',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShareUp - Plataforma de Troca de Habilidades',
    description: 'Conecte-se com profissionais e desenvolva novas habilidades.',
    creator: '@shareup_oficial',
    images: ['/img/twitter-shareup.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'education',
  classification: 'Professional Networking Platform',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#06b6d4' },
    { media: '(prefers-color-scheme: dark)', color: '#0891b2' },
  ],
  verification: {
    google: 'google-site-verification-token-here',
    yandex: 'yandex-verification-token-here',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#06b6d4' },
    ],
  },
}

// Viewport exportado separadamente
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers session={session}>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
