"use client"

import { useEffect, useState } from "react"
import { ChallengeSummary } from "./challenge-summary"
import { ChallengeCard } from "./challenge-card"
import { ChallengeDialog } from "./challenge-dialog"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Challenge } from "@/lib/types"

export function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchChallenges = async () => {
    try {
      const response = await fetch("/api/challenges")
      if (!response.ok) throw new Error("Failed to fetch challenges")
      const data = await response.json()
      setChallenges(data)
    } catch {
      setChallenges([
        {
          id: "1",
          titulo: "Primeira API",
          nivel: 3,
          descricao: "Crie sua primeira API REST com Node.js",
          steps: [
  ],
          conquista: "Desenvolvedor API Jr",
          data: "2025-01-15",
          recompensa: 100,
          area: "desenvolvimento",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChallenges()
  }, [])

  const handleChallengeCreated = () => {
    fetchChallenges()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-gradient-to-b from-card to-background">
        <div className="container mx-auto px-4 py-12 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-balance">Desafios</h1>
            <p className="text-muted-foreground">Complete desafios, ganhe experiência e desbloqueie conquistas</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Desafio
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <ChallengeSummary challenges={challenges} />

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Todos os Desafios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </div>
      </div>

      <ChallengeDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSuccess={handleChallengeCreated} />
    </main>
  )
}
