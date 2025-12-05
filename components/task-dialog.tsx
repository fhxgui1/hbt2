"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { DEFAULT_AREAS } from "@/lib/types"
import type { Objective } from "@/lib/types"

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function TaskDialog({ open, onOpenChange, onSuccess }: TaskDialogProps) {
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [area, setArea] = useState<string>("produtividade")
  const [recompensa, setRecompensa] = useState("10")
  const [duedate, setduedate] = useState(new Date().toISOString().split('T')[0])
  const [objectiveId, setObjectiveId] = useState<string>("") // Adicionado atrelamento a objetivo
  const [objectives, setObjectives] = useState<Objective[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      const fetchObjectives = async () => {
        const res = await fetch("/api/objectives")
        const data = await res.json()
        setObjectives(data)
      }
      fetchObjectives()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          descricao,
          area,
          recompensa: Number.parseInt(recompensa),
          objectiveId: objectiveId || undefined,
          duedate,
        }),
      })
      if (!response.ok) throw new Error("Failed to create task")
      setTitulo("")
      setDescricao("")
      setArea("produtividade")
      setRecompensa("10")
      setduedate(new Date().toISOString().split('T')[0])
      setObjectiveId("")
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Tarefa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Escrever relatório"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva a tarefa"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Área de Atuação</Label>
            <Select value={area} onValueChange={(value) => setArea(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEFAULT_AREAS.map((a) => (
                  <SelectItem key={a.value} value={a.value}>
                    {a.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="objective">Atrelar a um Objetivo (Opcional)</Label>
            <Select value={objectiveId} onValueChange={(value) => setObjectiveId(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um objetivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {objectives.map((obj) => (
                  <SelectItem key={obj.id} value={obj.id}>
                    {obj.titulo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duedate">Data de Vencimento</Label>
              <Input id="duedate" type="date" value={duedate} onChange={(e) => setduedate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recompensa">Recompensa (XP)</Label>
              <Input
                id="recompensa"
                type="number"
                min="0"
                value={recompensa}
                onChange={(e) => setRecompensa(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Criar Tarefa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
