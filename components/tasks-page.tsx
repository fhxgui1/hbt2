"use client"

import { useEffect, useState } from "react"
import { TaskCard } from "./task-card"
import { TaskDialog } from "./task-dialog"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Task } from "@/lib/types"

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks")
      if (!response.ok) throw new Error("Failed to fetch tasks")
      const data = await response.json()
      setTasks(data)
      console.log(data)
    } catch {
      setTasks([])
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchTasks()
  }, [])

  const handleTaskCreated = () => {
    fetchTasks()
  }

  const handleToggle = async (taskId: string) => {
    // Atualiza o estado local imediatamente para feedback visual
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    )

    // Faz a requisição para o backend
    try {
      const task = tasks.find((t) => t.id === taskId)
      if (!task) return

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      })

      if (!response.ok) {
        // Se falhar, reverte a mudança
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
          )
        )
      }
    } catch (error) {
      // Se falhar, reverte a mudança
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        )
      )
    }
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
            <h1 className="text-4xl font-bold mb-2 text-balance">Tarefas</h1>
            <p className="text-muted-foreground">Gerencie suas tarefas do dia a dia</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Nenhuma tarefa criada ainda</p>
            <Button onClick={() => setIsDialogOpen(true)}>Criar primeira tarefa</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onToggle={handleToggle} />
            ))}
          </div>
        )}
      </div>

      <TaskDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSuccess={handleTaskCreated} />
    </main>
  )
}
