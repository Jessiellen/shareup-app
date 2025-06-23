"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, FileText, TrendingUp, Activity, Plus } from "lucide-react"

export default function DashboardContent() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDocuments: 0,
    activeProjects: 0,
    completionRate: 0,
  })

  useEffect(() => {
    // Simulate loading stats
    const timer = setTimeout(() => {
      setStats({
        totalUsers: 1234,
        totalDocuments: 567,
        activeProjects: 89,
        completionRate: 78,
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const statCards = [
    {
      title: "Total de Usuários",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Documentos",
      value: stats.totalDocuments.toLocaleString(),
      icon: FileText,
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      title: "Projetos Ativos",
      value: stats.activeProjects.toLocaleString(),
      icon: Activity,
      change: "+23%",
      changeType: "positive" as const,
    },
    {
      title: "Taxa de Conclusão",
      value: `${stats.completionRate}%`,
      icon: TrendingUp,
      change: "+5%",
      changeType: "positive" as const,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Bem-vindo ao Shere Up</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <Badge variant={stat.changeType === "positive" ? "default" : "destructive"} className="text-xs">
                    {stat.change}
                  </Badge>
                  <span>vs mês anterior</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimas ações realizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Novo usuário cadastrado", time: "2 min atrás", user: "João Silva" },
                { action: "Documento compartilhado", time: "5 min atrás", user: "Maria Santos" },
                { action: "Projeto finalizado", time: "10 min atrás", user: "Pedro Costa" },
                { action: "Relatório gerado", time: "15 min atrás", user: "Ana Lima" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progresso dos Projetos</CardTitle>
            <CardDescription>Status atual dos projetos em andamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Projeto Alpha", progress: 85, status: "Em andamento" },
                { name: "Projeto Beta", progress: 60, status: "Em desenvolvimento" },
                { name: "Projeto Gamma", progress: 95, status: "Quase concluído" },
                { name: "Projeto Delta", progress: 30, status: "Iniciado" },
              ].map((project, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{project.name}</span>
                    <span className="text-xs text-gray-500">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  <p className="text-xs text-gray-500">{project.status}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
