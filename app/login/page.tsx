"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { Github, Chrome, Eye, EyeOff, MessageCircle } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login, loginWithProvider, isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirecionar se já estiver autenticado (usando ambos os sistemas)
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      console.log("👤 Usuário já autenticado via AuthContext, redirecionando para /home")
      router.push("/home")
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (status === "authenticated" && session) {
      console.log("👤 Usuário autenticado via NextAuth, redirecionando para /home")
      router.push("/home")
    }
  }, [status, session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("📝 Dados do formulário:", { email, password: "***" })
      await login(email, password)
    } catch (error) {
      console.error("❌ Erro no login:", error)
      // O erro já é tratado no auth-context
    } finally {
      setIsLoading(false)
    }
  }

  const handleProviderLogin = async (provider: "google" | "github" | "discord") => {
    try {
      await loginWithProvider(provider)
    } catch (error) {
      console.error("Provider login failed:", error)
      toast.error("Erro ao fazer login com " + provider)
    }
  }

  return (
    <div className="min-h-screen bg-shareup-dark text-white relative overflow-hidden flex items-center justify-center">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-shareup-cyan/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-shareup-lime/20 rounded-full blur-xl"></div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-3">
            <img 
              src="/img/logo.svg" 
              alt="ShareUp Logo" 
              className="w-45 h-45"
            />
          </div>
        </header>

        <div className="max-w-md mx-auto">
          {/* Illustration */}
          <div className="flex justify-center mb-8">
            {/* Login SVG illustration */}
            <img 
              src="/img/login.svg" 
              alt="Login Illustration" 
              className="w-40 h-40 object-contain"
            />
          </div>

          <h2 className="text-xl font-light mb-8 text-center text-shareup-cyan font-serif tracking-wide">Que bom te ver de novo!</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="sr-only">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-black border-0 rounded-lg h-12 px-4 placeholder:text-black"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="sr-only">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white text-black border-0 rounded-lg h-12 px-4 pr-12 placeholder:text-black"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-shareup-lime hover:bg-shareup-lime/90 text-shareup-dark font-semibold h-12 rounded-lg"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="px-4 text-gray-400 text-sm">ou</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              onClick={() => handleProviderLogin("google")}
              className="w-full bg-white hover:bg-gray-50 text-black font-medium h-12 rounded-lg flex items-center justify-center space-x-3"
            >
              <Chrome size={20} />
              <span>Continuar com Google</span>
            </Button>

            <Button
              type="button"
              onClick={() => handleProviderLogin("github")}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium h-12 rounded-lg flex items-center justify-center space-x-3"
            >
              <Github size={20} />
              <span>Continuar com GitHub</span>
            </Button>

            <Button
              type="button"
              onClick={() => handleProviderLogin("discord")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium h-12 rounded-lg flex items-center justify-center space-x-3"
            >
              <MessageCircle size={20} />
              <span>Continuar com Discord</span>
            </Button>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
            <h3 className="text-sm font-medium text-shareup-cyan mb-2">Credenciais para Teste:</h3>
            <div className="text-xs text-gray-300 space-y-1">
              <p><strong>Admin:</strong> admin@shareup.com / admin123</p>
              <p><strong>Usuário:</strong> user@shareup.com / user123</p>
              <p><em>Ou use qualquer email válido (ex: teste@gmail.com) com senha de 6+ caracteres</em></p>
            </div>
            
            {/* Botões de teste rápido */}
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail("admin@shareup.com")
                  setPassword("admin123")
                }}
                className="text-xs bg-shareup-cyan/20 hover:bg-shareup-cyan/30 text-shareup-cyan px-2 py-1 rounded"
              >
                Usar Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("teste@gmail.com")
                  setPassword("123456")
                }}
                className="text-xs bg-shareup-lime/20 hover:bg-shareup-lime/30 text-shareup-lime px-2 py-1 rounded"
              >
                Criar Novo
              </button>
            </div>
          </div>

          <div className="mt-6 text-center space-y-2">
            <p className="text-slate-400 text-sm">
              Não tem uma conta?{" "}
              <Link href="/register" className="text-shareup-cyan hover:underline">
                Cadastre-se
              </Link>
            </p>
            <Link href="/forgot-password" className="text-shareup-cyan hover:underline text-sm block">
              Esqueceu a senha?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
