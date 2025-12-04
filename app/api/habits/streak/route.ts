import { getHabits,UpdateHabitStreak } from "@/lib/db"
import { nanoid } from "nanoid"
import type { Habit } from "@/lib/types"


export async function POST(request: Request) {
  try {
    const body = await request.json()
    const habit: Habit = {
      id: nanoid(),
      ...body,
      completed: false,
      streak: 0,
    }
    UpdateHabitStreak(habit.id)

    return Response.json(habit, { status: 201 })
  } catch (error) {
    return Response.json({ error: "Failed to create habit" }, { status: 400 })
  }
}




