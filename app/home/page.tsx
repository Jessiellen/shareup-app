"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Users, TrendingUp } from "lucide-react"
import EnhancedBackgroundCard from "@/components/enhanced-background-card"
import EnhancedProfessionalCard from "@/components/enhanced-professional-card"
import { useRouter } from "next/navigation"

const successStories = [
  {
    id: 1,
    title: "DE INICIANTE A EXPERT: COMO MARIA TRANSFORMOU SUA CARREIRA EM DESIGN",
    description:
      "Maria era contabilista e sempre sonhou em trabalhar com design. Através do ShareUp, ela trocou conhecimentos de contabilidade por aulas de design gráfico. Hoje, 6 meses depois, ela trabalha como designer freelancer e já tem uma carteira de clientes fiéis.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop",
    author: "Maria Santos",
    profession: "Designer Gráfica",
    beforeProfession: "Contabilista",
    exchangePartner: "João Silva - Designer Senior",
    timeframe: "6 meses",
    category: "Design",
    results: ["Mudança de carreira", "15+ clientes", "Renda 3x maior"],
  },
  {
    id: 2,
    title: "PROGRAMADOR APRENDE FRANCÊS E CONSEGUE TRABALHO NA FRANÇA",
    description:
      "Carlos era desenvolvedor mas queria trabalhar no exterior. Ele ensinou programação para uma professora de francês em troca de aulas do idioma. Após 8 meses de troca, conseguiu uma vaga em Paris e realizou seu sonho.",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&h=600&fit=crop",
    author: "Carlos Oliveira",
    profession: "Desenvolvedor Full Stack",
    beforeProfession: "Desenvolvedor Junior",
    exchangePartner: "Sophie Dubois - Professora de Francês",
    timeframe: "8 meses",
    category: "Idiomas",
    results: ["Fluência em francês", "Trabalho em Paris", "Crescimento profissional"],
  },
  {
    id: 3,
    title: "PROFESSORA DE BALLET EXPANDE NEGÓCIO COM MARKETING DIGITAL",
    description:
      "Ana sempre teve dificuldades para divulgar sua escola de ballet. Através de uma troca no ShareUp, ela ensinou ballet para um especialista em marketing digital. Resultado: sua escola triplicou o número de alunos em 4 meses.",
    image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1200&h=600&fit=crop",
    author: "Ana Costa",
    profession: "Professora de Ballet",
    beforeProfession: "Professora de Ballet",
    exchangePartner: "Pedro Lima - Marketing Digital",
    timeframe: "4 meses",
    category: "Negócios",
    results: ["3x mais alunos", "Presença digital forte", "Renda duplicada"],
  },
]

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
    location: "São Paulo, SP",
    isOnline: true,
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
    location: "Rio de Janeiro, RJ",
    isOnline: false,
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
    location: "Belo Horizonte, MG",
    isOnline: true,
  },
  {
    id: 4,
    name: "Fernanda Lima",
    profession: "Contabilista",
    specialty: "Consultoria Fiscal",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=400&h=400&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
    rating: 4.9,
    completedExchanges: 42,
    skills: ["Contabilidade", "Impostos", "Consultoria Empresarial"],
    bio: "Contadora certificada com 12 anos de experiência. Especialista em otimização fiscal para PMEs.",
    location: "Porto Alegre, RS",
    isOnline: true,
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
    location: "Brasília, DF",
    isOnline: false,
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
    location: "São Paulo, SP",
    isOnline: true,
  },
]

export default function HomePage() {
  const { user } = useAuth()
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % successStories.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + successStories.length) % successStories.length)
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000) // 7 seconds for success stories
    return () => clearInterval(timer)
  }, [])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-shareup-dark text-white">
      <Navigation />

      <main className="container mx-auto px-6 py-8">
        {/* Success Stories Carousel */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Histórias de Sucesso</h2>
              <p className="text-slate-400">Veja como as trocas de habilidades transformaram vidas</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <TrendingUp className="h-4 w-4" />
              <span>+{successStories.length * 10} vidas transformadas</span>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {successStories.map((story, index) => (
                  <div key={story.id} className="w-full flex-shrink-0">
                    <EnhancedBackgroundCard story={story} />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation arrows */}
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-shareup-dark/70 hover:bg-shareup-dark/90 text-white rounded-full"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-shareup-dark/70 hover:bg-shareup-dark/90 text-white rounded-full"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Dots indicator */}
            <div className="flex justify-center mt-4 space-x-2">
              {successStories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? "bg-shareup-cyan" : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Professionals Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Profissionais em Destaque</h2>
              <p className="text-slate-400">Conecte-se com especialistas de diversas áreas</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <Users className="h-4 w-4" />
              <span>{professionals.length * 50}+ profissionais ativos</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionals.map((professional) => (
              <EnhancedProfessionalCard key={professional.id} professional={professional} />
            ))}
          </div>

          {/* View More Button */}
          <div className="text-center mt-8">
            <Button
              className="bg-shareup-cyan hover:bg-shareup-cyan/90 text-shareup-dark font-semibold px-8"
              onClick={() => router.push("/professionals")}
            >
              Ver Mais Profissionais
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
