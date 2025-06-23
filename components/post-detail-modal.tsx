"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, Eye, Star, Clock, Calendar, Share2, BookmarkPlus, X, Users, Award, CheckCircle } from "lucide-react"
import { useLikePost, useBookmarkPost } from "@/hooks/use-posts-query"
import { toast } from "@/hooks/use-toast"

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

interface PostDetailModalProps {
  post: Post
  isOpen: boolean
  onClose: () => void
}

export default function PostDetailModal({ post, isOpen, onClose }: PostDetailModalProps) {
  const likeMutation = useLikePost()
  const bookmarkMutation = useBookmarkPost()
  const isLiked = post.isLiked || false
  const isBookmarked = post.isBookmarked || false

  const handleLike = () => {
    likeMutation.mutate({ postId: post.id, isLiked: !isLiked })
  }

  const handleBookmark = () => {
    bookmarkMutation.mutate({ postId: post.id, isBookmarked: !isBookmarked })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: `${window.location.origin}/posts/${post.id}`,
        })
        toast({
          title: "Post compartilhado!",
          description: "O post foi compartilhado com sucesso",
        })
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          // Fallback to clipboard
          navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`)
          toast({
            title: "Link copiado!",
            description: "O link do post foi copiado para a área de transferência",
          })
        }
      }
    } else {
      // Fallback to clipboard for browsers without native sharing
      navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`)
      toast({
        title: "Link copiado!",
        description: "O link do post foi copiado para a área de transferência",
      })
    }
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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <DialogTitle className="sr-only">{post.title}</DialogTitle>
          {/* Header Image */}
          <div className="relative h-64 overflow-hidden">
            <img 
              src={post.image || "/placeholder.svg"} 
              alt={post.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex space-x-2">
              <Badge className="bg-cyan-400 text-slate-900 font-medium">{post.category}</Badge>
              {post.isExchange && <Badge className="bg-lime-400 text-slate-900 font-medium">Troca</Badge>}
            </div>

            {/* Quick Actions */}
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <Button size="sm" variant="ghost" className="bg-black/50 hover:bg-black/70 text-white" onClick={handleLike}>
                <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                {post.likes}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="bg-black/50 hover:bg-black/70 text-white"
                onClick={handleBookmark}
              >
                <BookmarkPlus className={`h-4 w-4 ${isBookmarked ? "fill-cyan-400 text-cyan-400" : ""}`} />
              </Button>
              <Button size="sm" variant="ghost" className="bg-black/50 hover:bg-black/70 text-white" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Title and Author */}
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-white">{post.title}</h1>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={post.author.avatar || "/placeholder.svg"}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                  />
                  <div>
                    <p className="font-medium text-white">{post.author.name}</p>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-slate-400">{post.author.rating} avaliação</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.views} visualizações</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{post.createdAt.toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-700" />

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-cyan-400">Sobre esta habilidade</h3>
              <p className="text-slate-300 leading-relaxed">{post.description}</p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-400">Duração</p>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-cyan-400" />
                  <span className="text-white">{post.duration}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-400">Nível de Habilidade</p>
                <Badge className={`border ${getSkillLevelColor(post.skillLevel)}`}>
                  {getSkillLevelText(post.skillLevel)}
                </Badge>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-400">Tipo</p>
                <span className="text-white">{post.isExchange ? "Troca de Habilidades" : "Ensino"}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-cyan-400">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-slate-700 text-slate-300">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="bg-slate-700" />

            {/* Informações Valiosas em vez de botões de contato */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-cyan-400">Informações do Instrutor</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Experiência */}
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="h-5 w-5 text-cyan-400" />
                    <h4 className="font-medium text-white">Experiência</h4>
                  </div>
                  <p className="text-sm text-slate-300">
                    Mais de 3 anos ensinando esta habilidade com {post.likes + 50}+ alunos satisfeitos
                  </p>
                </div>

                {/* Metodologia */}
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-5 w-5 text-cyan-400" />
                    <h4 className="font-medium text-white">Metodologia</h4>
                  </div>
                  <p className="text-sm text-slate-300">
                    Abordagem prática e personalizada para cada aluno
                  </p>
                </div>

                {/* Certificações */}
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-cyan-400" />
                    <h4 className="font-medium text-white">Certificações</h4>
                  </div>
                  <p className="text-sm text-slate-300">
                    Instrutor verificado e qualificado na plataforma
                  </p>
                </div>

                {/* Disponibilidade */}
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-5 w-5 text-cyan-400" />
                    <h4 className="font-medium text-white">Disponibilidade</h4>
                  </div>
                  <p className="text-sm text-slate-300">
                    Flexível, incluindo fins de semana e horários noturnos
                  </p>
                </div>
              </div>            </div>

            {/* O que você receberá */}
            <div className="bg-slate-700/30 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-white">O que você receberá:</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Experiência de aprendizado personalizada</li>
                <li>• Acesso direto ao instrutor</li>
                <li>• Horários flexíveis</li>
                <li>• Material de apoio incluso</li>
                <li>• Suporte contínuo durante o aprendizado</li>
                {post.isExchange && <li>• Oportunidade de ensinar suas próprias habilidades em troca</li>}
              </ul>
            </div>

            {/* Política de Satisfação */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h4 className="font-medium text-green-400 mb-2">Garantia de Satisfação</h4>
              <p className="text-sm text-slate-300">
                Se você não estiver satisfeito com a primeira sessão, oferecemos reembolso total ou troca de instrutor.
              </p>
            </div>
          </div>        </DialogContent>
      </Dialog>
    </>
  )
}
