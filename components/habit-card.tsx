"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Flame, Zap } from "lucide-react"
import type { Habit } from "@/lib/types"
import { DEFAULT_AREAS } from "@/lib/types"
import { HabitModal } from "./habit-modal"

interface HabitCardProps {
  habit: Habit
}

export function HabitCard({ habit }: HabitCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [modalOpen, setModalOpen] = useState(false) 
  const areaConfig = DEFAULT_AREAS.find((a) => a.value === habit.area)


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-lg">{habit.titulo}</h3>
              {habit.descricao && <p className="text-xs text-muted-foreground mt-1">{habit.descricao}</p>}
            </div>
            <Badge variant="secondary">{areaConfig?.label}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Flame className="w-4 h-4 text-orange-500" />
              Streak: {habit.streak || 0} dias
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Zap className="w-4 h-4 text-yellow-500" />
              {habit.recompensa} XP
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium">Mínimo: {habit.minimumstreak} dias</p>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${Math.min(((habit.streak || 0) / habit.minimumstreak) * 100, 100)}%` }}
              />
            </div>
          </div>

          {habit.steps && habit.steps.length > 0 && (
            <div className="pt-2 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="w-full justify-between"
              >
                <span className="text-sm font-medium">{habit.steps.length} passos</span>
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>

              {expanded && (
                <div className="mt-3 space-y-2">
                  {habit.steps.map((step, idx) => (
                    <div key={idx} className="text-xs p-2 bg-muted rounded">
                      <p className="font-medium">{step.title}</p>
                      <p className="text-muted-foreground mt-1">{step.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <Button
            className="w-full mt-2"
            size="sm"
            variant="default"
            onClick={() => setModalOpen(true)} // Abre modal ao clicar
          >
            Registrar Hoje
          </Button>
        </CardContent>
      </Card>

      <HabitModal habit={habit} open={modalOpen} onOpenChange={setModalOpen} />
    </>
  )
}
