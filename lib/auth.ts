import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import DiscordProvider from "next-auth/providers/discord"

// Interface para o usuário personalizada
export interface CustomUser {
  id: string
  email: string
  name: string
  image?: string
  role?: string
  profession?: string
}

// Simulação de banco de dados (em produção, usar Prisma/Database real)
const users: CustomUser[] = [
  {
    id: "1",
    email: "admin@shareup.com",
    name: "Admin ShareUp",
    role: "admin",
    profession: "Administrator"
  },
  {
    id: "2", 
    email: "user@shareup.com",
    name: "Usuário Demo",
    role: "user",
    profession: "Designer"
  }
]

export const authOptions: NextAuthOptions = {
  providers: [
    // Credenciais locais
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Buscar usuário na "base de dados"
        const user = users.find(u => u.email === credentials.email)
        
        if (user) {
          // Verificar senha (em produção, usar hash)
          const validPasswords = ["admin123", "user123"]
          if (validPasswords.includes(credentials.password) || credentials.password.length >= 6) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
            }
          }
        } else {
          // Permitir qualquer email válido com senha >= 6 caracteres
          if (credentials.email.includes("@") && credentials.password.length >= 6) {
            return {
              id: Date.now().toString(),
              email: credentials.email,
              name: credentials.email.split("@")[0],
              image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`,
            }
          }
        }

        return null
      }
    }),

    // Google OAuth
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        }
      })
    ] : []),

    // GitHub OAuth
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET ? [
      GitHubProvider({
        clientId: process.env.GITHUB_ID!,
        clientSecret: process.env.GITHUB_SECRET!,
      })
    ] : []),

    // Discord OAuth
    ...(process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET ? [
      DiscordProvider({
        clientId: process.env.DISCORD_CLIENT_ID!,
        clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      })
    ] : []),
  ],

  pages: {
    signIn: "/login",
    error: "/login", // Redirecionar erros para login
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as any).role || "user"
        token.profession = (user as any).profession
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub ?? undefined;
        (session.user as any).role = token.role;
        (session.user as any).profession = token.profession;
      }
      return session;
    },    async signIn({ user, account, profile }) {
      console.log("🔐 SignIn callback:", { 
        provider: account?.provider, 
        userEmail: user?.email,
        accountId: account?.providerAccountId 
      })
      // Permitir todos os sign-ins válidos
      return true
    },    async redirect({ url, baseUrl }) {
      console.log("🔄 Redirect callback:", { url, baseUrl })
      
      // Se estamos voltando de um provider OAuth e não há URL específica, ir para home
      if (url === baseUrl || url === `${baseUrl}/`) {
        console.log("🔄 Redirecionamento OAuth padrão para /home")
        return `${baseUrl}/home`
      }
      
      // Se é uma URL relativa, combinar com baseUrl
      if (url.startsWith("/")) {
        const fullUrl = `${baseUrl}${url}`
        console.log("🔄 Redirecionando para URL relativa:", fullUrl)
        return fullUrl
      }
      
      // Se a URL é do mesmo domínio, usar ela
      if (new URL(url).origin === baseUrl) {
        console.log("🔄 URL do mesmo domínio:", url)
        return url
      }
      
      // Caso padrão: redirecionar para home
      console.log("🔄 Redirecionamento padrão para /home")
      return `${baseUrl}/home`
    }
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },

  secret: process.env.AUTH_SECRET,

  debug: process.env.NODE_ENV === "development",
}
