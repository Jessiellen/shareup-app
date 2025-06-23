"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, Users } from "lucide-react"

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

interface SuccessStoryCardProps {
  story: SuccessStory
}

export default function SuccessStoryCard({ story }: SuccessStoryCardProps) {
  return (
    <div className="relative bg-gradient-to-r from-shareup-dark to-shareup-dark/90 rounded-2xl overflow-hidden min-h-[500px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={story.image || "/placeholder.svg"} alt={story.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-shareup-dark/95 via-shareup-dark/80 to-shareup-dark/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
        <div>
          {/* Category Badge */}
          <Badge className="bg-shareup-lime text-shareup-dark font-medium mb-4">{story.category}</Badge>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight text-white max-w-3xl">{story.title}</h2>

          {/* Description */}
          <p className="text-slate-300 mb-6 max-w-2xl leading-relaxed text-lg">{story.description}</p>

          {/* Results */}
          <div className="flex flex-wrap gap-2 mb-6">
            {story.results.map((result, index) => (
              <Badge key={index} variant="outline" className="border-shareup-cyan text-shareup-cyan">
                {result}
              </Badge>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between space-y-4 lg:space-y-0">
          {/* Author Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-shareup-cyan to-shareup-lime rounded-full flex items-center justify-center">
                <span className="text-shareup-dark font-bold text-lg">
                  {story.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <p className="font-semibold text-white">{story.author}</p>
                <p className="text-sm text-slate-400">
                  {story.beforeProfession} → {story.profession}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-slate-400">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{story.timeframe}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Parceiro: {story.exchangePartner.split(" - ")[0]}</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button className="bg-shareup-cyan hover:bg-shareup-cyan/90 text-shareup-dark font-semibold px-6 py-3 w-fit">
            Leia a História Completa
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-6 right-6 w-16 h-16 border-2 border-shareup-lime/30 rounded-full"></div>
      <div className="absolute bottom-6 right-12 w-8 h-8 bg-shareup-cyan/20 rounded-full"></div>
    </div>
  )
}
