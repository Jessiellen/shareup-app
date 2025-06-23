"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleStart = () => {
    setIsLoading(true)
    setTimeout(() => {
      router.push("/login")
    }, 1000)
  }

  return (
    <div className="h-screen bg-shareup-dark text-white overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-16 left-8 w-16 h-16 bg-shareup-cyan/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-16 right-8 w-20 h-20 bg-shareup-lime/20 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 right-16 w-12 h-12 bg-shareup-cyan/30 rounded-full blur-lg"></div>

      <div className="container mx-auto px-4 py-4 relative z-10 h-full flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <img 
              src="/img/logo.svg" 
              alt="ShareUp Logo" 
              className="w-45 h-45"
            />
          </div>
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 items-center flex-1">
          {/* Left Content */}
          <div className="space-y-12">
            <div className="space-y-3">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                <span className="text-[#D0E1A3] block mb-3">MAKE YOUR SKILLS</span>
                <span className="text-[#53C3EC] block mb-3">MORE POWERFUL</span>
                <span className="text-[#D0E1A3] block">WITH US!</span>
              </h1>
            </div>

            <Button
              onClick={handleStart}
              disabled={isLoading}
              className="bg-transparent border-2 border-shareup-cyan text-shareup-cyan hover:bg-shareup-cyan hover:text-shareup-dark px-6 py-2 text-base font-semibold transition-all duration-300"
            >
              {isLoading ? "LOADING..." : "START"}
            </Button>
          </div>

          {/* Right Illustration */}
          <div className="relative flex justify-center items-center h-full max-h-[60vh]">
            <div className="relative w-full h-full">
              {/* Main character illustration */}
              <div className="w-full h-full border-2 border-shareup-cyan/60 rounded-lg p-4 bg-shareup-dark/60 backdrop-blur-sm">
                <div className="w-full h-full flex items-center justify-center relative">
                  {/* SVG principal */}
                  <img 
                    src="/img/initial.svg" 
                    alt="ShareUp Illustration" 
                    className="w-[150%] h-[150%] object-contain z-10"
                  />
                  
                  {/* Floating skill icons menores */}
                  <div className="absolute -top-4 -left-6 w-4 h-4 bg-shareup-lime rounded-full animate-bounce"></div>
                  <div className="absolute -top-6 right-6 w-3 h-3 bg-shareup-cyan rounded-full animate-bounce delay-100"></div>
                  <div className="absolute -right-6 top-12 w-4 h-4 bg-shareup-lime rounded-full animate-bounce delay-200"></div>
                  <div className="absolute -left-4 top-16 w-3 h-3 bg-shareup-cyan rounded-full animate-bounce delay-300"></div>
                  <div className="absolute -bottom-4 -right-4 w-4 h-4 bg-shareup-lime rounded-full animate-bounce delay-400"></div>
                  <div className="absolute -bottom-6 left-6 w-3 h-3 bg-shareup-cyan rounded-full animate-bounce delay-500"></div>
                </div>
              </div>

              {/* Decorative elements menores */}
              <div className="absolute -top-3 -right-3 w-6 h-6 border-2 border-shareup-lime rotate-45"></div>
              <div className="absolute -bottom-3 -left-3 w-5 h-5 bg-shareup-cyan rounded-full"></div>
              <div className="absolute top-1/4 -left-6 w-4 h-4 border-2 border-shareup-lime rotate-45"></div>
              <div className="absolute bottom-1/4 -right-6 w-4 h-4 bg-shareup-cyan rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-slate-400 text-xs py-2">
          ShareUp © 2024. All rights reserved.
        </footer>
      </div>
    </div>
  )
}
