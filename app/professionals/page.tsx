"use client"

import { useState, useMemo } from "react"
import Navigation from "@/components/navigation"
import EnhancedProfessionalCard from "@/components/enhanced-professional-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Users, MapPin, TrendingUp, Grid, List } from "lucide-react"
import { useProfessionals } from "@/hooks/use-professionals-query"
import { Card, CardContent } from "@/components/ui/card"

const professionals = [
  {
    id: 1,
    name: "Isabella Rodriguez",
    profession: "Artista & Pintora",
    specialty: "Pintura em Aquarela",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=400&fit=crop",
    rating: 4.9,
    completedExchanges: 23,
    skills: ["Aquarela", "Pintura", "Arte Digital"],
    bio: "Especialista em aquarela com 10 anos de experiência. Ensino técnicas tradicionais e modernas.",
    location: "Lisboa, Portugal",
    isOnline: true,
    experience: "10 anos",
    category: "Arte",
  },
  {
    id: 2,
    name: "Gabriela Martins",
    profession: "Professora de Ballet",
    specialty: "Ballet Clássico & Contemporâneo",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=400&fit=crop",
    rating: 4.8,
    completedExchanges: 31,
    skills: ["Ballet Clássico", "Dança Contemporânea", "Coreografia"],
    bio: "Formada pela Escola de Ballet do Teatro Municipal. 15 anos ensinando ballet para todas as idades.",
    location: "Porto, Portugal",
    isOnline: false,
    experience: "15 anos",
    category: "Dança",
  },
  {
    id: 3,
    name: "Roberto Silva",
    profession: "Engenheiro Civil",
    specialty: "Projetos Estruturais",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=400&fit=crop",
    rating: 4.7,
    completedExchanges: 18,
    skills: ["AutoCAD", "Projetos Estruturais", "Gestão de Obras"],
    bio: "Engenheiro civil com experiência em grandes projetos. Especialista em estruturas e fundações.",
    location: "Braga, Portugal",
    isOnline: true,
    experience: "8 anos",
    category: "Engenharia",
  },
  {
    id: 4,
    name: "Fernanda Lima",
    profession: "Contabilista",
    specialty: "Consultoria Fiscal",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c0763c66?w=400&h=400&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
    rating: 4.9,
    completedExchanges: 42,
    skills: ["Contabilidade", "Impostos", "Consultoria Empresarial"],
    bio: "Contadora certificada com 12 anos de experiência. Especialista em otimização fiscal para PMEs.",
    location: "Coimbra, Portugal",
    isOnline: true,
    experience: "12 anos",
    category: "Negócios",
  },
  {
    id: 5,
    name: "Dr. Juliana Santos",
    profession: "Nutricionista",
    specialty: "Nutrição Esportiva",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop",
    rating: 4.8,
    completedExchanges: 27,
    skills: ["Nutrição Esportiva", "Dietas Personalizadas", "Suplementação"],
    bio: "Nutricionista especializada em performance esportiva. Atendo atletas profissionais e amadores.",
    location: "Aveiro, Portugal",
    isOnline: false,
    experience: "6 anos",
    category: "Saúde",
  },
  {
    id: 6,
    name: "Lucas Ferreira",
    profession: "Chef de Cozinha",
    specialty: "Culinária Italiana",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop",
    rating: 4.9,
    completedExchanges: 35,
    skills: ["Culinária Italiana", "Massas Artesanais", "Vinhos"],
    bio: "Chef formado na Itália. Especialista em culinária italiana tradicional e contemporânea.",
    location: "Faro, Portugal",
    isOnline: true,
    experience: "9 anos",
    category: "Culinária",
  },
  {
    id: 7,
    name: "Marina Costa",
    profession: "Desenvolvedora Front-end",
    specialty: "React & TypeScript",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1522252234503-e356532cafd5?w=800&h=400&fit=crop",
    rating: 4.8,
    completedExchanges: 29,
    skills: ["React", "TypeScript", "Next.js"],
    bio: "Desenvolvedora front-end especializada em React e TypeScript. 6 anos de experiência em projetos web.",
    location: "Setúbal, Portugal",
    isOnline: true,
    experience: "6 anos",
    category: "Tecnologia",
  },
  {
    id: 8,
    name: "Carlos Mendes",
    profession: "Professor de Inglês",
    specialty: "Inglês Corporativo",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop",
    rating: 4.9,
    completedExchanges: 55,
    skills: ["Inglês Corporativo", "Conversação", "Preparação TOEFL"],
    bio: "Professor de inglês certificado com 10 anos de experiência. Especialista em inglês para negócios.",
    location: "Funchal, Portugal",
    isOnline: true,
    experience: "10 anos",
    category: "Idiomas",
  },
  {
    id: 9,
    name: "Amanda Oliveira",
    profession: "Psicóloga",
    specialty: "Psicologia Clínica",
    avatar: "https://images.unsplash.com/photo-1594824388558-c7d86d2897b4?w=400&h=400&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=800&h=400&fit=crop",
    rating: 4.7,
    completedExchanges: 38,
    skills: ["Terapia Cognitiva", "Ansiedade", "Relacionamentos"],
    bio: "Psicóloga clínica com experiência em terapia cognitivo-comportamental. Ajudo pessoas a superar desafios.",
    location: "Évora, Portugal",
    isOnline: false,
    experience: "7 anos",
    category: "Saúde",
  },
  {
    id: 10,
    name: "Diego Santos",
    profession: "Personal Trainer",
    specialty: "Fitness & Musculação",
    avatar: "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=400&h=400&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=800&h=400&fit=crop",
    rating: 4.8,
    completedExchanges: 44,
    skills: ["Musculação", "Treino Funcional", "Nutrição Esportiva"],
    bio: "Personal trainer certificado com 8 anos de experiência. Especialista em treinos personalizados.",
    location: "Viseu, Portugal",
    isOnline: true,
    experience: "8 anos",
    category: "Fitness",
  },
  {
    id: 11,
    name: "Letícia Rocha",
    profession: "Designer Gráfica",
    specialty: "Branding & Identidade Visual",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=400&fit=crop",
    rating: 4.9,
    completedExchanges: 33,
    skills: ["Branding", "Ilustração", "Adobe Creative Suite"],
    bio: "Designer gráfica especializada em branding e identidade visual. Crio marcas que conectam com o público.",
    location: "Leiria, Portugal",
    isOnline: true,
    experience: "5 anos",
    category: "Design",
  },
  {
    id: 12,
    name: "Rafael Almeida",
    profession: "Músico & Produtor",
    specialty: "Produção Musical",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop",
    rating: 4.7,
    completedExchanges: 26,
    skills: ["Produção Musical", "Mixagem", "Composição"],
    bio: "Músico e produtor musical com 12 anos de experiência. Trabalho com diversos estilos musicais.",
    location: "Guimarães, Portugal",
    isOnline: false,
    experience: "12 anos",
    category: "Música",
  },
]
const categories = [
  "Todos",
  "Arte",
  "Tecnologia",
  "Música",
  "Idiomas",
  "Culinária",
  "Design",
  "Negócios",
  "Saúde",
  "Fitness",
  "Dança",
  "Engenharia",
]

