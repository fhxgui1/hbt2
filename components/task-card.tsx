"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, Calendar } from "lucide-react"
import type { Task } from "@/lib/types"
import { DEFAULT_AREAS } from "@/lib/types"

interface TaskCardProps {
  task: Task
  onToggle?: (id: string) => void
}

export function TaskCard({ task, onToggle }: TaskCardProps) {
  const areaConfig = DEFAULT_AREAS.find((a) => a.value === task.area)

  const handleComplete = async () => {
    if (onToggle) {
      onToggle(task.id)
    } else {
      // Faz requisição à API se não houver callback
      await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      })
    }
  }
  interface Task {
  duedata: string | Date; // Ajuste conforme seu modelo
}


// const today = new Date();
// today.setHours(0, 0, 0, 0);
// const due = new Date(task.duedata);
// due.setHours(0, 0, 0, 0);
// const isToday = due.getTime() === today.getTime();
// const isPast = due.getTime() < today.getTime();
// const result = isToday ? true : false;

  return (
    <Card className={task.completed ? "opacity-60" : ""}>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h3 className={`font-bold ${task.completed ? "line-through" : ""}`}>{task.titulo}</h3>
            <Badge variant="secondary" className="mt-2">
              {areaConfig?.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {task.descricao && <p className="text-sm text-muted-foreground">{task.descricao}</p>}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {task.duedate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(task.duedate).toLocaleDateString("pt-BR")}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-yellow-500" />
            {task.recompensa} XP
          </div>
        </div>

        <Button
          className="w-full mt-2"
          size="sm"
          variant={task.completed ? "outline" : "default"}
          onClick={handleComplete}
        >
          {task.completed ? "Desmarcar" : "Completar"}
        </Button>
      </CardContent>
    </Card>
  )
}
