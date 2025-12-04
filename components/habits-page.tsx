"use client"

import { useEffect, useState } from "react"
import { HabitCard } from "./habit-card"
import { HabitDialog } from "./habit-dialog"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Habit } from "@/lib/types"

export function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchHabits = async () => {
        function diffDays(date1: string, date2: string) {
          const d1 = new Date(date1);
          const d2 = new Date(date2);
          const diff = (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);
          return Math.floor(diff);
  }
      const hoje = new Date().toISOString().split("T")[0];

    try {
      const response = await fetch("/api/habits")      

      if (!response.ok) throw new Error("Failed to fetch habits")
      const data = await response.json()
      setHabits(data)
      console.log(data)
 // Log detalhado de cada hábito
      data?.forEach((habit: any, index: number) => {
          let cc=0
          let contador=0
          for (const h of habit.steps) {
              const diff= diffDays(h.datacomplete, hoje)
              if(diff>1){
                contador=1
              }else if(diff<=1){
                cc=1
              }
          }
          
          if(contador==1 && cc==0){
              async function updd(id:number){
                  const response = await fetch(`/api/habits/streak`, {
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json"
                      },
                      body: JSON.stringify({
                          id: habit.id,
                          streak: 0
                      })
                  })
                  if (!response.ok) {
                      throw new Error(`HTTP error! status: ${response.status}`)
                  }

                  const data = await response.json()
              }
              updd(habit.id)                    
          }
      })
    } catch {
      setHabits([])
    } finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    fetchHabits()
  }, [])

  const handleHabitCreated = () => {
    fetchHabits()
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
            <h1 className="text-4xl font-bold mb-2 text-balance">Hábitos</h1>
            <p className="text-muted-foreground">Construa hábitos consistentes e acompanhe seu progresso</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Hábito
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {habits.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Nenhum hábito criado ainda</p>
            <Button onClick={() => setIsDialogOpen(true)}>Criar primeiro hábito</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        )}
      </div>

      <HabitDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSuccess={handleHabitCreated} />
    </main>
  )
}
