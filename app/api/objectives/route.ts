import * as db from "@/lib/db"
import { nanoid } from "nanoid"
import type { Objective } from "@/lib/types"

export async function GET() {
  const objectives = await db.getObjectives()
  return Response.json(objectives)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const objective: Objective = {
      id: nanoid(),
      ...body,
      completed: false,
    }
    const created = await db.createObjective(objective)
    return Response.json(created, { status: 201 })
  } catch (error) {
    return Response.json({ error: "Failed to create objective" }, { status: 400 })
  }
}
