"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, Users, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

interface SuccessStory {
  id: number
  title: string
  description: string
  image: string
  author: string
  profession: string
  beforeProfession: string
  exchangePartner: string
  timeframe: string
  category: string
  results: string[]
}

interface EnhancedBackgroundCardProps {
  story: SuccessStory
}

export default function EnhancedBackgroundCard({ story }: EnhancedBackgroundCardProps) {
  const router = useRouter()

  return (
    <div className="relative bg-shareup-dark rounded-2xl overflow-hidden min-h-[500px] group">
      {/* Enhanced Background with Overlay Effects */}
      <div className="absolute inset-0">
        <img
          src={story.image || "/placeholder.svg"}
          alt={story.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Multiple Gradient Overlays for Better Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-shareup-dark/95 via-shareup-dark/85 to-shareup-dark/70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-shareup-dark/90 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-shareup-dark/80"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 right-10 w-32 h-32 bg-shareup-cyan/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-shareup-lime/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-shareup-cyan/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Content with Enhanced Styling */}
      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
        <div>
          {/* Enhanced Category Badge */}
          <div className="flex items-center space-x-2 mb-4">
            <Badge className="bg-gradient-to-r from-shareup-lime to-shareup-lime/80 text-shareup-dark font-bold px-4 py-2 text-sm">
              <Sparkles className="h-3 w-3 mr-1" />
              {story.category}
            </Badge>
            <Badge variant="outline" className="border-shareup-cyan text-shareup-cyan bg-shareup-cyan/10">
              História de Sucesso
            </Badge>
          </div>

          {/* Enhanced Title with Better Typography */}
          <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight text-white max-w-3xl drop-shadow-lg">
            {story.title}
          </h2>

          {/* Enhanced Description */}
          <p className="text-slate-200 mb-6 max-w-2xl leading-relaxed text-lg font-medium drop-shadow-sm">
            {story.description}
          </p>

          {/* Enhanced Results with Icons */}
          <div className="flex flex-wrap gap-3 mb-6">
            {story.results.map((result, index) => (
              <Badge
                key={index}
                variant="outline"
                className="border-shareup-cyan/60 text-shareup-cyan bg-shareup-cyan/10 backdrop-blur-sm px-3 py-1 font-medium"
              >
                ✨ {result}
              </Badge>
            ))}
          </div>
        </div>

        {/* Enhanced Bottom Section */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between space-y-4 lg:space-y-0">
          {/* Enhanced Author Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-shareup-cyan via-shareup-cyan/80 to-shareup-lime rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg">
                <span className="text-shareup-dark font-black text-lg">
                  {story.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <p className="font-bold text-white text-lg drop-shadow-sm">{story.author}</p>
                <p className="text-sm text-shareup-lime font-semibold">
                  {story.beforeProfession} → {story.profession}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-slate-300">
              <div className="flex items-center space-x-2 bg-shareup-dark/40 backdrop-blur-sm rounded-full px-3 py-1">
                <Clock className="h-4 w-4 text-shareup-cyan" />
                <span className="font-medium">{story.timeframe}</span>
              </div>
              <div className="flex items-center space-x-2 bg-shareup-dark/40 backdrop-blur-sm rounded-full px-3 py-1">
                <Users className="h-4 w-4 text-shareup-lime" />
                <span className="font-medium">Parceiro: {story.exchangePartner.split(" - ")[0]}</span>
              </div>
            </div>
          </div>

          {/* Enhanced CTA Button */}
          <Button
            className="bg-gradient-to-r from-shareup-cyan to-shareup-cyan/90 hover:from-shareup-cyan/90 hover:to-shareup-cyan text-shareup-dark font-bold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={() => router.push(`/success-story/${story.id}`)}
          >
            Leia a História Completa
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Enhanced Decorative Elements */}
      <div className="absolute top-6 right-6 w-20 h-20 border-2 border-shareup-lime/40 rounded-full animate-spin-slow"></div>
      <div className="absolute bottom-6 right-12 w-10 h-10 bg-shareup-cyan/30 rounded-full animate-bounce"></div>
      <div className="absolute top-1/4 right-8 w-6 h-6 bg-shareup-lime/40 rounded-full animate-pulse"></div>
    </div>
  )
}
