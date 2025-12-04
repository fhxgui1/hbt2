"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, TrendingUp, Trophy, Zap, Target } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { AreaScore, Achievement } from "@/lib/types"
import { AREAS } from "@/lib/types"

export function DashboardPage() {
  const [areaScores, setAreaScores] = useState<AreaScore[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [totalXP, setTotalXP] = useState(0)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard")
        if (!response.ok) throw new Error("Failed to fetch dashboard data")
        const data = await response.json()
        setAreaScores(data.areaScores)
        setAchievements(data.achievements)
        setTotalXP(data.totalXP)
      } catch {
        // Mock data
        const mockScores: AreaScore[] = AREAS.map((area) => ({
          area: area.value,
          totalPoints: Math.floor(Math.random() * 1000) + 100,
          completedItems: Math.floor(Math.random() * 20) + 1,
          totalItems: Math.floor(Math.random() * 30) + 10,
          achievements: [],
          level: Math.floor(Math.random() * 10) + 1,
        }))
        setAreaScores(mockScores)
        setTotalXP(mockScores.reduce((sum, s) => sum + s.totalPoints, 0))
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const chartData = areaScores.map((score) => ({
    name: AREAS.find((a) => a.value === score.area)?.label || "",
    xp: score.totalPoints,
    items: score.completedItems,
    level: score.level,
  }))

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-gradient-to-b from-card to-background">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-2 text-balance">Dashboard</h1>
          <p className="text-muted-foreground">Acompanhe seu progresso em todas as áreas</p>
        </div>
      </div>
  <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-3xl font-bold"> issues para termianr o MVP</CardTitle>
              <Zap className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
{/*          
              <p className="text-xs text-muted-foreground">em todas as áreas</p> */}

              <br />c
              <div className="text-2xl font-bold">geral</div>
              <p> - adicionar uma tabela de resumo para o dashboard</p>
              <p> - adicioanr um modulo de timer para estudos (pesquisar formas e metodos de estudo)</p>
              <p>- adicionar uma tabela de calculo mensal ou uma coluna na mesma tabela com o valor mensal que será resetado pelo codigo</p>
              <p>- adicionar uma tabela de pontuação diária que será resetada pelo codigo</p> 
              <p>- criar um modulo de agenda, onde tenha varias formas de organizar e mostrar a agenda.</p>
              <p>- pesquisar por modelos de agenda, e crie modelos proprios também</p>
              <p>- adicionar uma area de controle financeiro automatizada.</p>
              <p>- pensar numa forma de mostrar a agenda de forma mais atrativa</p>
              <p>- pensar numa forma de integrar os outros itens que tem data com a agenda</p>
              <p>- criar uma pagina de progresso emocional e coisas que quer melhorar mapeando </p>
              <p>- criar um modulo de "problemas a resolver" para mapear problemas que devem ser tratados.</p>
              <p></p>
              <div className="text-2xl font-bold">tarefas</div>
                <p> - acertar a parte de tarefas, ela deve resetar no dia seguinte</p>
                <p>- ao marcar como completo, deve pontuar na tabela </p>
                <div className="text-2xl font-bold">habitos</div>
                <p>-  acertar o calculo de streak </p>
                <p>-  acertar a parte de habito para que ao completar o habito seja feito o card mude de cor ou algo do genero</p>
                <p>adicionar um modo de "feito parcial" no habito</p>
              <div className="text-2xl font-bold">objetivos</div>

                <p>- acertar o insert dos objetivos.</p>
                <p>- tornar os objetivos algo mais atraente</p>
                <p>- trocar o "quadrante" por algo como "requisitos para objetivo ser concluido</p>
                <p>- depois pesquisar como fazer uma forma mais atrativa de distribuir os requisitos ou mostrar esses requisitos de forma visual bem feita.</p>
              <div className="text-2xl font-bold">desafios</div>
                <p>- adicionar a primeira intereação com ia na criação de "conquistas" essa ia irá mandar para api um json e irá registrar no banco de dados assim comop </p>
              <div className="text-2xl font-bold">areas</div>
              <p>- pensar numa forma mais atrativa de mostrar o desenvolvimento das áreas </p>
              <div className="text-2xl font-bold">criar uma pagina de conquistas </div>
                <p>- veja exemplos de como tornar essa pagina bem atrativa e recompensadora quando a pessoa entrar lá</p>

            </CardContent>
          </Card>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">XP Total</CardTitle>
              <Zap className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalXP}</div>
              <p className="text-xs text-muted-foreground">em todas as áreas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Áreas Ativas</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{areaScores.length}</div>
              <p className="text-xs text-muted-foreground">áreas em progresso</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Itens Completados</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{areaScores.reduce((sum, s) => sum + s.completedItems, 0)}</div>
              <p className="text-xs text-muted-foreground">desafios, objetivos e tarefas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conquistas</CardTitle>
              <Trophy className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{achievements.length}</div>
              <p className="text-xs text-muted-foreground">desbloqueadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>XP por Área</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="xp" fill="var(--color-primary)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progresso por Área (Nível)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="level" fill="var(--color-accent)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Areas Detail */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Progresso por Área</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {areaScores.map((score) => {
              const areaConfig = AREAS.find((a) => a.value === score.area)
              const progressPercent = score.totalItems > 0 ? (score.completedItems / score.totalItems) * 100 : 0

              return (
                <Card key={score.area}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">{areaConfig?.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-muted-foreground">Nível {score.level}</span>
                        <span className="font-medium">{Math.round(progressPercent)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">XP Total</span>
                        <span className="font-medium">{score.totalPoints}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Completados</span>
                        <span className="font-medium">
                          {score.completedItems}/{score.totalItems}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Conquistas Desbloqueadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="border-amber-500/20 bg-amber-500/5">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-sm">{achievement.titulo}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">{achievement.descricao}</p>
                      </div>
                      <Trophy className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{AREAS.find((a) => a.value === achievement.area)?.label}</Badge>
                      <span className="text-sm font-medium flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {achievement.points}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Desbloqueada em {new Date(achievement.unlockedAt).toLocaleDateString("pt-BR")}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
