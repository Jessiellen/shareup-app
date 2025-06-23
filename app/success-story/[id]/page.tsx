"use client"

import { useParams, useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Clock, Users, Star, TrendingUp, Heart, Share2, BookmarkPlus } from "lucide-react"
import { useState } from "react"

const successStoriesData = {
  "1": {
    id: 1,
    title: "DE INICIANTE A EXPERT: COMO MARIA TRANSFORMOU SUA CARREIRA EM DESIGN",
    description:
      "Maria era contabilista e sempre sonhou em trabalhar com design. Através do ShareUp, ela trocou conhecimentos de contabilidade por aulas de design gráfico. Hoje, 6 meses depois, ela trabalha como designer freelancer e já tem uma carteira de clientes fiéis.",
    image: "/placeholder.svg?height=600&width=1200&text=Designer+Workspace+with+Computer+and+Graphics",
    author: "Maria Santos",
    profession: "Designer Gráfica",
    beforeProfession: "Contabilista",
    exchangePartner: "João Silva - Designer Senior",
    timeframe: "6 meses",
    category: "Design",
    results: ["Mudança de carreira", "15+ clientes", "Renda 3x maior"],
    fullContent: `
      <h2>O Início da Jornada</h2>
      <p>Maria Santos, de 32 anos, trabalhava como contabilista há 8 anos em uma empresa de médio porte em São Paulo. Apesar de ter estabilidade financeira, ela sempre sentiu que algo estava faltando em sua vida profissional. Desde pequena, Maria tinha paixão por arte e design, mas nunca teve coragem de seguir essa carreira.</p>
      
      <h2>O Momento da Decisão</h2>
      <p>Em janeiro de 2024, Maria descobriu o ShareUp através de uma amiga. A plataforma prometia conectar pessoas que queriam trocar conhecimentos, e isso despertou sua curiosidade. "Eu pensei: e se eu pudesse ensinar contabilidade para alguém que me ensinasse design?", relembra Maria.</p>
      
      <h2>O Encontro com João Silva</h2>
      <p>Foi assim que Maria conheceu João Silva, um designer senior com 15 anos de experiência que estava expandindo seu negócio e precisava de ajuda com a parte financeira. "Quando vi o perfil da Maria, percebi que seria uma troca perfeita", conta João.</p>
      
      <h2>A Troca de Conhecimentos</h2>
      <p>Durante 6 meses, Maria e João se encontraram 2 vezes por semana. Nas segundas e quartas, Maria ensinava conceitos de contabilidade, gestão financeira e planejamento tributário. Nas terças e quintas, João a introduzia ao mundo do design gráfico, desde os fundamentos até técnicas avançadas no Photoshop e Illustrator.</p>
      
      <h2>Os Primeiros Projetos</h2>
      <p>No terceiro mês de troca, Maria já se sentia confiante para aceitar seus primeiros projetos freelancer. "João me ajudou a montar meu portfólio e me deu dicas valiosas sobre como precificar meu trabalho", explica Maria.</p>
      
      <h2>A Transformação</h2>
      <p>Hoje, 6 meses depois, Maria trabalha como designer freelancer em tempo integral. Ela tem uma carteira de 15 clientes regulares e sua renda triplicou em comparação ao que ganhava como contabilista. "O ShareUp mudou minha vida. Não foi apenas uma troca de conhecimentos, foi uma troca de sonhos", emociona-se Maria.</p>
      
      <h2>O Impacto na Vida de João</h2>
      <p>João também se beneficiou enormemente da troca. Com os conhecimentos de contabilidade que aprendeu com Maria, ele conseguiu organizar melhor as finanças de sua agência e aumentou sua margem de lucro em 40%. "Maria me ensinou a ver o negócio com outros olhos", diz João.</p>
      
      <h2>Dicas para Quem Quer Seguir o Mesmo Caminho</h2>
      <ul>
        <li>Seja claro sobre seus objetivos desde o início</li>
        <li>Estabeleça um cronograma de estudos consistente</li>
        <li>Pratique constantemente o que está aprendendo</li>
        <li>Não tenha medo de aceitar projetos pequenos no início</li>
        <li>Mantenha contato com seu parceiro de troca mesmo após o período estabelecido</li>
      </ul>
      
      <h2>O Futuro</h2>
      <p>Maria planeja expandir seus conhecimentos em UX/UI Design e já está procurando no ShareUp por um novo parceiro de troca. "Uma vez que você experimenta o poder da troca de conhecimentos, não consegue mais parar", ri Maria.</p>
    `,
    publishedAt: "15 de Janeiro, 2024",
    readTime: "8 min de leitura",
    likes: 234,
    shares: 45,
    comments: 67,
  },
  "2": {
    id: 2,
    title: "PROGRAMADOR APRENDE FRANCÊS E CONSEGUE TRABALHO NA FRANÇA",
    description:
      "Carlos era desenvolvedor mas queria trabalhar no exterior. Ele ensinou programação para uma professora de francês em troca de aulas do idioma. Após 8 meses de troca, conseguiu uma vaga em Paris e realizou seu sonho.",
    image: "/placeholder.svg?height=600&width=1200&text=Paris+Eiffel+Tower+with+Laptop+Programming",
    author: "Carlos Oliveira",
    profession: "Desenvolvedor Full Stack",
    beforeProfession: "Desenvolvedor Junior",
    exchangePartner: "Sophie Dubois - Professora de Francês",
    timeframe: "8 meses",
    category: "Idiomas",
    results: ["Fluência em francês", "Trabalho em Paris", "Crescimento profissional"],
    fullContent: `
      <h2>O Sonho de Trabalhar no Exterior</h2>
      <p>Carlos Oliveira, desenvolvedor de 28 anos, sempre sonhou em trabalhar no exterior. Com 5 anos de experiência em desenvolvimento web, ele sabia que tinha as habilidades técnicas necessárias, mas o idioma era uma barreira.</p>
      
      <h2>A Descoberta do ShareUp</h2>
      <p>Em março de 2023, Carlos descobriu o ShareUp e teve uma ideia: trocar seus conhecimentos de programação por aulas de francês. "Eu pensei que seria uma forma mais eficiente e econômica de aprender o idioma", explica Carlos.</p>
      
      <h2>O Encontro com Sophie</h2>
      <p>Sophie Dubois, professora de francês nativa, estava interessada em aprender programação para criar seu próprio site de ensino online. A combinação foi perfeita.</p>
      
      <h2>8 Meses de Dedicação</h2>
      <p>Durante 8 meses, Carlos e Sophie se encontraram 3 vezes por semana via videochamada. Carlos ensinava React, Node.js e desenvolvimento web, enquanto Sophie o guiava através das complexidades da língua francesa.</p>
      
      <h2>A Oportunidade em Paris</h2>
      <p>No sétimo mês de troca, Carlos se candidatou a uma vaga em uma startup francesa. Graças ao seu francês fluente e suas habilidades técnicas, foi aprovado e hoje trabalha em Paris.</p>
      
      <h2>O Sucesso de Sophie</h2>
      <p>Sophie também alcançou seus objetivos, criando uma plataforma online de ensino de francês que já tem mais de 500 alunos cadastrados.</p>
    `,
    publishedAt: "20 de Novembro, 2023",
    readTime: "6 min de leitura",
    likes: 189,
    shares: 32,
    comments: 43,
  },
  "3": {
    id: 3,
    title: "PROFESSORA DE BALLET EXPANDE NEGÓCIO COM MARKETING DIGITAL",
    description:
      "Ana sempre teve dificuldades para divulgar sua escola de ballet. Através de uma troca no ShareUp, ela ensinou ballet para um especialista em marketing digital. Resultado: sua escola triplicou o número de alunos em 4 meses.",
    image: "/placeholder.svg?height=600&width=1200&text=Ballet+Studio+with+Dancers+and+Social+Media+Graphics",
    author: "Ana Costa",
    profession: "Professora de Ballet",
    beforeProfession: "Professora de Ballet",
    exchangePartner: "Pedro Lima - Marketing Digital",
    timeframe: "4 meses",
    category: "Negócios",
    results: ["3x mais alunos", "Presença digital forte", "Renda duplicada"],
    fullContent: `
      <h2>A Paixão pelo Ballet</h2>
      <p>Ana Costa, de 35 anos, é professora de ballet há 15 anos. Ela sempre teve uma escola pequena, mas com a pandemia, perdeu muitos alunos e precisava encontrar uma forma de se reinventar.</p>
      
      <h2>O Desafio Digital</h2>
      <p>Ana sabia que precisava marcar presença nas redes sociais, mas não tinha conhecimento em marketing digital. Foi quando descobriu o ShareUp e decidiu trocar aulas de ballet por conhecimentos de marketing.</p>
      
      <h2>A Parceria com Pedro</h2>
      <p>Pedro Lima, especialista em marketing digital, sempre quis aprender ballet para melhorar sua postura e flexibilidade. A troca foi perfeita para ambos.</p>
      
      <h2>A Transformação Digital</h2>
      <p>Em 4 meses, Ana aprendeu a criar conteúdo para Instagram, Facebook e TikTok. Pedro a ajudou a desenvolver uma estratégia de marketing que destacava a beleza e os benefícios do ballet.</p>
      
      <h2>Resultados Extraordinários</h2>
      <p>Hoje, a escola de Ana tem 3 vezes mais alunos, uma forte presença digital com 10k seguidores no Instagram, e sua renda duplicou. Pedro, por sua vez, melhorou significativamente sua postura e descobriu uma nova paixão.</p>
    `,
    publishedAt: "5 de Dezembro, 2023",
    readTime: "5 min de leitura",
    likes: 156,
    shares: 28,
    comments: 34,
  },
}

