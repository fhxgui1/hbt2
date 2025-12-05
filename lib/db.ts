import type { Challenge, Quadrant_step, Habit_steps, habit_completed_steps, Objective, Habit, Task, Achievement, CustomArea, Step, Quadrant } from "./types"
import { neon } from "@neondatabase/serverless";
import "dotenv/config";

const sql = neon(process.env.DATABASE_URL!);



export async function getChallenges(): Promise<Challenge[]> {
  const challenges = await sql`
    SELECT * FROM challenges ORDER BY id;
  ` as Challenge[];
  const steps = await sql`
    SELECT * FROM challenge_steps;
  ` as Step[]

  return challenges.map((c) => ({
    ...c,
    steps: steps.filter((s) => s.challenge_id === c.id),
  }));

}

export async function getChallenge(id: string): Promise<Challenge | undefined> {
  const [challenge] = await sql`
    SELECT * FROM challenges WHERE id = ${id};
  ` as Challenge[];

  if (!challenge) return undefined;

  const steps = await sql`
    SELECT * FROM challenge_steps WHERE challenge_id = ${id};
  ` as Step[]

  return { ...challenge, steps };
}

export async function createChallenge(challenge: Challenge): Promise<Challenge> {
  const { id, titulo, nivel, descricao, conquista, data, recompensa, area, completed } = challenge;
  // console.log(challenge)

  await sql`
    INSERT INTO challenges (id, titulo, nivel, descricao, conquista, data, recompensa, area, completed)
    VALUES (${id}, ${titulo}, ${nivel}, ${descricao}, ${conquista}, ${data}, ${recompensa}, ${area}, ${completed});
  `;

  for (const step of challenge.steps) {
    const idd = Math.random() * 10

    await sql`
      INSERT INTO challenge_steps (id, challenge_id, title, description)
      VALUES (${idd}, ${id}, ${step.title}, ${step.description});
    `;
    //  await sql`
    //       INSERT INTO challenge_steps (id, challenge_id, title, description)
    //       VALUES (f, f, f, f);
    //     `;
  }
  return challenge;
}

export async function updateChallenge(id: string, updates: Partial<Challenge>): Promise<Challenge | null> {
  const existing = await getChallenge(id);
  if (!existing) return null;

  const updated = { ...existing, ...updates };

  await sql`
    UPDATE challenges SET
      titulo = ${updated.titulo},
      nivel = ${updated.nivel},
      descricao = ${updated.descricao},
      conquista = ${updated.conquista},
      data = ${updated.data},
      recompensa = ${updated.recompensa},
      area = ${updated.area},
      completed = ${updated.completed}
    WHERE id = ${id};
  `;

  return updated;
}

export async function deleteChallenge(id: string): Promise<void> {
  await sql`DELETE FROM challenge_steps WHERE challenge_id = ${id};`;
  await sql`DELETE FROM challenges WHERE id = ${id};`;
}

export async function updateChallengeStep(challengeId: string, stepId: string, completed: boolean): Promise<Step | null> {
  await sql`
    UPDATE challenge_steps 
    SET completed = ${completed}
    WHERE challenge_id = ${challengeId} AND id = ${stepId};
  `;

  const [updated] = await sql`
    SELECT * FROM challenge_steps 
    WHERE challenge_id = ${challengeId} AND id = ${stepId};
  ` as Step[];

  return updated || null;
}

export async function getObjectives(): Promise<Objective[]> {
  const objectives = await sql`SELECT * FROM objectives;` as Objective[];
  const benefits = await sql`SELECT * FROM objective_benefits;` as { objective_id: string; beneficio: string }[];
  const areas = await sql`SELECT * FROM objective_areas;` as { objective_id: string; area: string }[];
  const rewards = await sql`SELECT * FROM objective_rewards_per_area;` as { objective_id: string; area: string; recompensa: number }[];
  const quadrants = await sql`SELECT * FROM objective_quadrants;` as Quadrant[];
  const steps = await sql`SELECT * FROM objective_quadrant_steps;` as Quadrant_step[];

  return objectives.map((o) => ({
    ...o,
    beneficios: benefits.filter((b) => b.objective_id === o.id).map((b) => b.beneficio),
    areas: areas.filter((a) => a.objective_id === o.id).map((a) => a.area),
    recompensasPorArea: rewards
      .filter((r) => r.objective_id === o.id)
      .reduce((acc, r) => ({ ...acc, [r.area]: r.recompensa }), {}),
    quadrantes: quadrants
      .filter((q) => q.objective_id === o.id)
      .map((q) => ({
        ...q,
        steps: steps.filter((s) => s.quadrant_id === q.id),
      })),
  }));
}

export async function getObjective(id: string): Promise<Objective | undefined> {
  const list = await getObjectives();
  return list.find((o) => o.id === id);
}

