"use client"

import React, { useState, useEffect, useMemo } from "react"
import Navigation from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Eye, Star, Clock, ArrowUpRight, Share2, BookmarkPlus, Search, Filter, Plus } from "lucide-react"
import PostCard from "@/components/post-card"
import CreatePostModal from "@/components/create-post-modal"
import PostDetailModal from "@/components/post-detail-modal"
import { usePosts as usePostsQuery, useIncrementViews } from "@/hooks/use-posts-query"
import { useFilters, getCategoryLabel } from "@/contexts/filter-context"
import type { Post } from "@/contexts/posts-context"

const categories = ["Todos", "Arte", "Tecnologia", "Música", "Idiomas", "Culinária", "Design", "Negócios"]

function PostsContent() {
  const { data: queryPosts, isLoading, error } = usePostsQuery()
  const incrementViewsMutation = useIncrementViews()
  const { filters, setCategory, setSearchQuery, setSortBy } = useFilters()
  
  // Estados locais para funcionalidades específicas da página
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 9

  // Use dados do Prisma via React Query
  const allPosts = queryPosts || []

  const filteredPosts = useMemo(() => {
    let filtered = allPosts

    // Filter by category
    if (filters.category !== "all") {
      // Mapear categorias do filtro global para as categorias dos posts
      const categoryMap: { [key: string]: string } = {
        "arte": "Arte",
        "tecnologia": "Tecnologia", 
        "musica": "Música",
        "idiomas": "Idiomas",
        "culinaria": "Culinária",
        "design": "Design",
        "negocios": "Negócios"
      }
      const mappedCategory = categoryMap[filters.category] || filters.category
      filtered = filtered.filter((post: Post) => post.category === mappedCategory)
    }

    // Filter by search query
    if (filters.searchQuery) {
      filtered = filtered.filter(
        (post: Post) =>
          post.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          post.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(filters.searchQuery.toLowerCase())),
      )
    }

    // Filter by skill level
    if (filters.skillLevel !== "all") {
      const skillLevelMap: { [key: string]: string } = {
        "iniciante": "Iniciante",
        "intermediario": "Intermediário",
        "avancado": "Avançado"
      }
      const mappedSkillLevel = skillLevelMap[filters.skillLevel] || filters.skillLevel
      filtered = filtered.filter((post: Post) => post.skillLevel === mappedSkillLevel)
    }

    // Sort posts
    switch (filters.sortBy) {
      case "popular":
        filtered.sort((a: Post, b: Post) => b.likes - a.likes)
        break
      case "rating":
        filtered.sort((a: Post, b: Post) => b.author.rating - a.author.rating)
        break
      case "recent":
      default:
        filtered.sort((a: Post, b: Post) => {
          // Convert to Date if it's a string
          const dateA = typeof a.createdAt === 'string' ? new Date(a.createdAt) : a.createdAt
          const dateB = typeof b.createdAt === 'string' ? new Date(b.createdAt) : b.createdAt
          return dateB.getTime() - dateA.getTime()
        })
        break
    }

    return filtered
  }, [allPosts, filters])

  const selectedCategoryCount = filteredPosts.length
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentPosts = filteredPosts.slice(startIndex, endIndex)

  const handlePostClick = (post: Post) => {
    incrementViewsMutation.mutate(post.id)
    setSelectedPost(post)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Reset page when filters change
  const handleCategoryChange = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      "Todos": "all",
      "Arte": "arte",
      "Tecnologia": "tecnologia",
      "Música": "musica",
      "Idiomas": "idiomas",
      "Culinária": "culinaria",
      "Design": "design",
      "Negócios": "negocios"
    }
    setCategory(categoryMap[category] as any || "all")
    setCurrentPage(1)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort as any)
    setCurrentPage(1)
  }

  // Função para mapear categoria atual do filtro global para exibição
  const getCurrentCategoryLabel = () => {
    if (filters.category === "all") return "TODOS"
    return getCategoryLabel(filters.category).toUpperCase()
  }

  return (
    <div className="min-h-screen bg-shareup-dark text-white">
      <Navigation />

      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {getCurrentCategoryLabel()}
              {filters.category !== "all" && (
                <span className="ml-3 text-lg font-normal text-slate-400">{selectedCategoryCount} COMPATÍVEL</span>
              )}
            </h1>
            <p className="text-slate-400">Descubra e compartilhe habilidades com a comunidade</p>
          </div>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-shareup-cyan hover:bg-shareup-cyan/90 text-shareup-dark font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Post
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar habilidades, tópicos ou tags..."
              value={filters.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 bg-shareup-dark/50 border-gray-700 text-white placeholder:text-gray-400"
            />
          </div>

          {/* Sort */}
          <Select value={filters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full lg:w-48 bg-shareup-dark/50 border-gray-700 text-white">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-shareup-dark border-gray-700">
              <SelectItem value="recent" className="text-white hover:bg-gray-700">
                Mais Recentes
              </SelectItem>
              <SelectItem value="popular" className="text-white hover:bg-gray-700">
                Mais Populares
              </SelectItem>
              <SelectItem value="rating" className="text-white hover:bg-gray-700">
                Melhor Avaliados
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => {
            const categoryMap: { [key: string]: string } = {
              "Todos": "all",
              "Arte": "arte",
              "Tecnologia": "tecnologia",
              "Música": "musica",
              "Idiomas": "idiomas",
              "Culinária": "culinaria",
              "Design": "design",
              "Negócios": "negocios"
            }
            const mappedCategory = categoryMap[category] || "all"
            const isActive = filters.category === mappedCategory
            
            return (
              <Badge
                key={category}
                variant={isActive ? "default" : "secondary"}
                className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-shareup-cyan text-shareup-dark hover:bg-shareup-cyan/90"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
                {category !== "Todos" && (
                  <span className="ml-2 text-xs">
                    {allPosts.filter((post: Post) => {
                      const postCategoryMap: { [key: string]: string } = {
                        "Arte": "Arte",
                        "Tecnologia": "Tecnologia", 
                        "Música": "Música",
                        "Idiomas": "Idiomas",
                        "Culinária": "Culinária",
                        "Design": "Design",
                        "Negócios": "Negócios"
                      }
                      return post.category === (postCategoryMap[category] || category)
                    }).length}
                  </span>
                )}
              </Badge>
            )
          })}
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-full">
                <Card className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 overflow-hidden animate-pulse">
                  <div className="h-52 bg-slate-700/50" />
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-slate-700/50 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <div className="h-4 bg-slate-700/50 rounded w-3/4" />
                        <div className="h-3 bg-slate-700/50 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-6 bg-slate-700/50 rounded w-full" />
                    <div className="h-4 bg-slate-700/50 rounded w-full" />
                    <div className="h-4 bg-slate-700/50 rounded w-2/3" />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-400 text-lg mb-4">Erro ao carregar posts</div>
            <p className="text-slate-400 mb-4">Não foi possível carregar os posts. Tente novamente.</p>
            <Button onClick={() => window.location.reload()}>
              Recarregar
            </Button>
          </div>
        ) : currentPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentPosts.map((post: Post) => (
                <div key={post.id} className="h-full">
                  <PostCard post={post} onClick={() => handlePostClick(post)} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Button 
                  variant="ghost" 
                  className="text-gray-400 hover:text-white"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  ← Anterior
                </Button>
                
                {/* Page Numbers */}
                {Array.from({ length: Math.min(totalPages, 11) }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "ghost"}
                    size="sm"
                    className={
                      page === currentPage
                        ? "bg-shareup-cyan text-shareup-dark hover:bg-shareup-cyan/90"
                        : "text-gray-400 hover:text-white"
                    }
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
                
                {totalPages > 11 && (
                  <>
                    <span className="text-slate-400">...</span>
                    <Button 
                      variant="ghost" 
                      className="text-gray-400 hover:text-white"
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
                
                <Button 
                  variant="ghost" 
                  className="text-gray-400 hover:text-white"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próximo →
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum post encontrado</h3>
            <p className="text-slate-400 mb-6">Tente ajustar sua pesquisa ou critérios de filtro</p>
            <Button
              onClick={() => {
                handleSearchChange("")
                handleCategoryChange("Todos")
              }}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Limpar Filtros
            </Button>
          </div>
        )}
      </main>

      {/* Modals */}
      <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      {selectedPost && (
        <PostDetailModal post={selectedPost} isOpen={!!selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  )
}

export default function PostsPage() {
  return <PostsContent />
}
