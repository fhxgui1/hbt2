import * as db from "@/lib/db"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const objective = await db.getObjective(id)
  return objective ? Response.json(objective) : Response.json({ error: "Not found" }, { status: 404 })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const updated = await db.updateObjective(id, body)
  return updated ? Response.json(updated) : Response.json({ error: "Not found" }, { status: 404 })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const deleted = await db.deleteObjective(id)
    return Response.json(deleted)
  } catch (error) {
    return Response.json({ error: "Failed to delete objective" }, { status: 400 })
  }
}
