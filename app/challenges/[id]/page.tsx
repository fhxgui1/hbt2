"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Zap, Calendar, Gift, CheckCircle2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import type { Challenge } from "@/lib/types"
import { DEFAULT_AREAS } from "@/lib/types"

export default function ChallengePage() {
  const params = useParams()
  const router = useRouter()
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [loading, setLoading] = useState(true)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const throttleTimerRef = useRef<{ [key: string]: NodeJS.Timeout }>({})

  useEffect(() => {
    const fetchChallenge = async () => {
      const res = await fetch(`/api/challenges/${params.id}`)
      const data = await res.json()
      setChallenge(data)
      setCompletedSteps(data.steps.filter((s: any) => s.completed).map((s: any) => s.id))
      setLoading(false)
    }
    fetchChallenge()
  }, [params.id])

  const handleStepToggle = (stepId: string) => {
    // Update UI immediately
    const newCompleted = completedSteps.includes(stepId)
      ? completedSteps.filter((id) => id !== stepId)
      : [...completedSteps, stepId]

    setCompletedSteps(newCompleted)

    // Clear existing timer for this step
    if (throttleTimerRef.current[stepId]) {
      clearTimeout(throttleTimerRef.current[stepId])
    }

    throttleTimerRef.current[stepId] = setTimeout(async () => {
      try {
        console.log('fgff')
        await fetch(`/api/challenges/${challenge?.id}/steps/${stepId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: newCompleted.includes(stepId) ,
            challengeId: challenge?.id,
            stepId: stepId
          }),
        })
      } catch (error) {
        console.error("Failed to update step:", error)
      }
      delete throttleTimerRef.current[stepId]
    }, 300)
  }

  const handleComplete = async () => {
    await fetch(`/api/challenges/${challenge?.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        completed: true,
        steps: challenge?.steps.map((s) => ({
          ...s,
          completed: completedSteps.includes(s.id || ""),
        })),
      }),
    })
    router.push("/challenges")
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  if (!challenge) return <div className="flex items-center justify-center min-h-screen">Desafio não encontrado</div>

  const areaConfig = DEFAULT_AREAS.find((a) => a.value === challenge.area)
  const progress = (completedSteps.length / challenge.steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/challenges">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-3xl mb-2">{challenge.titulo}</CardTitle>
                  <Badge variant="outline">{areaConfig?.label}</Badge>
                </div>
                {challenge.completed && <CheckCircle2 className="w-8 h-8 text-green-500" />}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{challenge.descricao}</p>

              <div className="grid grid-cols-3 gap-4 py-4 border-y border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Nível de Dificuldade</p>
                  <p className="text-2xl font-bold">{challenge.nivel}/10</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Recompensa
                  </p>
                  <p className="text-2xl font-bold">{challenge.recompensa} XP</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Data
                  </p>
                  <p className="text-sm font-bold">{new Date(challenge.data).toLocaleDateString("pt-BR")}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-4 h-4 text-primary" />
                  <span className="font-medium">Conquista Desbloqueada</span>
                </div>
                <p className="text-sm text-muted-foreground pl-6">{challenge.conquista}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  Passos ({completedSteps.length}/{challenge.steps.length})
                </span>
                <div className="w-32 h-2 bg-muted rounded-full">
                  <div className="h-2 bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {challenge.steps.map((step) => (
                  <div key={step.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50">
                    <Checkbox
                      id={`step-${step.id}`}
                      checked={completedSteps.includes(step.id || "")}
                      onCheckedChange={() => handleStepToggle(step.id || "")}
                      className="mt-1"
                    />
                    <label htmlFor={`step-${step.id}`} className="flex-1 cursor-pointer">
                      <p className="font-medium">{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleComplete}
            className="w-full h-12 text-lg"
            disabled={completedSteps.length !== challenge.steps.length}
          >
            {completedSteps.length === challenge.steps.length ? "Completar Desafio" : "Complete todos os passos"}
          </Button>
        </div>
      </div>
    </div>
  )
}
