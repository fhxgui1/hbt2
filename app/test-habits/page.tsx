"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"

export default function TestHabitsPage() {
    const [habits, setHabits] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchHabits = async () => {
        setLoading(true)
        setError(null)
        console.log("🔍 Iniciando busca de hábitos...")

        function diffDays(date1: string, date2: string) {
            const d1 = new Date(date1);
            const d2 = new Date(date2);
            const diff = (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);
            return Math.floor(diff);
        }
        try {
            const response = await fetch("/api/habits")
            console.log("📡 Response status:", response.status)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            console.log("✅ Dados recebidos:", data)
            console.log("📊 Total de hábitos:", data?.length)

            const hoje = new Date().toISOString().split("T")[0];


            // Log detalhado de cada hábito
            data?.forEach((habit: any, index: number) => {
                let cc=0
                let contador=0
                for (const h of habit.steps) {
                   const diff= diffDays(h.datacomplete, hoje)
                   if(diff>1){
                     contador=1
                   }else if(diff<=1){
                     cc=1
                   } 

                }
                
                if(contador==1 && cc==0){
                    async function updd(id:number){
                        const response = await fetch(`/api/habits/streak`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                id: habit.id,
                                streak: 0
                            })
                        })
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`)
                        }

                        const data = await response.json()
                    }
                    updd(habit.id)                    
                }
            })

            setHabits(data)
        } catch (err) {
            console.error("❌ Erro ao buscar hábitos:", err)
            setError(err instanceof Error ? err.message : "Erro desconhecido")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchHabits()
    }, [])

    return (
        <main className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">🧪 Test Habits Debug</h1>
                        <p className="text-muted-foreground">
                            Página de teste para debugar a função getHabits()
                        </p>
                    </div>
                    <Button onClick={fetchHabits} disabled={loading} className="gap-2">
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        Recarregar
                    </Button>
                </div>

                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                )}

                {error && (
                    <div className="bg-destructive/10 border border-destructive rounded-lg p-4 mb-4">
                        <h3 className="font-semibold text-destructive mb-2">Erro:</h3>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {!loading && !error && habits && (
                    <div className="space-y-6">
                        <div className="bg-card border rounded-lg p-4">
                            <h2 className="text-xl font-semibold mb-4">
                                📊 Resumo: {habits.length} hábito(s) encontrado(s)
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                ℹ️ Abra o Console do navegador (F12) para ver logs detalhados
                            </p>
                        </div>

                        <div className="grid gap-4">
                            {habits.map((habit: any, index: number) => (
                                <div key={habit.id} className="bg-card border rounded-lg p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold">
                                                {index + 1}. {habit.titulo}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">ID: {habit.id}</p>
                                        </div>
                                        <div className="bg-primary/10 px-3 py-1 rounded-full">
                                            <span className="text-sm font-medium">
                                                🔥 Streak: {habit.streak}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="bg-muted/50 rounded p-3">
                                            <p className="text-xs font-medium text-muted-foreground mb-1">
                                                Área:
                                            </p>
                                            <p className="text-sm">{habit.area || "N/A"}</p>
                                        </div>

                                        <div className="bg-muted/50 rounded p-3">
                                            <p className="text-xs font-medium text-muted-foreground mb-1">
                                                Completed Steps: ({habit.completedSteps?.length || 0})
                                            </p>
                                            <pre className="text-xs overflow-auto max-h-40">
                                                {JSON.stringify(habit.completedSteps, null, 2)}
                                            </pre>
                                        </div>

                                        <details className="bg-muted/50 rounded p-3">
                                            <summary className="text-xs font-medium text-muted-foreground cursor-pointer">
                                                Ver objeto completo
                                            </summary>
                                            <pre className="text-xs mt-2 overflow-auto max-h-60">
                                                {JSON.stringify(habit, null, 2)}
                                            </pre>
                                        </details>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!loading && !error && habits?.length === 0 && (
                    <div className="text-center py-12 border rounded-lg">
                        <p className="text-muted-foreground">Nenhum hábito encontrado</p>
                    </div>
                )}
            </div>
        </main>
    )
}
