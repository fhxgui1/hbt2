export interface CustomArea {
  id: string
  name: string
  color: string
  icon?: string
  totalXP: number
}


// ===============================
// Interface principal
// ===============================
export interface CreativeItem {
  id: string;
  title: string;
  blocks: Block[]; // Uma lista de blocos
}


// ===============================
// Union Type com todos os blocos
// ===============================
export type Block =
  | TextBlock
  | TitleBlock
  | SubtitleBlock
  | ListBlock
  | NumberedListBlock
  | ChecklistBlock
  | IconBlock
  | CardBlock
  | AccordionBlock
  | DividerBlock
  | ContainerBlock
  | GridBlock
  | SpacerBlock;


// ===============================
// Blocos de Texto
// ===============================

export interface TextBlock {
  type: "text";
  content: string; 
  // HTML ou texto formatado (ex.: output de editor rich-text)
}

export interface TitleBlock {
  type: "title";
  content: string;
}

export interface SubtitleBlock {
  type: "subtitle";
  content: string;
}


// ===============================
// Blocos de Lista
// ===============================

export interface ListBlock {
  type: "list";
  items: string[];
}

export interface NumberedListBlock {
  type: "numbered-list";
  items: string[];
}

export interface ChecklistItem {
  text: string;
  checked: boolean;
}

export interface ChecklistBlock {
  type: "checklist";
  items: ChecklistItem[];
}


// ===============================
// Bloco com Ícone (Lucide)
// ===============================
export interface IconBlock {
  type: "icon";
  icon: string; // nome do ícone no Lucide React
  size?: number; // opcional
  color?: string; // opcional
}


// ===============================
// Blocos de Card
// ===============================

export type CardVariant = "info" | "warning" | "success" | "danger" | "default";

export interface CardBlock {
  type: "card";
  variant: CardVariant;
  title?: string;
  content: string; // texto ou html simples
}

export interface AccordionItem {
  title: string;
  content: string;
}

export interface AccordionBlock {
  type: "accordion";
  items: AccordionItem[];
}


// ===============================
// Blocos Estruturais
// ===============================

export interface DividerBlock {
  type: "divider";
}

export interface ContainerBlock {
  type: "container";
  blocks: Block[]; // permite aninhar outros blocos
}

export interface GridBlock {
  type: "grid";
  columns: 2 | 3; // limitar a 2 ou 3 colunas
  blocks: Block[][]; // cada coluna tem seus blocos
}

export interface SpacerBlock {
  type: "spacer";
  size: "sm" | "md" | "lg" | "xl"; // tamanhos definidos
}


export type AreaType = CustomArea | Area

export interface Quadrant {
  id: string
  titulo: string
  objective_id: string
  descricao?: string
  steps: Quadrant_step[]
  completed?: boolean
}

export interface Quadrant_step {
  id?: string
  quadrant_id: string
  title: string
  description: string
  completed?: boolean
}

export interface Step {
  id?: string
  challenge_id: string
  title: string
  description: string
  completed?: boolean
}

export interface habit_completed_steps {
  id: string
  datac: string
  habit_id: string
  step_id: string

}
export interface Habit_steps {
  id: string
  habit_id: string
  title: string
  description: string
  datacompleted: string
}
export interface Challenge {
  id: string
  titulo: string
  nivel: number
  descricao: string
  steps: Step[]
  conquista: string
  data: string
  recompensa: number
  area: string // Agora suporta áreas customizáveis
  objectiveId?: string // Pode estar atrelado a um objetivo
  completed?: boolean
}

export interface Objective {
  id: string
  titulo: string
  descricao: string
  beneficios: string[]
  porque: string
  areas: string[] // Agora suporta áreas customizáveis
  recompensasPorArea: Record<string, number>
  data: string
  quadrantes?: Quadrant[] // Adicionado quadrantes para objetivos
  completed?: boolean
}

export interface Habit {
  id: string
  titulo: string
  descricao?: string
  area: string // Agora suporta áreas customizáveis
  minimumstreak: number
  steps: Habit_steps[]
  recompensa: number
  objectiveId?: string // Pode estar atrelado a um objetivo
  completed?: boolean
  lastCompleted?: string
  datacompleted: string
  streak?: number
  completedSteps?: string[] // Rastreia quais passos foram completados
}

export interface Task {
  id: string
  titulo: string
  descricao?: string
  area: string // Agora suporta áreas customizáveis
  recompensa: number
  objectiveId?: string // Pode estar atrelado a um objetivo
  completed?: boolean
  duedate: string
}

export interface AreaScore {
  area: string
  totalPoints: number
  completedItems: number
  totalItems: number
  achievements: string[]
  level: number
}

export interface Achievement {
  id: string
  titulo: string
  descricao: string
  icon: string
  points: number
  unlockedAt: string
  area: string
}

// Áreas padrão
// modificar para função assincrona 
export type Area =
  | "desenvolvimento"
  | "fitness"
  | "financeiro"
  | "educacao"
  | "saude"
  | "produtividade"
  | "criatividade"

export const DEFAULT_AREAS: { value: Area; label: string; color: string }[] = [
  { value: "desenvolvimento", label: "Desenvolvimento", color: "from-purple-500 to-pink-500" },
  { value: "fitness", label: "Fitness", color: "from-orange-500 to-red-500" },
  { value: "financeiro", label: "Financeiro", color: "from-green-500 to-emerald-500" },
  { value: "educacao", label: "Educação", color: "from-blue-500 to-cyan-500" },
  { value: "saude", label: "Saúde", color: "from-red-500 to-pink-500" },
  { value: "produtividade", label: "Produtividade", color: "from-indigo-500 to-purple-500" },
  { value: "criatividade", label: "Criatividade", color: "from-yellow-500 to-orange-500" },
]

export const AREAS = DEFAULT_AREAS // Para compatibilidade