const locations = [
  "Todas as cidades",
  "Faro, PT",
  "Coimbra, PT",
  "Évora, PT",
  "Porto, PT",
  "Braga, PT",
  "Lisboa, PT",
  "Aveiro, PT",
  "Leiria, PT",
]

const experienceLevels = ["Qualquer experiência", "1-3 anos", "4-7 anos", "8-12 anos", "15+ anos"]

export default function ProfessionalsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedLocation, setSelectedLocation] = useState("Todas as cidades")
  const [selectedExperience, setSelectedExperience] = useState("Qualquer experiência")
  const [sortBy, setSortBy] = useState("rating")
  const [onlineOnly, setOnlineOnly] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9
  const [showFilters, setShowFilters] = useState(false)

  // Use React Query to fetch professionals
  const { data: queryProfessionals, isLoading, error } = useProfessionals({
    category: selectedCategory !== "Todos" ? selectedCategory : undefined,
    location: selectedLocation !== "Todas as cidades" ? selectedLocation : undefined,
    onlineOnly,
    sortBy,
    searchQuery
  })

  const filteredProfessionals = useMemo(() => {
    // Use React Query data if available, otherwise fallback to mock data
    let filtered = queryProfessionals || professionals

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (professional: any) =>
          professional.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          professional.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
          professional.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          professional.skills.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Filter by category
    if (selectedCategory !== "Todos") {
      filtered = filtered.filter((professional) => professional.category === selectedCategory)
    }
    // Filter by location
    if (selectedLocation !== "Todas as cidades") {
      filtered = filtered.filter((professional) => professional.location === selectedLocation)
    }

    // Filter by experience
    if (selectedExperience !== "Qualquer experiência") {
      filtered = filtered.filter((professional) => {
        const experience = professional.experience
        switch (selectedExperience) {
          case "1-3 anos":
            return experience.includes("1") || experience.includes("2") || experience.includes("3")
          case "4-7 anos":
            return (
              experience.includes("4") ||
              experience.includes("5") ||
              experience.includes("6") ||
              experience.includes("7")
            )
          case "8-12 anos":
            return (
              experience.includes("8") ||
              experience.includes("9") ||
              experience.includes("10") ||
              experience.includes("11") ||
              experience.includes("12")
            )
          case "15+ anos":
            return experience.includes("15") || experience.includes("20")
          default:
            return true
        }
      })
    }
    // Filter by online status
    if (onlineOnly) {
      filtered = filtered.filter((professional) => professional.isOnline)
    }

    // Sort professionals
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "exchanges":
        filtered.sort((a, b) => b.completedExchanges - a.completedExchanges)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "recent":
        // For demo purposes, we'll randomize
        filtered.sort(() => Math.random() - 0.5)
        break
      default:
        break
    }

    return filtered
  }, [searchQuery, selectedCategory, selectedLocation, selectedExperience, sortBy, onlineOnly])

  // Pagination
  const totalPages = Math.ceil(filteredProfessionals.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProfessionals = filteredProfessionals.slice(startIndex, startIndex + itemsPerPage)
  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("Todos")
    setSelectedLocation("Todas as cidades")
    setSelectedExperience("Qualquer experiência")
    setOnlineOnly(false)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-shareup-dark text-white">
      <Navigation />

      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profissionais</h1>
          <p className="text-slate-400">
            Encontre especialistas para trocar conhecimentos • {filteredProfessionals.length} profissionais encontrados
          </p>
        </div>

        {/* View Mode and Stats */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <Users className="h-4 w-4" />
              <span>{filteredProfessionals.length} profissionais</span>
            </div>
            {filteredProfessionals.filter((p) => p.isOnline).length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-shareup-lime">
                <div className="w-2 h-2 bg-shareup-lime rounded-full animate-pulse"></div>
                <span>{filteredProfessionals.filter((p) => p.isOnline).length} online agora</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {/* Filter Toggle Button */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`border-slate-600 text-slate-300 hover:bg-slate-700 ${
                showFilters ? "bg-slate-700 text-white border-shareup-cyan" : ""
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>

            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-shareup-cyan text-shareup-dark" : "text-slate-400"}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-shareup-cyan text-shareup-dark" : "text-slate-400"}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {/* Filters - Conditionally Visible */}
        {showFilters && (
          <div className="bg-shareup-dark/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8 animate-in slide-in-from-top-2 duration-300">
            {/* Todo o conteúdo dos filtros existente */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Buscar por nome, profissão ou habilidade..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Category */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-white hover:bg-gray-600">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Location */}
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {locations.map((location) => (
                    <SelectItem key={location} value={location} className="text-white hover:bg-gray-600">
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Experience */}
              <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {experienceLevels.map((level) => (
                    <SelectItem key={level} value={level} className="text-white hover:bg-gray-600">
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

{/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="rating" className="text-white hover:bg-gray-600">
                    Melhor Avaliação
                  </SelectItem>
                  <SelectItem value="exchanges" className="text-white hover:bg-gray-600">
                    Mais Trocas
                  </SelectItem>
                  <SelectItem value="name" className="text-white hover:bg-gray-600">
                    Nome A-Z
                  </SelectItem>
                  <SelectItem value="recent" className="text-white hover:bg-gray-600">
                    Mais Recentes
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Online Only Toggle */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="onlineOnly"
                  checked={onlineOnly}
                  onChange={(e) => setOnlineOnly(e.target.checked)}
                  className="w-4 h-4 text-shareup-cyan bg-gray-700 border-gray-600 rounded focus:ring-shareup-cyan"
                />
                <label htmlFor="onlineOnly" className="text-sm text-slate-300">
                  Apenas online
                </label>
              </div>
               {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={clearFilters}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {(selectedCategory !== "Todos" ||
          selectedLocation !== "Todas as cidades" ||
          selectedExperience !== "Qualquer experiência" ||
          onlineOnly ||
          searchQuery) && (
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-sm text-slate-400">Filtros ativos:</span>
            {selectedCategory !== "Todos" && (
              <Badge variant="secondary" className="bg-shareup-cyan/20 text-shareup-cyan">
                {selectedCategory}
              </Badge>
            )}
            {selectedLocation !== "Todas as cidades" && (
              <Badge variant="secondary" className="bg-shareup-lime/20 text-shareup-lime">
                {selectedLocation}
              </Badge>
            )}
            {selectedExperience !== "Qualquer experiência" && (
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                {selectedExperience}
              </Badge>
            )}
            {onlineOnly && (
              <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                Apenas online
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                "{searchQuery}"
              </Badge>
            )}
          </div>
        )}

        {/* Professionals Grid/List */}
        {isLoading ? (
          <div className={
            viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" : "space-y-4 mb-8"
          }>
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="bg-shareup-dark/60 backdrop-blur-sm border-gray-700 overflow-hidden animate-pulse">
                <div className="h-52 bg-slate-700/50" />
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-slate-700/50 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-6 bg-slate-700/50 rounded w-3/4" />
                      <div className="h-4 bg-slate-700/50 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-700/50 rounded w-full" />
                    <div className="h-4 bg-slate-700/50 rounded w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-400 text-lg mb-4">Erro ao carregar profissionais</div>
            <p className="text-slate-400 mb-4">Não foi possível carregar os profissionais. Tente novamente.</p>
            <Button onClick={() => window.location.reload()}>
              Recarregar
            </Button>
          </div>
        ) : paginatedProfessionals.length > 0 ? (
          <>
            <div
              className={
                viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" : "space-y-4 mb-8"
              }
            >
              {paginatedProfessionals.map((professional) => (
                <EnhancedProfessionalCard key={professional.id} professional={professional} />
              ))}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="text-gray-400 hover:text-white"
                >
                  ← Anterior
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                  return (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === currentPage ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNumber)}
                      className={
                        pageNumber === currentPage
                          ? "bg-shareup-cyan text-shareup-dark hover:bg-shareup-cyan/90"
                          : "text-gray-400 hover:text-white"
                      }
                    >
                 {pageNumber}
                    </Button>
                  )
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="text-slate-400">...</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      className="text-gray-400 hover:text-white"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
<Button
                  variant="ghost"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="text-gray-400 hover:text-white"
                >
                  Próxima →
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum profissional encontrado</h3>
            <p className="text-slate-400 mb-6">Tente ajustar seus filtros ou termos de busca</p>
            <Button onClick={clearFilters} className="bg-shareup-cyan hover:bg-shareup-cyan/90 text-shareup-dark">
              Limpar Todos os Filtros
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
