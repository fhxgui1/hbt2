import * as db from "@/lib/db"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  // return Response.json(body, { status: 202 })
  const updated = await db.updateHabit(id, body.completedSteps, body.lastCompleted  )
  return updated ? Response.json(updated) : Response.json({ error: "Not found" }, { status: 404 })
}

