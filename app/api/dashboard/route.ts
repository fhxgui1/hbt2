import * as db from "@/lib/db"
import { DEFAULT_AREAS } from "@/lib/types"
import type { AreaScore } from "@/lib/types"

export async function GET() {
  const challenges = await db.getChallenges()
  const objectives = await db.getObjectives()
  const habits = await db.getHabits()
  const tasks = await db.getTasks()
  const achievements = await db.getAchievements()

  const areaScores: AreaScore[] = DEFAULT_AREAS.map((area) => {
    let totalPoints = 0
    let completedItems = 0
    let totalItems = 0

    // Desafios
    const areaItems = challenges.filter((c) => c.area === area.value)
    totalItems += areaItems.length
    const completedChallenges = areaItems.filter((c) => c.completed)
    completedItems += completedChallenges.length
    completedChallenges.forEach((c) => {
      totalPoints += c.recompensa
    })

    // Objetivos (podem estar em múltiplas áreas)
    const areaObjectives = objectives.filter((o) => o.areas.includes(area.value))
    totalItems += areaObjectives.length
    const completedObjectives = areaObjectives.filter((o) => o.completed)
    completedItems += completedObjectives.length
    completedObjectives.forEach((o) => {
      totalPoints += o.recompensasPorArea[area.value] || 0
    })

    // Hábitos
    const areaHabits = habits.filter((h) => h.area === area.value)
    totalItems += areaHabits.length
    const completedHabits = areaHabits.filter((h) => h.completed)
    completedItems += completedHabits.length
    completedHabits.forEach((h) => {
      totalPoints += h.recompensa
    })

    // Tarefas
    const areaTasks = tasks.filter((t) => t.area === area.value)
    totalItems += areaTasks.length
    const completedTasks = areaTasks.filter((t) => t.completed)
    completedItems += completedTasks.length
    completedTasks.forEach((t) => {
      totalPoints += t.recompensa
    })

    const level = Math.floor(totalPoints / 100) + 1

    return {
      area: area.value,
      totalPoints,
      completedItems,
      totalItems,
      achievements: [],
      level,
    }
  })

  const totalXP = await db.getTotalXP()

  return Response.json({
    areaScores: areaScores.filter((s) => s.totalItems > 0),
    achievements,
    totalXP,
  })
}
