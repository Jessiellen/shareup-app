"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface User {
  id: string
  email: string
  name: string
  image?: string
  role?: string
  profession?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loginWithProvider: (provider: "google" | "github" | "discord") => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  // Sincronizar usuário com a sessão do NextAuth
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({
        id: (session.user as any).id || "unknown",
        email: session.user.email || "",
        name: session.user.name || "",
        image: session.user.image || undefined,
        role: (session.user as any).role || "user",
        profession: (session.user as any).profession || "",
      })
    } else if (status === "unauthenticated") {
      setUser(null)
    }
  }, [session, status])

  const login = async (email: string, password: string) => {
    try {
      console.log("🚀 Tentando login:", email)
      
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      console.log("📝 Resultado do signIn:", result)

      if (result?.error) {
        console.log("❌ Erro no login:", result.error)
        
        // Mensagens de erro mais específicas
        let errorMessage = "Credenciais inválidas"
        
        if (result.error === "CredentialsSignin") {
          errorMessage = "Email ou senha incorretos. Verifique suas credenciais."
        } else if (result.error === "Configuration") {
          errorMessage = "Erro de configuração. Tente novamente."
        }
        
        throw new Error(errorMessage)
      }

      if (result?.ok) {
        console.log("✅ Login bem-sucedido!")
        toast.success("Login realizado com sucesso!")
        router.push("/home")
      } else {
        throw new Error("Falha na autenticação")
      }
    } catch (error) {
      console.log("💥 Erro capturado:", error)
      const message = error instanceof Error ? error.message : "Erro no login"
      toast.error(message)
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      // Para registro, usamos o mesmo método de credentials
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error("Erro ao criar conta")
      }

      toast.success("Conta criada com sucesso!")
      router.push("/home")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro no registro")
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut({ redirect: false })
      setUser(null)
      toast.success("Logout realizado com sucesso!")
      router.push("/")
    } catch (error) {
      toast.error("Erro ao fazer logout")
    }
  }

  const loginWithProvider = async (provider: "google" | "github" | "discord") => {
    try {
      console.log(`🔗 Iniciando login com ${provider}`)
      const result = await signIn(provider, { 
        callbackUrl: "/home"
      })
      console.log(`🔗 Resultado do login com ${provider}:`, result)
    } catch (error) {
      console.error(`❌ Erro no login com ${provider}:`, error)
      toast.error(`Erro no login com ${provider}`)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: status === "loading",
        login,
        register,
        logout,
        loginWithProvider,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
