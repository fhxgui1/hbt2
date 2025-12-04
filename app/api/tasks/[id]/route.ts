import * as db from "@/lib/db"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const updated = await db.updateTask(id, body)
  return updated ? Response.json(updated) : Response.json({ error: "Not found" }, { status: 404 })
}