export default function SuccessStoryPage() {
  const params = useParams()
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const storyId = params.id as string
  const story = successStoriesData[storyId as keyof typeof successStoriesData]

  if (!story) {
    return (
      <div className="min-h-screen bg-shareup-dark text-white">
        <Navigation />
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">História não encontrada</h1>
          <Button onClick={() => router.push("/home")} className="bg-shareup-cyan text-shareup-dark">
            Voltar ao Início
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-shareup-dark text-white">
      <Navigation />

      <main className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 text-slate-400 hover:text-white">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {/* Hero Section */}
        <div className="relative mb-12">
          <div className="relative h-96 rounded-2xl overflow-hidden">
            <img src={story.image || "/placeholder.svg"} alt={story.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-shareup-dark/90 via-shareup-dark/50 to-transparent"></div>

            {/* Content Overlay */}
            <div className="absolute bottom-8 left-8 right-8">
              <Badge className="bg-shareup-lime text-shareup-dark font-medium mb-4">{story.category}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white leading-tight">{story.title}</h1>

              <div className="flex items-center space-x-6 text-sm text-slate-300">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{story.readTime}</span>
                </div>
                <span>{story.publishedAt}</span>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{story.timeframe} de troca</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-shareup-dark/50 backdrop-blur-sm border-gray-700">
              <CardContent className="p-8">
                {/* Author Info */}
                <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-slate-700">
                  <div className="w-16 h-16 bg-gradient-to-r from-shareup-cyan to-shareup-lime rounded-full flex items-center justify-center">
                    <span className="text-shareup-dark font-bold text-xl">
                      {story.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{story.author}</h3>
                    <p className="text-shareup-cyan">
                      {story.beforeProfession} → {story.profession}
                    </p>
                    <p className="text-sm text-slate-400">Parceiro: {story.exchangePartner.split(" - ")[0]}</p>
                  </div>
                </div>

                {/* Article Content */}
                <div
                  className="prose prose-invert prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: story.fullContent }}
                />

                {/* Results */}
                <div className="mt-8 pt-6 border-t border-slate-700">
                  <h3 className="text-xl font-bold text-shareup-cyan mb-4">Resultados Alcançados</h3>
                  <div className="flex flex-wrap gap-3">
                    {story.results.map((result, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-shareup-cyan text-shareup-cyan bg-shareup-cyan/10 px-4 py-2"
                      >
                        ✨ {result}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Social Actions */}
            <Card className="bg-shareup-dark/50 backdrop-blur-sm border-gray-700">
              <CardContent className="p-6">
                <h3 className="font-bold text-white mb-4">Interações</h3>
                <div className="space-y-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={`h-4 w-4 mr-3 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                    <div>
                      <p className="font-medium">{story.likes + (isLiked ? 1 : 0)} curtidas</p>
                      <p className="text-xs text-slate-400">Curtir história</p>
                    </div>
                  </Button>

                  <Button variant="ghost" className="w-full justify-start text-left">
                    <Share2 className="h-4 w-4 mr-3" />
                    <div>
                      <p className="font-medium">{story.shares} compartilhamentos</p>
                      <p className="text-xs text-slate-400">Compartilhar</p>
                    </div>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                  >
                    <BookmarkPlus
                      className={`h-4 w-4 mr-3 ${isBookmarked ? "fill-shareup-cyan text-shareup-cyan" : ""}`}
                    />
                    <div>
                      <p className="font-medium">Salvar</p>
                      <p className="text-xs text-slate-400">Salvar para ler depois</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="bg-shareup-dark/50 backdrop-blur-sm border-gray-700">
              <CardContent className="p-6">
                <h3 className="font-bold text-white mb-4">Estatísticas da Troca</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Duração:</span>
                    <span className="font-medium text-white">{story.timeframe}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Categoria:</span>
                    <Badge className="bg-shareup-lime text-shareup-dark">{story.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Avaliação:</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium text-white">5.0</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-gradient-to-br from-shareup-cyan/20 to-shareup-lime/20 border-shareup-cyan/30">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-shareup-cyan mx-auto mb-3" />
                <h3 className="font-bold text-white mb-2">Inspire-se!</h3>
                <p className="text-sm text-slate-300 mb-4">Comece sua própria jornada de transformação no ShareUp</p>
                <Button
                  className="w-full bg-shareup-cyan hover:bg-shareup-cyan/90 text-shareup-dark font-bold"
                  onClick={() => router.push("/posts")}
                >
                  Encontrar Parceiros
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