export async function createObjective(obj: Objective): Promise<Objective> {
  await sql`
    INSERT INTO objectives (id, titulo, descricao, porque, data, completed)
    VALUES (${obj.id}, ${obj.titulo}, ${obj.descricao}, ${obj.porque}, ${obj.data}, ${obj.completed});
  `;

  for (const b of obj.beneficios)
    await sql`INSERT INTO objective_benefits (objective_id, beneficio) VALUES (${obj.id}, ${b});`;

  for (const a of obj.areas)
    await sql`INSERT INTO objective_areas (objective_id, area) VALUES (${obj.id}, ${a});`;

  for (const [area, reward] of Object.entries(obj.recompensasPorArea))
    await sql`
      INSERT INTO objective_rewards_per_area (objective_id, area, recompensa)
      VALUES (${obj.id}, ${area}, ${reward});
    `;

  // if (obj.quadrantes.length > 0) {

  //   for (const q of obj.quadrantes) {
  //     await sql`
  //     INSERT INTO objective_quadrants (id, objective_id, titulo, descricao, completed)
  //     VALUES (${q.id}, ${obj.id}, ${q.titulo}, ${q.descricao}, ${q.completed});
  //   `;
  //     for (const step of q.steps) {
  //       await sql`
  //       INSERT INTO objective_quadrant_steps (id, quadrant_id, objective_id, title, description, completed)
  //       VALUES (${step.id}, ${q.id}, ${obj.id}, ${step.title}, ${step.description}, ${step.completed});
  //     `;
  //     }
  //   }
  // }
  return obj;
}

export async function deleteObjective(id: string): Promise<Objective | null> {
  const existing = await getObjective(id);
  if (!existing) return null;

  await sql`
    DELETE FROM objectives WHERE id = ${id};
  `;

  return existing;
}

export async function updateObjective(id: string, updates: Partial<Objective>): Promise<Objective | null> {
  const existing = await getObjective(id);
  if (!existing) return null;

  const updated = { ...existing, ...updates };

  await sql`
    UPDATE objectives SET
      titulo = ${updated.titulo},
      descricao = ${updated.descricao},
      porque = ${updated.porque},
      data = ${updated.data},
      completed = ${updated.completed}
    WHERE id = ${id};
  `;

  return updated;
}


export async function getHabits(): Promise<Habit[]> {
  const habits = await sql`SELECT * FROM habits;` as Habit[];
  const steps = await sql`SELECT * FROM habit_steps;` as Habit_steps[];
  const hoje = new Date().toISOString().split("T")[0];

  function diffDays(date1: string, date2: string) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diff = (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);
    return Math.floor(diff);
  }

  for (const h of habits) {
    // pegar o último step completado desse hábito
    const ult = steps
      .filter((c) => c.habit_id === h.id && c.datacompleted) // <- filtro obrigatório
      .sort((a, b) => b.datacompleted.localeCompare(a.datacompleted))[0];

    if (ult) {
      const dias = diffDays(ult.datacompleted, hoje);
      console.log(dias)

      if (dias === 0) {
        // já completou hoje → streak mantém
      } else if (dias === 1) {
        // completou ontem → streak++
      } else if (dias > 1) {
        // último registro é de dias atrás → streak = 0
        await sql`
          UPDATE habits
          SET streak = 0
          WHERE id = ${h.id};
        `;
      }
    }
  }

  return habits.map((h) => ({
    ...h,
    steps: steps.filter((s) => s.habit_id === h.id),

    completedSteps: steps
      .filter((c) => c.habit_id === h.id && c.datacompleted === hoje)
      .map((c) => c.id),
  }));
}


export async function UpdateHabitStreak(id: string) {
  await sql`
    UPDATE habits
    SET streak = 0
    WHERE id = ${id};
  `;
}


export async function getHabit(id: string): Promise<Habit | undefined> {
  const list = await getHabits();
  return list.find((h) => h.id === id);
}

export async function createHabit(habit: Habit): Promise<Habit> {
  await sql`
    INSERT INTO habits (id, titulo, descricao, area, minimumStreak, recompensa, completed, streak)
    VALUES (${habit.id}, ${habit.titulo}, ${habit.descricao}, ${habit.area}, ${habit.minimumstreak},
            ${habit.recompensa}, ${habit.completed}, ${habit.streak});
  `;

  for (const step of habit.steps) {
    await sql`
      INSERT INTO habit_steps (id, habit_id, title, description)
      VALUES (${step.id}, ${habit.id}, ${step.title}, ${step.description});
    `;
  }
  return habit;
}

export async function updateHabit(
  id: string,
  completedSteps: string[],
  lastCompleted: string
) {

  await sql`
    UPDATE habits SET
      streak = streak + 1,
      datacomplete=${lastCompleted}
    WHERE id = ${id}
    and datacomplete < ${lastCompleted}
    ;
  `;

  for (const sid of completedSteps) {
    await sql`
      UPDATE habit_steps
      SET datacomplete = ${lastCompleted}
      WHERE id = ${sid}
      and habit_id = ${id};
    `;
  }

  return { success: true };
}

