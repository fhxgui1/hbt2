"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Zap, Trophy } from "lucide-react"
import type { Challenge, Objective, Habit, Task } from "@/lib/types"
import { DEFAULT_AREAS } from "@/lib/types"
import { ChallengeCard } from "@/components/challenge-card"
import { ObjectiveCard } from "@/components/objective-card"
import { HabitCard } from "@/components/habit-card"
import { TaskCard } from "@/components/task-card"

export default function AreaPage() {
  const params = useParams()
  const areaId = params.id as string
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [objectives, setObjectives] = useState<Objective[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [totalXP, setTotalXP] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [chRes, objRes, habRes, taskRes, dashRes] = await Promise.all([
        fetch("/api/challenges"),
        fetch("/api/objectives"),
        fetch("/api/habits"),
        fetch("/api/tasks"),
        fetch("/api/dashboard"),
      ])

      const challenges = await chRes.json()
      const objectives = await objRes.json()
      const habits = await habRes.json()
      const tasks = await taskRes.json()
      const dashboard = await dashRes.json()

      setChallenges(challenges.filter((c: Challenge) => c.area === areaId))
      setObjectives(objectives.filter((o: Objective) => o.areas.includes(areaId)))
      setHabits(habits.filter((h: Habit) => h.area === areaId))
      setTasks(tasks.filter((t: Task) => t.area === areaId))

      const areaScore = dashboard.areaScores.find((a: any) => a.area === areaId)
      setTotalXP(areaScore?.totalPoints || 0)
      setLoading(false)
    }
    fetchData()
  }, [areaId])

  const areaConfig = DEFAULT_AREAS.find((a) => a.value === areaId)
  const level = Math.floor(totalXP / 100) + 1

  if (loading) return <div className="flex items-center justify-center min-h-screen">Carregando...</div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/areas">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Áreas
          </Button>
        </Link>

        <div className="space-y-6">
          {/* Header com info da área */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-3xl">{areaConfig?.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Nível</p>
                  <p className="text-3xl font-bold">{level}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Zap className="w-3 h-3" /> XP Total
                  </p>
                  <p className="text-3xl font-bold">{totalXP}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Próximo Nível</p>
                  <p className="text-sm font-medium">{level * 100 - totalXP} XP</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> Itens Ativos
                  </p>
                  <p className="text-2xl font-bold">
                    {challenges.length + objectives.length + habits.length + tasks.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Desafios */}
          {challenges.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Desafios ({challenges.length})</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {challenges.map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            </div>
          )}

          {/* Objetivos */}
          {objectives.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Objetivos ({objectives.length})</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {objectives.map((objective) => (
                  <ObjectiveCard key={objective.id} objective={objective} />
                ))}
              </div>
            </div>
          )}

          {/* Hábitos */}
          {habits.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Hábitos ({habits.length})</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {habits.map((habit) => (
                  <HabitCard key={habit.id} habit={habit} />
                ))}
              </div>
            </div>
          )}

          {/* Tarefas */}
          {tasks.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Tarefas ({tasks.length})</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {challenges.length === 0 && objectives.length === 0 && habits.length === 0 && tasks.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Nenhum item nesta área ainda. Crie seu primeiro!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
