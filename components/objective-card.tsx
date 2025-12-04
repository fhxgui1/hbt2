"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Calendar, ArrowRight } from "lucide-react"
import type { Objective } from "@/lib/types"
import { AREAS } from "@/lib/types"
import Link from "next/link"

interface ObjectiveCardProps {
  objective: Objective
}

export function ObjectiveCard({ objective }: ObjectiveCardProps) {
  const totalXP = Object.values(objective.recompensasPorArea).reduce((a, b) => a + b, 0)

  return (
    <Link href={`/objectives/${objective.id}`}>
      <Card className="cursor-pointer transition hover:shadow-lg hover:border-primary/50">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-lg">{objective.titulo}</h3>
            <div className="flex gap-1 flex-wrap justify-end">
              {objective.areas.slice(0, 2).map((area) => {
                const areaConfig = AREAS.find((a) => a.value === area)
                return (
                  <Badge key={area} variant="secondary" className="text-xs">
                    {areaConfig?.label}
                  </Badge>
                )
              })}
              {objective.areas.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{objective.areas.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{objective.descricao}</p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-500" />
              {totalXP} XP
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(objective.data).toLocaleDateString("pt-BR")}
            </div>
          </div>

          <div className="flex items-center gap-2 text-primary text-sm font-medium pt-2">
            Ver detalhes <ArrowRight className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
