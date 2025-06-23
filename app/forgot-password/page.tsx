"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simular envio de email de recuperação
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsEmailSent(true)
    } catch (error) {
      console.error("Password reset failed:", error)
      alert("Erro ao enviar email de recuperação. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isEmailSent) {
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

          <div className="max-w-md mx-auto text-center">
            {/* Success Illustration */}
            <div className="flex justify-center mb-6">
              <img 
                src="/img/login.svg" 
                alt="Email Sent Illustration" 
                className="w-40 h-40 object-contain"
              />
            </div>

            <h2 className="text-xl font-light mb-4 text-shareup-cyan font-serif tracking-wide">
              Email enviado com sucesso!
            </h2>
            
            <p className="text-slate-300 mb-6 text-sm leading-relaxed">
              Enviamos um link de recuperação para<br />
              <span className="text-shareup-cyan font-medium">{email}</span>
            </p>

            <p className="text-slate-400 mb-8 text-xs">
              Verifique sua caixa de entrada e pasta de spam.
            </p>

            <div className="space-y-8">
              <Button
                onClick={() => setIsEmailSent(false)}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 h-11 rounded-lg transition-all duration-200"
              >
                Tentar outro email
              </Button>
              
              <Link href="/login">
                <Button className="w-full bg-shareup-lime hover:bg-shareup-lime/90 text-shareup-dark font-semibold h-11 rounded-lg transition-all duration-200">
                  Voltar ao Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-shareup-dark text-white relative overflow-hidden">
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
          <div className="flex justify-center mb-6">
            <img 
              src="/img/login.svg" 
              alt="Forgot Password Illustration" 
              className="w-40 h-40 object-contain"
            />
          </div>

          <h2 className="text-xl font-light mb-4 text-center text-shareup-cyan font-serif tracking-wide">
            Esqueceu sua senha?
          </h2>
          
          <p className="text-slate-400 text-center mb-8">
            Digite seu email abaixo e enviaremos um link para redefinir sua senha.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="sr-only">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-black border-0 rounded-lg h-12 px-4 placeholder:text-gray-500"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-shareup-lime hover:bg-shareup-lime/90 text-shareup-dark font-semibold h-12 rounded-lg"
            >
              {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-slate-400 text-sm">
              Lembrou da senha?{" "}
              <Link href="/login" className="text-shareup-cyan hover:underline">
                Voltar ao login
              </Link>
            </p>
            <p className="text-slate-400 text-sm">
              Não tem uma conta?{" "}
              <Link href="/register" className="text-shareup-cyan hover:underline">
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