export async function getTasks(): Promise<Task[]> {
  const c = await sql`SELECT * FROM tasks where completed = false;` as Task[];
  return c
}

export async function getTask(id: string): Promise<Task | undefined> {
  const [row] = await sql`SELECT * FROM tasks WHERE id = ${id};` as Task[];

  return row;
}

export async function createTask(task: Task): Promise<Task> {
  
  await sql`
    INSERT INTO tasks (id, titulo, descricao, area, recompensa, duedate, completed)
    VALUES (${task.id}, ${task.titulo}, ${task.descricao}, ${task.area}, ${task.recompensa}, ${task.duedate}, ${task.completed});
  `;
  return task;
}

export async function updateTask(id: string, updates: Task): Promise<Task | null> {


  const updated = updates
  let recompensa = 0;

  if (updated.completed == true) {
    recompensa = updated.recompensa;
    await sql`
    update
    `
  } else {
    recompensa = -Math.abs(updated.recompensa);
  }
  await sql`
  insert into points_transactions ( user_id, points, source)
  values ( 1, ${recompensa}, 1);
  `

  await sql`
    UPDATE tasks SET
      completed = ${updated.completed}
    WHERE id = ${id};
  `;
  return updated;
}



export async function getAchievements(): Promise<Achievement[]> {
  return await sql`SELECT * FROM achievements ORDER BY unlockedAt DESC` as Achievement[];
}

export async function createAchievement(a: Achievement): Promise<Achievement> {
  await sql`
    INSERT INTO achievements (id, titulo, descricao, icon, points, unlockedAt, area)
    VALUES (${a.id}, ${a.titulo}, ${a.descricao}, ${a.icon}, ${a.points}, ${a.unlockedAt}, ${a.area});
  `;
  return a;
}


export async function getCustomAreas(): Promise<CustomArea[]> {
  return await sql`SELECT * FROM custom_areas;` as CustomArea[];
}

export async function createCustomArea(area: CustomArea): Promise<CustomArea> {
  const [row] = await sql`
    INSERT INTO custom_areas (nome) VALUES (${area.name}) RETURNING *;
  ` as CustomArea[];
  return row;
}

export async function updateCustomArea(id: string, updates: Partial<CustomArea>): Promise<CustomArea | null> {
  const [existing] = await sql`
    SELECT * FROM custom_areas WHERE id = ${id};
  ` as CustomArea[];

  if (!existing) return null;

  const nome = updates.name ?? existing.name;

  const [updated] = await sql`
    UPDATE custom_areas SET nome = ${nome}
    WHERE id = ${id}
    RETURNING *;
  ` as CustomArea[];

  return updated;
}


export async function getTotalXP(): Promise<number> {
  const [{ sum: challengeXP }] = await sql`
    SELECT COALESCE(SUM(recompensa),0) AS sum
    FROM challenges WHERE completed = TRUE;
  ` as { sum: number }[];

  const [{ sum: taskXP }] = await sql`
    SELECT COALESCE(SUM(recompensa),0) AS sum
    FROM tasks WHERE completed = TRUE;
  ` as { sum: number }[];

  const [{ sum: habitXP }] = await sql`
    SELECT COALESCE(SUM(recompensa),0) AS sum
    FROM habits WHERE completed = TRUE;
  ` as { sum: number }[];

  const [{ sum: objectiveXP }] = await sql`
    SELECT COALESCE(SUM(recompensa),0) AS sum
    FROM (
      SELECT r.recompensa
      FROM objectives o
      JOIN objective_rewards_per_area r ON r.objective_id = o.id
      WHERE o.completed = TRUE
    ) x;
  ` as { sum: number }[];

  return challengeXP + taskXP + habitXP + objectiveXP;
}

export async function getXPByArea(area: string): Promise<number> {
  const [{ sum: challengeXP }] = await sql`
    SELECT COALESCE(SUM(recompensa),0) AS sum
    FROM challenges WHERE area = ${area} AND completed = TRUE;
  ` as { sum: number }[];

  const [{ sum: taskXP }] = await sql`
    SELECT COALESCE(SUM(recompensa),0) AS sum
    FROM tasks WHERE area = ${area} AND completed = TRUE;
  ` as { sum: number }[];

  const [{ sum: habitXP }] = await sql`
    SELECT COALESCE(SUM(recompensa),0) AS sum
    FROM habits WHERE area = ${area} AND completed = TRUE;
  ` as { sum: number }[];

  const [{ sum: objectiveXP }] = await sql`
    SELECT COALESCE(SUM(r.recompensa),0) AS sum
    FROM objectives o
    JOIN objective_rewards_per_area r ON r.objective_id = o.id
    JOIN objective_areas a ON a.objective_id = o.id
    WHERE o.completed = TRUE AND a.area = ${area};
  ` as { sum: number }[];

  return challengeXP + taskXP + habitXP + objectiveXP;
}
