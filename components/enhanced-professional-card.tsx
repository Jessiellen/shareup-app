"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, MessageCircle, Calendar, Eye, Heart, Zap } from "lucide-react"
import ChatModal from "./chat-modal"
import ScheduleModal from "./schedule-modal"

interface Professional {
  id: number
  name: string
  profession: string
  specialty: string
  avatar: string
  coverImage: string
  rating: number
  completedExchanges: number
  skills: string[]
  bio: string
  location: string
  isOnline: boolean
}

interface EnhancedProfessionalCardProps {
  professional: Professional
}

export default function EnhancedProfessionalCard({ professional }: EnhancedProfessionalCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)

  return (
    <Card className="bg-shareup-dark/60 backdrop-blur-sm border-gray-700 hover:border-shareup-cyan/60 transition-all duration-500 group overflow-hidden shadow-xl hover:shadow-2xl">
      {/* Enhanced Cover Image with Better Effects */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={professional.coverImage}
          alt={`${professional.name} work`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop`;
          }}
        />

        {/* Enhanced Overlay with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-shareup-dark/90 via-shareup-dark/40 to-transparent" />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-4 right-4 w-16 h-16 bg-shareup-cyan/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 bg-shareup-lime/20 rounded-full blur-lg animate-pulse delay-300"></div>
        </div>

        {/* Enhanced Online Status */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-1 bg-shareup-dark/70 backdrop-blur-sm rounded-full px-3 py-1">
            <div
              className={`w-3 h-3 rounded-full ${
                professional.isOnline ? "bg-shareup-lime animate-pulse" : "bg-gray-500"
              } border border-white/50`}
            ></div>
            <span className="text-xs text-white font-medium">{professional.isOnline ? "Online" : "Offline"}</span>
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="absolute top-4 left-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button
            size="sm"
            variant="ghost"
            className="h-9 w-9 p-0 bg-shareup-dark/70 hover:bg-shareup-dark/90 text-white rounded-full backdrop-blur-sm border border-white/20"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-9 w-9 p-0 bg-shareup-dark/70 hover:bg-shareup-dark/90 text-white rounded-full backdrop-blur-sm border border-white/20"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        {/* Avatar - posicionado abaixo dos botões de like */}
        <div className="absolute top-16 left-4 z-10">
          <img
            src={professional.avatar}
            alt={professional.name}
            className="w-16 h-16 rounded-full border-4 border-white bg-white shadow-lg object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face`;
            }}
          />
          {/* Status indicator */}
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
            professional.isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`} />
        </div>
      </div>

      <CardContent className="p-6 pt-10 space-y-4">
        {/* Enhanced Header Info */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-white text-xl group-hover:text-shareup-cyan transition-colors duration-300">
                {professional.name}
              </h3>
              <p className="text-shareup-cyan font-semibold text-lg">{professional.profession}</p>
              <p className="text-sm text-slate-400 font-medium">{professional.specialty}</p>
            </div>

            <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 rounded-full px-3 py-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-bold text-yellow-400">{professional.rating}</span>
            </div>
          </div>

          {/* Enhanced Location */}
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <MapPin className="h-4 w-4 text-shareup-lime" />
            <span className="font-medium">{professional.location}</span>
          </div>
        </div>

        {/* Enhanced Bio */}
        <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">{professional.bio}</p>

        {/* Enhanced Skills */}
        <div className="flex flex-wrap gap-2">
          {professional.skills.slice(0, 3).map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="text-xs bg-gradient-to-r from-slate-700 to-slate-600 text-slate-200 border border-slate-600 hover:border-shareup-cyan/50 transition-colors"
            >
              {skill}
            </Badge>
          ))}
          {professional.skills.length > 3 && (
            <Badge
              variant="secondary"
              className="text-xs bg-gradient-to-r from-shareup-cyan/20 to-shareup-lime/20 text-shareup-cyan border border-shareup-cyan/30"
            >
              +{professional.skills.length - 3} mais
            </Badge>
          )}
        </div>

        {/* Enhanced Stats */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-700/50">
          <div className="flex items-center space-x-4">
            <span className="font-semibold">
              <span className="text-shareup-cyan">{professional.completedExchanges}</span> trocas realizadas
            </span>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex space-x-3 pt-3">
          <Button
            size="sm"
            className="flex-1 bg-gradient-to-r from-shareup-cyan to-shareup-cyan/90 hover:from-shareup-cyan/90 hover:to-shareup-cyan text-shareup-dark font-bold rounded-full transition-all duration-300 transform hover:scale-105"
            onClick={() => setIsChatOpen(true)}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Conversar
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-2 border-shareup-lime text-shareup-lime hover:bg-shareup-lime hover:text-shareup-dark font-bold rounded-full transition-all duration-300 transform hover:scale-105"
            onClick={() => setIsScheduleOpen(true)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Agendar
          </Button>
        </div>
      </CardContent>
      {/* Modals */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        professional={{
          name: professional.name,
          avatar: professional.avatar,
          profession: professional.profession,
          isOnline: professional.isOnline,
        }}
      />

      <ScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        professional={{
          name: professional.name,
          avatar: professional.avatar,
          profession: professional.profession,
          specialty: professional.specialty,
        }}
      />
    </Card>
  )
}
