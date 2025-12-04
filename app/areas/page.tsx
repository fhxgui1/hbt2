"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, Zap, Trophy, TrendingUp, Plus } from "lucide-react"
import { DEFAULT_AREAS } from "@/lib/types"
import type { AreaScore } from "@/lib/types"
import { Progress } from "@/components/ui/progress"

export default function AreasPage() {
  const [scores, setScores] = useState<Record<string, AreaScore>>({})
  const [loading, setLoading] = useState(true)
  const [totalXP, setTotalXP] = useState(0)
  const [showCreateArea, setShowCreateArea] = useState(false) // Dialog para criar áreas
  const [newAreaName, setNewAreaName] = useState("")
  const [newAreaColor, setNewAreaColor] = useState("from-purple-500 to-pink-500")

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch("/api/dashboard")
        if (!response.ok) throw new Error("Failed to fetch scores")
        const data = await response.json()

        const scoresMap: Record<string, AreaScore> = {}
        let total = 0

        data.areaScores?.forEach((score: AreaScore) => {
          scoresMap[score.area] = score
          total += score.totalPoints
        })

        setScores(scoresMap)
        setTotalXP(total)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchScores()
  }, [])

  const handleCreateArea = async () => {
    if (!newAreaName.trim()) return
    try {
      await fetch("/api/areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newAreaName, color: newAreaColor }),
      })
      setNewAreaName("")
      setNewAreaColor("from-purple-500 to-pink-500")
      setShowCreateArea(false)
      // Recarregar scores
      const response = await fetch("/api/dashboard")
      const data = await response.json()
      const scoresMap: Record<string, AreaScore> = {}
      let total = 0
      data.areaScores?.forEach((score: AreaScore) => {
        scoresMap[score.area] = score
        total += score.totalPoints
      })
      setScores(scoresMap)
      setTotalXP(total)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const maxXP = Math.max(...DEFAULT_AREAS.map((area) => scores[area.value]?.totalPoints || 0))

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-gradient-to-b from-card to-background">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-balance">Áreas de Atuação</h1>
              <p className="text-muted-foreground">Acompanhe seu progresso em cada área</p>
            </div>
            <Button onClick={() => setShowCreateArea(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Área
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {DEFAULT_AREAS.map((area) => {
            const score = scores[area.value]
            const xp = score?.totalPoints || 0
            const level = score?.level || 1
            const percentage = maxXP > 0 ? (xp / maxXP) * 100 : 0

            return (
              <Link key={area.value} href={`/areas/${area.value}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader className={`bg-gradient-to-r ${area.color} text-white`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white">{area.label}</CardTitle>
                        <p className="text-white/80 text-sm mt-1">Nível {level}</p>
                      </div>
                      <TrendingUp className="w-6 h-6 text-white/80" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progresso</span>
                        <div className="flex items-center gap-1 text-yellow-500 font-bold">
                          <Zap className="w-4 h-4" />
                          {xp} XP
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p>
                        <span className="font-medium text-foreground">{score?.completedItems || 0}</span> de
                        <span className="font-medium text-foreground"> {score?.totalItems || 0}</span> itens concluídos
                      </p>
                    </div>

                    {score && score.achievements && score.achievements.length > 0 && (
                      <div className="border-t border-border pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium">Conquistas</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {score.achievements.map((achievement, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resumo Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-card border border-border">
                <p className="text-sm text-muted-foreground mb-1">Total de XP</p>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <p className="text-3xl font-bold">{totalXP}</p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border">
                <p className="text-sm text-muted-foreground mb-1">Áreas Ativas</p>
                <p className="text-3xl font-bold">{Object.values(scores).filter((s) => s.totalPoints > 0).length}</p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border">
                <p className="text-sm text-muted-foreground mb-1">Itens Concluídos</p>
                <p className="text-3xl font-bold">
                  {Object.values(scores).reduce((sum, s) => sum + (s.completedItems || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showCreateArea} onOpenChange={setShowCreateArea}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Nova Área</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome da Área</label>
              <Input value={newAreaName} onChange={(e) => setNewAreaName(e.target.value)} placeholder="Ex: Marketing" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cor (Gradiente)</label>
              <select
                value={newAreaColor}
                onChange={(e) => setNewAreaColor(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md"
              >
                <option value="from-blue-500 to-cyan-500">Azul</option>
                <option value="from-red-500 to-pink-500">Vermelho</option>
                <option value="from-green-500 to-emerald-500">Verde</option>
                <option value="from-purple-500 to-violet-500">Roxo</option>
                <option value="from-orange-500 to-amber-500">Laranja</option>
                <option value="from-indigo-500 to-blue-500">Índigo</option>
                <option value="from-pink-500 to-rose-500">Rosa</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateArea(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateArea}>Criar Área</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
