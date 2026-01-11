"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface RiskGaugeProps {
  score: number // 0-100
  label?: string
}

export function RiskGauge({ score, label = "Nivel de Riesgo" }: RiskGaugeProps) {
  const getColor = (value: number) => {
    if (value <= 25) return { bg: "bg-emerald-500", text: "text-emerald-500", label: "BAJO" }
    if (value <= 50) return { bg: "bg-yellow-500", text: "text-yellow-500", label: "MEDIO" }
    if (value <= 75) return { bg: "bg-orange-500", text: "text-orange-500", label: "ALTO" }
    return { bg: "bg-red-500", text: "text-red-500", label: "CRÍTICO" }
  }

  const colorInfo = getColor(score)
  const rotation = (score / 100) * 180 - 90 // -90 to 90 degrees

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          {/* Gauge */}
          <div className="relative h-32 w-64">
            {/* Background arc */}
            <svg
              viewBox="0 0 200 100"
              className="absolute inset-0 h-full w-full"
            >
              {/* Background segments */}
              <path
                d="M 20 100 A 80 80 0 0 1 50 34.02"
                fill="none"
                stroke="#10B981"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <path
                d="M 50 34.02 A 80 80 0 0 1 100 20"
                fill="none"
                stroke="#EAB308"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <path
                d="M 100 20 A 80 80 0 0 1 150 34.02"
                fill="none"
                stroke="#F97316"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <path
                d="M 150 34.02 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#EF4444"
                strokeWidth="20"
                strokeLinecap="round"
              />
            </svg>

            {/* Needle */}
            <div
              className="absolute bottom-0 left-1/2 h-24 w-1 origin-bottom -translate-x-1/2 transition-transform duration-1000"
              style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
            >
              <div className={cn("h-full w-full rounded-full", colorInfo.bg)} />
            </div>

            {/* Center circle */}
            <div className="absolute bottom-0 left-1/2 h-6 w-6 -translate-x-1/2 translate-y-1/2 rounded-full bg-slate-800" />
          </div>

          {/* Score display */}
          <div className="mt-4 text-center">
            <p className={cn("text-4xl font-bold", colorInfo.text)}>{score}</p>
            <p className={cn("text-sm font-medium", colorInfo.text)}>
              {colorInfo.label}
            </p>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-emerald-500" />
              <span>0-25</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-yellow-500" />
              <span>26-50</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-orange-500" />
              <span>51-75</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-red-500" />
              <span>76-100</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
