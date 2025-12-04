"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Zap, Calendar, Gift } from "lucide-react"
import type { Challenge } from "@/lib/types"
import { DEFAULT_AREAS } from "@/lib/types"

interface ChallengeCardProps {
  challenge: Challenge
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const [expanded, setExpanded] = useState(false)
  const areaConfig = DEFAULT_AREAS.find((a) => a.value === challenge.area)

  const levelColor = {
    easy: "bg-green-500/20 text-green-700 dark:text-green-400",
    medium: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
    hard: "bg-orange-500/20 text-orange-700 dark:text-orange-400",
    expert: "bg-red-500/20 text-red-700 dark:text-red-400",
  }

  const getLevel = (nivel: number) => {
    if (nivel <= 2) return "easy"
    if (nivel <= 4) return "medium"
    if (nivel <= 7) return "hard"
    return "expert"
  }

  return (
    <Link href={`/challenges/${challenge.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-lg">{challenge.titulo}</h3>
              <CardDescription className="text-xs mt-1">{areaConfig?.label}</CardDescription>
            </div>
            <Badge className={levelColor[getLevel(challenge.nivel)] as string}>Nível {challenge.nivel}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{challenge.descricao}</p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-500" />
              {challenge.recompensa} XP
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(challenge.data).toLocaleDateString("pt-BR")}
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                setExpanded(!expanded)
              }}
              className="w-full justify-between"
            >
              <span className="text-sm font-medium">{challenge.steps.length} passos</span>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>

            {expanded && (
              <div className="mt-3 space-y-2">
                {challenge.steps.map((step, idx) => (
                  <div key={idx} className="text-xs p-2 bg-muted rounded">
                    <p className="font-medium">{step.title}</p>
                    <p className="text-muted-foreground mt-1">{step.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{challenge.conquista}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
