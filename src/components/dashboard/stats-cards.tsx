"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Bug,
  TrendingUp,
  TrendingDown
} from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardsProps {
  stats: {
    totalVulnerabilities: number
    openVulnerabilities: number
    criticalCount: number
    highCount: number
    mediumCount: number
    lowCount: number
    complianceScore: number
    riskScore: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Vulnerabilidades Abiertas",
      value: stats.openVulnerabilities,
      total: stats.totalVulnerabilities,
      icon: Bug,
      color: "text-red-500",
      bgColor: "bg-red-50",
      trend: stats.openVulnerabilities > 0 ? "up" : "down"
    },
    {
      title: "Críticas",
      value: stats.criticalCount,
      icon: ShieldAlert,
      color: "text-red-600",
      bgColor: "bg-red-50",
      urgent: stats.criticalCount > 0
    },
    {
      title: "Alta Severidad",
      value: stats.highCount,
      icon: AlertTriangle,
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      title: "Cumplimiento",
      value: `${stats.complianceScore}%`,
      icon: ShieldCheck,
      color: stats.complianceScore >= 80 ? "text-emerald-500" : "text-yellow-500",
      bgColor: stats.complianceScore >= 80 ? "bg-emerald-50" : "bg-yellow-50"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.title}
          className={cn(
            "relative overflow-hidden",
            card.urgent && "ring-2 ring-red-500 ring-offset-2"
          )}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{card.title}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                  {card.total && (
                    <span className="text-sm text-slate-400">/ {card.total}</span>
                  )}
                </div>
                {card.trend && (
                  <div className={cn(
                    "mt-1 flex items-center gap-1 text-xs",
                    card.trend === "up" ? "text-red-500" : "text-emerald-500"
                  )}>
                    {card.trend === "up" ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>vs semana anterior</span>
                  </div>
                )}
              </div>
              <div className={cn("rounded-full p-3", card.bgColor)}>
                <card.icon className={cn("h-6 w-6", card.color)} />
              </div>
            </div>
          </CardContent>
          {card.urgent && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-red-500" />
          )}
        </Card>
      ))}
    </div>
  )
}
