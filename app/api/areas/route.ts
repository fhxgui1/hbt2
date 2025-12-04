import * as db from "@/lib/db"
import { nanoid } from "nanoid"
import type { CustomArea } from "@/lib/types"

export async function POST(request: Request) {
  const body = await request.json()
  const { name, color } = body

  const newArea: CustomArea = {
    id: nanoid(),
    name,
    color,
    totalXP: 0,
  }

  const area = await db.createCustomArea(newArea)
  return Response.json(area)
}

export async function GET() {
  const areas = await db.getCustomAreas()
  return Response.json(areas)
}
