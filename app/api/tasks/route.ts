import { getTasks, createTask } from "@/lib/db"
import { nanoid } from "nanoid"
import type { Task } from "@/lib/types"

export async function GET() {
  const tasks = await getTasks()
  return Response.json(tasks)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const task: Task = {
      id: nanoid(),
      ...body,
      completed: false,
    }
    await createTask(task)
    return Response.json(task, { status: 201 })
  } catch (error) {
    return Response.json({ error: "Failed to create task" }, { status: 400 })
  }
}

