import type { Challenge, Objective, Habit, Task, Achievement, CustomArea } from "./types"
const DEFAULT_AREAS = ["desenvolvimento", "fitness", "financeiro", "educacao", "saude", "produtividade", "criatividade"]

let challenges: Challenge[] = [
  {
    id: "1",
    titulo: "Primeira API",
    nivel: 3,
    descricao: "Crie sua primeira API REST com Node.js",
    steps: [
      { id: "1", challenge_id: "1", title: "Setup do projeto", description: "Inicialize um novo projeto Node.js" },
      { id: "2", challenge_id: "1", title: "Express install", description: "Instale e configure o Express" },
      { id: "3", challenge_id: "1", title: "Primeira rota", description: "Crie uma rota GET simples" },
    ],
    conquista: "Desenvolvedor API Jr",
    data: "2025-01-15",
    recompensa: 100,
    area: "desenvolvimento",
    completed: false,
  },
  {
    id: "2",
    titulo: "Database Master",
    nivel: 7,
    descricao: "Integre um banco de dados SQL avançado",
    steps: [
      { id: "1", challenge_id: "2", title: "Planejamento", description: "Desenhe o schema do banco" },
      { id: "2", challenge_id: "2", title: "Setup DB", description: "Configure PostgreSQL ou MySQL" },
      { id: "3", challenge_id: "2", title: "Migrations", description: "Crie migrations para versionamento" },
    ],
    conquista: "Mestre de Dados",
    data: "2025-01-20",
    recompensa: 250,
    area: "desenvolvimento",
    completed: true,
  },
]

const objectives: Objective[] = [
  {
    id: "1",
    titulo: "Dominar TypeScript",
    descricao: "Aprofundar conhecimento em TypeScript avançado",
    porque: "TypeScript melhora a qualidade do código e ajuda na detecção de erros em tempo de desenvolvimento",
    beneficios: [
      "Código mais seguro e menos propenso a bugs",
      "Melhor autocompletar em IDEs",
      "Documentação automática através de types",
      "Facilita trabalho em equipe",
    ],
    areas: ["desenvolvimento", "produtividade"],
    recompensasPorArea: {
      desenvolvimento: 200,
      fitness: 0,
      financeiro: 0,
      educacao: 100,
      saude: 0,
      produtividade: 75,
      criatividade: 0,
    },
    data: "2025-02-01",
    completed: false,
  },
]

const habits: Habit[] = []
const tasks: Task[] = []
const achievements: Achievement[] = []

const customAreas: CustomArea[] = []

export const storage = {
  getChallenges: () => challenges,
  addChallenge: (challenge: Challenge) => {
    challenges.push(challenge)
    return challenge
  },
  updateChallenge: (id: string, updates: Partial<Challenge>) => {
    const index = challenges.findIndex((c) => c.id === id)
    if (index !== -1) {
      challenges[index] = { ...challenges[index], ...updates }
      return challenges[index]
    }
    return null
  },
  deleteChallenge: (id: string) => {
    challenges = challenges.filter((c) => c.id !== id)
  },
  getChallenge: (id: string) => challenges.find((c) => c.id === id),

  getObjectives: () => objectives,
  getObjective: (id: string) => objectives.find((o) => o.id === id),
  addObjective: (objective: Objective) => {
    objectives.push(objective)
    return objective
  },
  updateObjective: (id: string, updates: Partial<Objective>) => {
    const index = objectives.findIndex((o) => o.id === id)
    if (index !== -1) {
      objectives[index] = { ...objectives[index], ...updates }
      return objectives[index]
    }
    return null
  },

  getHabits: () => habits,
  addHabit: (habit: Habit) => {
    habits.push(habit)
    return habit
  },
  updateHabit: (id: string, updates: Partial<Habit>) => {
    const index = habits.findIndex((h) => h.id === id)
    if (index !== -1) {
      habits[index] = { ...habits[index], ...updates }
      return habits[index]
    }
    return null
  },

  getTasks: () => tasks,
  addTask: (task: Task) => {
    tasks.push(task)
    return task
  },
  updateTask: (id: string, updates: Partial<Task>) => {
    const index = tasks.findIndex((t) => t.id === id)
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates }
      return tasks[index]
    }
    return null
  },

  getAchievements: () => achievements,
  addAchievement: (achievement: Achievement) => {
    achievements.push(achievement)
    return achievement
  },

  getTotalXP: () => {
    const challengeXP = challenges.filter((c) => c.completed).reduce((sum, c) => sum + c.recompensa, 0)
    const objectiveXP = objectives
      .filter((o) => o.completed)
      .reduce((sum, o) => {
        return sum + Object.values(o.recompensasPorArea).reduce((a, b) => a + b, 0)
      }, 0)
    const taskXP = tasks.filter((t) => t.completed).reduce((sum, t) => sum + t.recompensa, 0)
    const habitXP = habits.reduce((sum, h) => sum + (h.completed ? h.recompensa : 0), 0)
    return challengeXP + objectiveXP + taskXP + habitXP
  },

  getXPByArea: (area: string) => {
    let total = 0

    challenges
      .filter((c) => c.area === area && c.completed)
      .forEach((c) => {
        total += c.recompensa
      })

    objectives
      .filter((o) => o.completed && o.areas.includes(area as any))
      .forEach((o) => {
        total += o.recompensasPorArea[area as any] || 0
      })

    tasks
      .filter((t) => t.area === area && t.completed)
      .forEach((t) => {
        total += t.recompensa
      })

    habits
      .filter((h) => h.area === area && h.completed)
      .forEach((h) => {
        total += h.recompensa
      })

    return total
  },

  getCustomAreas: () => customAreas,
  addCustomArea: (area: CustomArea) => {
    customAreas.push(area)
    return area
  },
  updateCustomArea: (id: string, updates: Partial<CustomArea>) => {
    const index = customAreas.findIndex((a) => a.id === id)
    if (index !== -1) {
      customAreas[index] = { ...customAreas[index], ...updates }
      return customAreas[index]
    }
    return null
  },
  getAllAreas: () => {
    // Retorna áreas padrão + customizáveis
    return [...DEFAULT_AREAS, ...customAreas]
  },
}
