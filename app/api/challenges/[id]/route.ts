import * as db from "@/lib/db"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const challenge = await db.getChallenge(id)
  return challenge ? Response.json(challenge) : Response.json({ error: "Not found" }, { status: 404 })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const updated = await db.updateChallenge(id, body)
  return updated ? Response.json(updated) : Response.json({ error: "Not found" }, { status: 404 })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db.deleteChallenge(id)
  return Response.json({ success: true })
}
