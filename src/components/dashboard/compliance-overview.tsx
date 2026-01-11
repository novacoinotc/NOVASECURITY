"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  Key,
  Users,
  Server,
  FileText,
  Lock,
  UserCheck,
  Activity,
  TestTube
} from "lucide-react"
import Link from "next/link"

interface CategoryScore {
  id: string
  name: string
  icon: string
  compliant: number
  total: number
  score: number
}

interface ComplianceOverviewProps {
  categories: CategoryScore[]
  overallScore: number
}

const iconMap: Record<string, React.ElementType> = {
  Key,
  Users,
  Server,
  FileText,
  Lock,
  UserCheck,
  Activity,
  TestTube
}

export function ComplianceOverview({ categories, overallScore }: ComplianceOverviewProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500"
    if (score >= 60) return "bg-yellow-500"
    if (score >= 40) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Cumplimiento por Categoría</CardTitle>
        <Link
          href="/checklist"
          className="text-sm text-emerald-600 hover:underline"
        >
          Ver checklist completo
        </Link>
      </CardHeader>
      <CardContent>
        {/* Overall score */}
        <div className="mb-6 rounded-lg bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">
              Cumplimiento General
            </span>
            <span className={cn(
              "text-2xl font-bold",
              overallScore >= 80 ? "text-emerald-600" :
              overallScore >= 60 ? "text-yellow-600" :
              overallScore >= 40 ? "text-orange-600" : "text-red-600"
            )}>
              {overallScore}%
            </span>
          </div>
          <Progress
            value={overallScore}
            className="mt-2 h-3"
            indicatorClassName={getScoreColor(overallScore)}
          />
        </div>

        {/* Categories */}
        <div className="space-y-4">
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || Lock
            return (
              <div key={category.id} className="group">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "rounded-lg p-2",
                    category.score >= 80 ? "bg-emerald-100" :
                    category.score >= 60 ? "bg-yellow-100" :
                    category.score >= 40 ? "bg-orange-100" : "bg-red-100"
                  )}>
                    <Icon className={cn(
                      "h-4 w-4",
                      category.score >= 80 ? "text-emerald-600" :
                      category.score >= 60 ? "text-yellow-600" :
                      category.score >= 40 ? "text-orange-600" : "text-red-600"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 truncate">
                        {category.name}
                      </span>
                      <span className="text-sm text-slate-500">
                        {category.compliant}/{category.total}
                      </span>
                    </div>
                    <Progress
                      value={category.score}
                      className="mt-1 h-2"
                      indicatorClassName={getScoreColor(category.score)}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
