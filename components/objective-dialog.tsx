"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, X } from "lucide-react"
import { AREAS } from "@/lib/types"
import type { Area } from "@/lib/types"

interface ObjectiveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ObjectiveDialog({ open, onOpenChange, onSuccess }: ObjectiveDialogProps) {
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [porQue, setPorQue] = useState("")
  const [beneficios, setBeneficios] = useState<string[]>([""])
  const [selectedAreas, setSelectedAreas] = useState<Area[]>(["desenvolvimento"])
  const [recompensasPorArea, setRecompensasPorArea] = useState<Record<Area, string>>({
    desenvolvimento: "100",
    fitness: "50",
    financeiro: "50",
    educacao: "100",
    saude: "75",
    produtividade: "75",
    criatividade: "75",
  })
  const [loading, setLoading] = useState(false)

  const handleAddBeneficio = () => {
    setBeneficios([...beneficios, ""])
  }

  const handleRemoveBeneficio = (index: number) => {
    setBeneficios(beneficios.filter((_, i) => i !== index))
  }

  const handleUpdateBeneficio = (index: number, value: string) => {
    const newBeneficios = [...beneficios]
    newBeneficios[index] = value
    setBeneficios(newBeneficios)
  }

  const handleToggleArea = (area: Area) => {
    setSelectedAreas((prev) => {
      if (prev.includes(area)) {
        return prev.filter((a) => a !== area)
      }
      return [...prev, area]
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedAreas.length === 0) {
      alert("Selecione pelo menos uma área")
      return
    }

    setLoading(true)
    try {
      const recompensas: Record<Area, number> = {} as Record<Area, number>
      selectedAreas.forEach((area) => {
        recompensas[area] = Number.parseInt(recompensasPorArea[area] || "0")
      })

      const response = await fetch("/api/objectives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          descricao,
          porQue,
          beneficios: beneficios.filter((b) => b.trim()),
          areas: selectedAreas,
          recompensasPorArea: recompensas,
          data: new Date().toISOString().split("T")[0],
        }),
      })
      if (!response.ok) throw new Error("Failed to create objective")

      setTitulo("")
      setDescricao("")
      setPorQue("")
      setBeneficios([""])
      setSelectedAreas(["desenvolvimento"])
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
          <DialogTitle>Criar Novo Objetivo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Aprender TypeScript"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva seu objetivo"
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="porQue">Por que esse objetivo?</Label>
            <Textarea
              id="porQue"
              value={porQue}
              onChange={(e) => setPorQue(e.target.value)}
              placeholder="Explique a importância e motivação"
              rows={2}
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Benefícios</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddBeneficio}>
                + Adicionar
              </Button>
            </div>
            {beneficios.map((beneficio, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={beneficio}
                  onChange={(e) => handleUpdateBeneficio(index, e.target.value)}
                  placeholder={`Benefício ${index + 1}`}
                />
                {beneficios.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveBeneficio(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Áreas Afetadas</Label>
            <div className="grid grid-cols-2 gap-2">
              {AREAS.map((area) => (
                <button
                  key={area.value}
                  type="button"
                  onClick={() => handleToggleArea(area.value)}
                  className={`p-2 rounded border text-sm transition ${
                    selectedAreas.includes(area.value)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {area.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Recompensa de XP por Área</Label>
            {selectedAreas.map((area) => {
              const areaLabel = AREAS.find((a) => a.value === area)?.label
              return (
                <div key={area} className="flex items-center gap-2">
                  <Label htmlFor={`xp-${area}`} className="min-w-[120px]">
                    {areaLabel}
                  </Label>
                  <Input
                    id={`xp-${area}`}
                    type="number"
                    min="0"
                    value={recompensasPorArea[area]}
                    onChange={(e) => setRecompensasPorArea({ ...recompensasPorArea, [area]: e.target.value })}
                  />
                </div>
              )
            })}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Criar Objetivo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
