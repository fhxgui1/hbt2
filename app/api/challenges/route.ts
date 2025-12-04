import * as db from "@/lib/db"
import { nanoid } from "nanoid"
import type { Challenge } from "@/lib/types"

export async function GET() {
  const challenges = await db.getChallenges()
  return Response.json(challenges)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // console.log(body)
    const challenge: Challenge = {
      id: nanoid(),
      ...body,
      completed: false,
    }
    const created = await db.createChallenge(challenge)

    return Response.json(created, { status: 201 })
    // return Response.json(created, { status: 201 })
  } catch (error) {
    return Response.json({ error: "Failed to create challenge" }, { status: 400 })
  }
}




