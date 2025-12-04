"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { Habit } from "@/lib/types"

interface HabitModalProps {
  habit: Habit | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm?: (completedSteps: string[]) => void
}

export function HabitModal({ habit, open, onOpenChange, onConfirm }: HabitModalProps) {
  const [completedSteps, setCompletedSteps] = useState<string[]>(habit?.completedSteps || [])

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => (prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]))
  }

  const handleConfirm = async () => {
    console.log(completedSteps)
    console.log(habit)
    if (onConfirm) {
      onConfirm(completedSteps)
    } else if (habit) {
      await fetch(`/api/habits/${habit.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          habit_id: habit.id,
          completedSteps,
          lastCompleted: new Date().toISOString(),
        }),
      })
    }
    onOpenChange(false)
    setCompletedSteps([])    
  }

  if (!habit) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar: {habit.titulo}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">Selecione os passos que você completou hoje:</p>

          {habit.steps && habit.steps.length > 0 ? (
            <div className="space-y-3">
              {habit.steps.map((step) => (
                <div key={step.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <Checkbox
                    id={`step-${step.id}`}
                    checked={completedSteps.includes(step.id || "")}
                    onCheckedChange={() => toggleStep(step.id || "")}
                    className="mt-1"
                  />
                  <label htmlFor={`step-${step.id}`} className="flex-1 cursor-pointer">
                    <p className="font-medium text-sm">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">Este hábito não possui passos definidos.</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
