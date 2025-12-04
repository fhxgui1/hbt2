"use client"

import { useEffect, useState } from "react"
import { ObjectiveCard } from "./objective-card"
import { ObjectiveDialog } from "./objective-dialog"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Objective } from "@/lib/types"

export function ObjectivesPage() {
  const [objectives, setObjectives] = useState<Objective[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchObjectives = async () => {
    try {
      const response = await fetch("/api/objectives")
      if (!response.ok) throw new Error("Failed to fetch objectives")
      const data = await response.json()
      setObjectives(data)
    } catch {
      setObjectives([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchObjectives()
  }, [])

  const handleObjectiveCreated = () => {
    console.log(objectives)
    fetchObjectives()
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
            <h1 className="text-4xl font-bold mb-2 text-balance">Objetivos</h1>
            <p className="text-muted-foreground">Clique em um objetivo para ver detalhes e acompanhar progresso</p>
         <p>aqui cabe diferenciar dos outros ja que objetivo e diferente</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Objetivo
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {objectives.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Nenhum objetivo criado ainda</p>
            <Button onClick={() => setIsDialogOpen(true)}>Criar primeiro objetivo</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map((objective) => (
              <ObjectiveCard key={objective.id} objective={objective} />
            ))}
          </div>
        )}
      </div>

      <ObjectiveDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSuccess={handleObjectiveCreated} />
    </main>
  )
}
