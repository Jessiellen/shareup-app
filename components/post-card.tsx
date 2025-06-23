"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Eye, Star, Clock, ArrowUpRight, Share2, BookmarkPlus } from "lucide-react"
import { useLikePost, useBookmarkPost, useIncrementViews } from "@/hooks/use-posts-query"

interface Post {
  id: string
  title: string
  description: string
  category: string
  author: {
    name: string
    avatar: string
    rating: number
  }
  image: string
  tags: string[]
  skillLevel: "Beginner" | "Intermediate" | "Advanced" | "Iniciante" | "Intermediário" | "Avançado"
  duration: string
  price?: number
  isExchange: boolean
  createdAt: Date
  likes: number
  views: number
  isLiked?: boolean
  isBookmarked?: boolean
}

interface PostCardProps {
  post: Post
  onClick: () => void
}

export default function PostCard({ post, onClick }: PostCardProps) {
  const likeMutation = useLikePost()
  const bookmarkMutation = useBookmarkPost()
  const incrementViewsMutation = useIncrementViews()
  
  const isLiked = post.isLiked || false
  const isBookmarked = post.isBookmarked || false

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    likeMutation.mutate({ postId: post.id, isLiked: !isLiked })
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    bookmarkMutation.mutate({ postId: post.id, isBookmarked: !isBookmarked })
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: `${window.location.origin}/posts/${post.id}`,
        })
      } catch (error) {
        // Fallback to clipboard if sharing fails
        navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`)
      }
    } else {
      // Fallback to clipboard for browsers without native sharing
      navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`)
    }
  }

  const handleClick = () => {
    incrementViewsMutation.mutate(post.id)
    onClick()
  }

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
      case "Iniciante":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Intermediate":
      case "Intermediário":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Advanced":
      case "Avançado":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getSkillLevelText = (level: string) => {
    switch (level) {
      case "Beginner": return "Iniciante"
      case "Intermediate": return "Intermediário" 
      case "Advanced": return "Avançado"
      default: return level
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Arte": "bg-purple-500/20 text-purple-300 border-purple-500/30",
      "Tecnologia": "bg-blue-500/20 text-blue-300 border-blue-500/30",
      "Música": "bg-pink-500/20 text-pink-300 border-pink-500/30",
      "Idiomas": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      "Culinária": "bg-orange-500/20 text-orange-300 border-orange-500/30",
      "Design": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      "Negócios": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
    }
    return colors[category] || "bg-slate-500/20 text-slate-300 border-slate-500/30"
  }

  return (
    <Card
      className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-cyan-400/30 transition-all duration-300 cursor-pointer overflow-hidden hover:shadow-xl hover:shadow-cyan-400/10 hover:-translate-y-1 h-full flex flex-col"
      onClick={handleClick}
    >      {/* Image Section */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={`${getCategoryColor(post.category)} border font-medium text-xs px-2 py-1`}>
            {post.category}
          </Badge>
        </div>

        {/* Exchange Badge */}
        {post.isExchange && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-lime-500/20 text-lime-300 border-lime-500/30 border font-medium text-xs px-2 py-1">
              Troca
            </Badge>
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 bg-slate-900/60 hover:bg-slate-900/80 text-white border border-slate-600/50 hover:border-red-400/50 transition-all duration-200"
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 transition-colors ${isLiked ? "fill-red-400 text-red-400" : "text-slate-300 hover:text-red-400"}`} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 bg-slate-900/60 hover:bg-slate-900/80 text-white border border-slate-600/50 hover:border-cyan-400/50 transition-all duration-200"
            onClick={handleBookmark}
          >
            <BookmarkPlus className={`h-4 w-4 transition-colors ${isBookmarked ? "fill-cyan-400 text-cyan-400" : "text-slate-300 hover:text-cyan-400"}`} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 bg-slate-900/60 hover:bg-slate-900/80 text-white border border-slate-600/50 hover:border-slate-300/50 transition-all duration-200"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 text-slate-300 hover:text-white transition-colors" />
          </Button>
        </div>

        {/* Skill Level Badge - Bottom Left */}
        <div className="absolute bottom-3 left-3">
          <Badge className={`${getSkillLevelColor(post.skillLevel)} border text-xs px-2 py-1 font-medium`}>
            {getSkillLevelText(post.skillLevel)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
        {/* Author Section */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img 
              src={post.author.avatar} 
              alt={post.author.name} 
              className="w-8 h-8 rounded-full object-cover border-2 border-slate-600"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face';
              }}
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-800"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{post.author.name}</p>
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-xs text-slate-400">{post.author.rating}</span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">{post.views} visualizações</span>
            </div>
          </div>
        </div>        {/* Title */}
        <div>
          <h3 className="font-semibold text-white text-xl leading-tight line-clamp-2 group-hover:text-cyan-300 transition-colors duration-200">
            {post.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed flex-1">
          {post.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="text-xs bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:bg-slate-600/50 transition-colors px-2 py-1"
            >
              {tag}
            </Badge>
          ))}
          {post.tags.length > 3 && (
            <Badge 
              variant="secondary" 
              className="text-xs bg-slate-700/50 text-slate-300 border border-slate-600/50 px-2 py-1"
            >
              +{post.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3 text-slate-400">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{post.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-3 w-3" />
              <span>{post.likes}</span>
            </div>
          </div>
          <span className="text-slate-500">
            {post.createdAt.toLocaleDateString('pt-BR')}
          </span>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-slate-700/50 mt-auto">
          <Button 
            size="sm" 
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium h-9 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/25"
          >
            Ver Detalhes
            <ArrowUpRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
