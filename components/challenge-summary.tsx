import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Target, TrendingUp } from "lucide-react"
import type { Challenge } from "@/lib/types"

interface ChallengeSummaryProps {
  challenges: Challenge[]
}

export function ChallengeSummary({ challenges }: ChallengeSummaryProps) {
  const totalChallenges = challenges.length
  const completedChallenges = challenges.filter((c) => c.completed).length
  const totalXP = challenges.reduce((sum, c) => sum + (c.completed ? c.recompensa : 0), 0)
  const avgLevel =
    totalChallenges > 0 ? (challenges.reduce((sum, c) => sum + c.nivel, 0) / totalChallenges).toFixed(1) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Desafios</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalChallenges}</div>
          <p className="text-xs text-muted-foreground">{completedChallenges} completados</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">XP Total</CardTitle>
          <Zap className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalXP}</div>
          <p className="text-xs text-muted-foreground">ganho nos desafios</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dificuldade Média</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgLevel}</div>
          <p className="text-xs text-muted-foreground">de 10</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0}%
          </div>
          <p className="text-xs text-muted-foreground">de todos os desafios</p>
        </CardContent>
      </Card>
    </div>
  )
}
