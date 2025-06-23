"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { Github, Chrome, Eye, EyeOff, User, Mail, Lock } from "lucide-react"
import { toast } from "sonner"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register, loginWithProvider } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem!")
      return
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres!")
      return
    }

    setIsLoading(true)

    try {
      await register(name, email, password)
      toast.success("Conta criada com sucesso!")
      router.push("/home")
    } catch (error) {
      console.error("Registration failed:", error)
      toast.error("Erro ao criar conta. Tente novamente.")
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
    <div className="min-h-screen bg-shareup-dark text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-shareup-cyan/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-shareup-lime/20 rounded-full blur-xl"></div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-center mb-6">
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
          <div className="flex justify-center mb-6">
            {/* Register SVG illustration */}
            <img 
              src="/img/login.svg" 
              alt="Register Illustration" 
              className="w-40 h-40 object-contain"
            />
          </div>

          <h2 className="text-xl font-light mb-6 text-center text-shareup-cyan font-serif tracking-wide">Junte-se à nossa comunidade!</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="sr-only">
                Nome
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white text-black border-0 rounded-lg h-12 px-4 placeholder:text-gray-500"
                required
              />
            </div>

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
                className="bg-white text-black border-0 rounded-lg h-12 px-4 placeholder:text-gray-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="sr-only">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white text-black border-0 rounded-lg h-12 px-4 placeholder:text-gray-500"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="sr-only">
                Confirmar Senha
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirmar senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white text-black border-0 rounded-lg h-12 px-4 placeholder:text-gray-500"
                required
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-shareup-lime hover:bg-shareup-lime/90 text-shareup-dark font-semibold h-12 rounded-lg mt-6"
            >
              {isLoading ? "Criando conta..." : "Criar Conta"}
            </Button>
          </form>

          <div className="mt-4 text-center space-y-2">
            <p className="text-slate-400 text-sm">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-shareup-cyan hover:underline">
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
