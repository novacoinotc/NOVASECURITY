"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts"

interface SeverityChartProps {
  data: {
    critical: number
    high: number
    medium: number
    low: number
    info: number
  }
}

const COLORS = {
  critical: "#DC2626",
  high: "#F97316",
  medium: "#EAB308",
  low: "#3B82F6",
  info: "#6B7280"
}

export function SeverityChart({ data }: SeverityChartProps) {
  const chartData = [
    { name: "Crítico", value: data.critical, color: COLORS.critical },
    { name: "Alto", value: data.high, color: COLORS.high },
    { name: "Medio", value: data.medium, color: COLORS.medium },
    { name: "Bajo", value: data.low, color: COLORS.low },
    { name: "Info", value: data.info, color: COLORS.info }
  ].filter(item => item.value > 0)

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Distribución por Severidad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center text-slate-500">
            No hay vulnerabilidades registradas
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Distribución por Severidad</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [value, "Vulnerabilidades"]}
                contentStyle={{
                  backgroundColor: "#1E293B",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff"
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-sm text-slate-600">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Summary */}
        <div className="mt-4 grid grid-cols-5 gap-2 text-center">
          {[
            { label: "Crítico", value: data.critical, color: "text-red-600" },
            { label: "Alto", value: data.high, color: "text-orange-500" },
            { label: "Medio", value: data.medium, color: "text-yellow-600" },
            { label: "Bajo", value: data.low, color: "text-blue-500" },
            { label: "Info", value: data.info, color: "text-gray-500" }
          ].map((item) => (
            <div key={item.label}>
              <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-xs text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
