"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, ArrowLeft, Zap, CheckCircle2, Plus, ChevronDown, ChevronUp } from "lucide-react"
import type { Objective, Challenge, Habit, Task } from "@/lib/types"
import { DEFAULT_AREAS } from "@/lib/types"

export default function ObjectivePage() {
  const params = useParams()
  const router = useRouter()
  const [objective, setObjective] = useState<Objective | null>(null)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)
  const [expandedQuadrants, setExpandedQuadrants] = useState<string[]>([])

  const [showQuadrantForm, setShowQuadrantForm] = useState(false)
  const [newQuadrant, setNewQuadrant] = useState({ titulo: "", descricao: "", steps: [{ title: "", description: "" }] })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [objRes, chalRes, habRes, taskRes] = await Promise.all([
          fetch(`/api/objectives/${params.id}`),
          fetch("/api/challenges"),
          fetch("/api/habits"),
          fetch("/api/tasks"),
        ])

        if (!objRes.ok) throw new Error("Objetivo não encontrado")

        const obj = await objRes.json()
        const chals = await chalRes.json()
        const habs = await habRes.json()
        const tsks = await taskRes.json()

        setObjective(obj)
        setChallenges(chals.filter((c: Challenge) => c.objectiveId === params.id))
        setHabits(habs.filter((h: Habit) => h.objectiveId === params.id))
        setTasks(tsks.filter((t: Task) => t.objectiveId === params.id))
      } catch (error) {
        console.error("Error:", error)
        router.push("/objectives")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, router])

  const handleComplete = async () => {
    if (!objective) return
    setCompleting(true)
    try {
      const response = await fetch(`/api/objectives/${objective.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
      })
      if (!response.ok) throw new Error("Failed to complete objective")
      const updated = await response.json()
      setObjective(updated)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setCompleting(false)
    }
  }

  const handleAddQuadrant = async () => {
    if (!objective || !newQuadrant.titulo.trim()) return

    const newQuadrantId = Date.now().toString()
    const stepsWithIds = newQuadrant.steps.map(step => ({
      ...step,
      quadrant_id: newQuadrantId
    }))

    const updatedQuadrants = [
      ...(objective.quadrantes || []),
      { id: newQuadrantId, objective_id: objective.id, titulo: newQuadrant.titulo, descricao: newQuadrant.descricao, steps: stepsWithIds, completed: false },
    ]
    await fetch(`/api/objectives/${objective.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quadrantes: updatedQuadrants }),
    })
    setObjective({ ...objective, quadrantes: updatedQuadrants })
    setShowQuadrantForm(false)
    setNewQuadrant({ titulo: "", descricao: "", steps: [{ title: "", description: "" }] })
  }

  const handleCompleteQuadrant = async (quadrantId: string) => {
    if (!objective || !objective.quadrantes) return

    const updatedQuadrants = objective.quadrantes.map((q) =>
      q.id === quadrantId ? { ...q, completed: !q.completed } : q,
    )

    await fetch(`/api/objectives/${objective.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quadrantes: updatedQuadrants }),
    })

    setObjective({ ...objective, quadrantes: updatedQuadrants })
  }

  const toggleQuadrantExpanded = (id: string) => {
    setExpandedQuadrants((prev) => (prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!objective) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
          <p>Objetivo não encontrado</p>
        </div>
      </div>
    )
  }

  const totalXP = Object.values(objective.recompensasPorArea).reduce((a, b) => a + b, 0)

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-gradient-to-b from-card to-background">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" className="gap-2 mb-4" onClick={() => router.push("/objectives")}>
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2 text-balance">{objective.titulo}</h1>
                <div className="flex gap-2 flex-wrap">
                  {objective.areas.map((area) => {
                    const areaConfig = DEFAULT_AREAS.find((a) => a.value === area)
                    return (
                      <Badge key={area} className="text-sm">
                        {areaConfig?.label}
                      </Badge>
                    )
                  })}
                </div>
              </div>
              {objective.completed ? (
                <Badge className="bg-green-500">Concluído</Badge>
              ) : (
                <Button onClick={handleComplete} disabled={completing} className="gap-2">
                  {completing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Concluir Objetivo
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Descrição</CardTitle>
              </CardHeader>
              <CardContent className="text-lg text-muted-foreground">{objective.descricao}</CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Por que esse objetivo?</CardTitle>
              </CardHeader>
              <CardContent className="text-lg text-muted-foreground">{objective.porque}</CardContent>
            </Card>

            {objective.beneficios.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Benefícios</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {objective.beneficios.map((beneficio, index) => (
                      <li key={index} className="flex gap-2 text-muted-foreground">
                        <span className="text-primary font-bold">•</span>
                        {beneficio}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle>Quadrantes</CardTitle>
                <Button size="sm" variant="outline" onClick={() => setShowQuadrantForm(!showQuadrantForm)}>
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {showQuadrantForm && (
                  <div className="space-y-3 p-4 border border-border rounded-lg bg-muted/50">
                    <Input
                      placeholder="Título do quadrante"
                      value={newQuadrant.titulo}
                      onChange={(e) => setNewQuadrant({ ...newQuadrant, titulo: e.target.value })}
                    />
                    <Textarea
                      placeholder="Descrição (opcional)"
                      value={newQuadrant.descricao}
                      onChange={(e) => setNewQuadrant({ ...newQuadrant, descricao: e.target.value })}
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAddQuadrant}>
                        Criar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setShowQuadrantForm(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}

                {objective.quadrantes && objective.quadrantes.length > 0 ? (
                  <div className="space-y-3">
                    {objective.quadrantes.map((quadrant) => (
                      <div key={quadrant.id} className="border border-border rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleQuadrantExpanded(quadrant.id)}
                          className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={quadrant.completed || false}
                              onChange={() => handleCompleteQuadrant(quadrant.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-4 h-4"
                            />
                            <span className={quadrant.completed ? "line-through text-muted-foreground" : "font-medium"}>
                              {quadrant.titulo}
                            </span>
                          </div>
                          {expandedQuadrants.includes(quadrant.id) ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>

                        {expandedQuadrants.includes(quadrant.id) && (
                          <div className="border-t border-border p-4 bg-muted/20 space-y-3">
                            {quadrant.descricao && (
                              <p className="text-sm text-muted-foreground">{quadrant.descricao}</p>
                            )}
                            {quadrant.steps && quadrant.steps.length > 0 && (
                              <div className="space-y-2">
                                <p className="font-medium text-sm">Steps:</p>
                                {quadrant.steps.map((step, idx) => (
                                  <div key={idx} className="text-sm p-2 bg-background rounded border border-border/50">
                                    <p className="font-medium">{step.title}</p>
                                    <p className="text-muted-foreground text-xs mt-1">{step.description}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Nenhum quadrante adicionado ainda</p>
                )}
              </CardContent>
            </Card>

            {challenges.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Desafios Atrelados ({challenges.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {challenges.map((challenge) => (
                      <div
                        key={challenge.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50"
                      >
                        <div>
                          <p className="font-medium">{challenge.titulo}</p>
                          <p className="text-sm text-muted-foreground">{challenge.descricao}</p>
                        </div>
                        <Badge variant="secondary">{challenge.recompensa} XP</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {habits.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Hábitos Atrelados ({habits.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {habits.map((habit) => (
                      <div
                        key={habit.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50"
                      >
                        <div>
                          <p className="font-medium">{habit.titulo}</p>
                          <p className="text-sm text-muted-foreground">Mínimo: {habit.minimumstreak} dias</p>
                        </div>
                        <Badge variant="secondary">{habit.recompensa} XP</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {tasks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tarefas Atreladas ({tasks.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50"
                      >
                        <div>
                          <p className="font-medium">{task.titulo}</p>
                          {task.duedate && (
                            <p className="text-sm text-muted-foreground">
                              Vence: {new Date(task.duedate).toLocaleDateString("pt-BR")}
                            </p>
                          )}
                        </div>
                        <Badge variant="secondary">{task.recompensa} XP</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recompensas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(objective.recompensasPorArea).map(([area, xp]) => {
                  const areaConfig = DEFAULT_AREAS.find((a) => a.value === (area as any))
                  return (
                    <div
                      key={area}
                      className="flex items-center justify-between p-2 rounded bg-card border border-border"
                    >
                      <span className="text-sm font-medium">{areaConfig?.label}</span>
                      <div className="flex items-center gap-1 text-yellow-500 font-bold">
                        <Zap className="w-4 h-4" />
                        {xp}
                      </div>
                    </div>
                  )
                })}
                <div className="border-t border-border pt-3 mt-3 flex items-center justify-between font-bold">
                  <span>Total XP</span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Zap className="w-4 h-4" />
                    {totalXP}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Data de Criação:</span>
                  <p className="font-medium">{new Date(objective.data).toLocaleDateString("pt-BR")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <p className="font-medium">{objective.completed ? "Concluído" : "Em progresso"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
