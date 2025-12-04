

"use client"

import { useState } from "react" 
import Link from "next/link" 
import { usePathname } from "next/navigation" 
import { LayoutDashboard, Target, Trophy, Zap, CheckSquare, Flame, Menu, X, Layers,Sprout } from "lucide-react"
import { Button } from "@/components/ui/button" 

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }, 
  { href: "/areas", label: "Áreas", icon: Layers }, 
  { href: "/challenges", label: "Desafios", icon: Target }, 
  { href: "/objectives", label: "Objetivos", icon: Trophy }, 
  { href: "/habits", label: "Hábitos", icon: Flame }, 
  { href: "/tasks", label: "Tarefas", icon: CheckSquare }, 
]


export function MainNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (

    <nav className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">Gamify</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname.startsWith(item.href)

              return (
                <Link key={item.href} href={item.href}>
                  <Button variant={isActive ? "default" : "ghost"} size="sm" className="gap-2">
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Mobile Nav Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Nav Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname.startsWith(item.href)

              return (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                  <Button variant={isActive ? "default" : "ghost"} size="sm" className="w-full justify-start gap-2">
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </nav>
  )
}
