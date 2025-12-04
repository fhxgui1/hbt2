import { getHabits, createHabit } from "@/lib/db"
import { nanoid } from "nanoid"
import type { Habit } from "@/lib/types"

export async function GET() {
  const habits = await getHabits()
  return Response.json(habits)

}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Adicionar IDs aos steps caso não tenham
    const stepsWithIds = (body.steps || []).map((step: any) => ({
      ...step,
      id: step.id || Math.random().toString(36).substring(2, 9)
    }))

    const habit: Habit = {
      id: nanoid(),
      ...body,
      steps: stepsWithIds,
      completed: false,
      streak: 0,
    }
    // torage.addHabit(habit)
    await createHabit(habit)

    return Response.json(habit, { status: 201 })
  } catch (error) {
    return Response.json({ error: "Failed to create habit" }, { status: 400 })
  }
}




