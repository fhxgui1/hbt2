"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Loader2 } from "lucide-react"
import { DEFAULT_AREAS } from "@/lib/types"
import type { Objective } from "@/lib/types"

interface ChallengeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ChallengeDialog({ open, onOpenChange, onSuccess }: ChallengeDialogProps) {
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [nivel, setNivel] = useState("5")
  const [recompensa, setRecompensa] = useState("100")
  const [area, setArea] = useState<string>("desenvolvimento")
  const [objectiveId, setObjectiveId] = useState<string>("") // Adicionado atrelamento a objetivo
  const [objectives, setObjectives] = useState<Objective[]>([]) // Lista de objetivos
  const [steps, setSteps] = useState([{ title: "", description: "" }])
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

  const addStep = () => {
    setSteps([...steps, { title: "", description: "" }])
  }

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index))
  }

  const updateStep = (index: number, field: "title" | "description", value: string) => {
    const newSteps = [...steps]
    newSteps[index][field] = value
    setSteps(newSteps)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          descricao,
          nivel: Number.parseInt(nivel),
          recompensa: Number.parseInt(recompensa),
          area,
          objectiveId: objectiveId || undefined, // Incluindo atrelamento
          steps,
        }),
      })
      console.log(steps)
      if (!response.ok) throw new Error("Failed to create challenge")
      setTitulo("")
      setDescricao("")
      setNivel("5")
      setRecompensa("100")
      setArea("desenvolvimento")
      setObjectiveId("")
      setSteps([{ title: "", description: "" }])
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
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Desafio</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Aprender React"
              required
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
                <SelectItem value="none">Nenhum</SelectItem> {/* Updated value prop */}
                {objectives.map((obj) => (
                  <SelectItem key={obj.id} value={obj.id}>
                    {obj.titulo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o desafio"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nivel">Nível (0-10)</Label>
              <Input
                id="nivel"
                type="number"
                min="0"
                max="10"
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
              />
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

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Passos</Label>
              <Button type="button" variant="outline" size="sm" onClick={addStep} className="gap-1 bg-transparent">
                <Plus className="w-4 h-4" />
                Adicionar
              </Button>
            </div>
            {steps.map((step, index) => (
              <div key={index} className="space-y-2 p-3 border border-border rounded-lg">
                <Input
                  placeholder="Título do passo"
                  value={step.title}
                  onChange={(e) => updateStep(index, "title", e.target.value)}
                />
                <Textarea
                  placeholder="Descrição do passo"
                  value={step.description}
                  onChange={(e) => updateStep(index, "description", e.target.value)}
                  rows={2}
                />
                {steps.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStep(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Criar Desafio
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
