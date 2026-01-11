"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn, formatDate } from "@/lib/utils"
import {
  FileText,
  Download,
  Calendar,
  Plus,
  ChevronRight,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  BarChart3
} from "lucide-react"

interface Report {
  id: string
  title: string
  type: "WEEKLY" | "MONTHLY" | "QUARTERLY" | "INCIDENT"
  period: string
  status: "DRAFT" | "PUBLISHED"
  totalVulnerabilities: number
  criticalCount: number
  highCount: number
  mediumCount: number
  lowCount: number
  complianceScore: number
  createdAt: Date
  publishedAt?: Date
}

const mockReports: Report[] = [
  {
    id: "1",
    title: "Reporte Semanal de Seguridad",
    type: "WEEKLY",
    period: "2024-W02",
    status: "PUBLISHED",
    totalVulnerabilities: 23,
    criticalCount: 3,
    highCount: 8,
    mediumCount: 9,
    lowCount: 3,
    complianceScore: 67,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: "2",
    title: "Reporte Semanal de Seguridad",
    type: "WEEKLY",
    period: "2024-W01",
    status: "PUBLISHED",
    totalVulnerabilities: 28,
    criticalCount: 4,
    highCount: 10,
    mediumCount: 11,
    lowCount: 3,
    complianceScore: 62,
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
  },
  {
    id: "3",
    title: "Reporte Mensual - Diciembre 2023",
    type: "MONTHLY",
    period: "2023-12",
    status: "PUBLISHED",
    totalVulnerabilities: 45,
    criticalCount: 5,
    highCount: 15,
    mediumCount: 18,
    lowCount: 7,
    complianceScore: 58,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  },
  {
    id: "4",
    title: "Reporte de Incidente - SQL Injection",
    type: "INCIDENT",
    period: "2024-01-08",
    status: "DRAFT",
    totalVulnerabilities: 1,
    criticalCount: 1,
    highCount: 0,
    mediumCount: 0,
    lowCount: 0,
    complianceScore: 0,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: "5",
    title: "Reporte Q4 2023",
    type: "QUARTERLY",
    period: "2023-Q4",
    status: "PUBLISHED",
    totalVulnerabilities: 127,
    criticalCount: 12,
    highCount: 35,
    mediumCount: 55,
    lowCount: 25,
    complianceScore: 55,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    publishedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)
  }
]

const typeConfig: Record<string, { label: string; color: string }> = {
  WEEKLY: { label: "Semanal", color: "bg-blue-100 text-blue-700" },
  MONTHLY: { label: "Mensual", color: "bg-purple-100 text-purple-700" },
  QUARTERLY: { label: "Trimestral", color: "bg-orange-100 text-orange-700" },
  INCIDENT: { label: "Incidente", color: "bg-red-100 text-red-700" }
}

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState<string>("all")

  const filteredReports = mockReports.filter(r =>
    selectedType === "all" || r.type === selectedType
  )

  // Calculate trends (comparing last 2 weekly reports)
  const weeklyReports = mockReports.filter(r => r.type === "WEEKLY").slice(0, 2)
  const trends = weeklyReports.length === 2 ? {
    vulnerabilities: weeklyReports[0].totalVulnerabilities - weeklyReports[1].totalVulnerabilities,
    critical: weeklyReports[0].criticalCount - weeklyReports[1].criticalCount,
    compliance: weeklyReports[0].complianceScore - weeklyReports[1].complianceScore
  } : null

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Reportes de Seguridad"
        description="Reportes semanales, mensuales y de incidentes"
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Trend Summary */}
        {trends && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Tendencias (vs semana anterior)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                  <div>
                    <p className="text-sm text-slate-500">Vulnerabilidades</p>
                    <p className="text-2xl font-bold">{weeklyReports[0].totalVulnerabilities}</p>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1",
                    trends.vulnerabilities < 0 ? "text-emerald-500" : "text-red-500"
                  )}>
                    {trends.vulnerabilities < 0 ? (
                      <TrendingDown className="h-5 w-5" />
                    ) : (
                      <TrendingUp className="h-5 w-5" />
                    )}
                    <span className="font-medium">
                      {Math.abs(trends.vulnerabilities)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                  <div>
                    <p className="text-sm text-slate-500">Críticas</p>
                    <p className="text-2xl font-bold text-red-600">{weeklyReports[0].criticalCount}</p>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1",
                    trends.critical < 0 ? "text-emerald-500" : "text-red-500"
                  )}>
                    {trends.critical < 0 ? (
                      <TrendingDown className="h-5 w-5" />
                    ) : trends.critical > 0 ? (
                      <TrendingUp className="h-5 w-5" />
                    ) : null}
                    <span className="font-medium">
                      {trends.critical === 0 ? "Sin cambio" : Math.abs(trends.critical)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                  <div>
                    <p className="text-sm text-slate-500">Cumplimiento</p>
                    <p className="text-2xl font-bold">{weeklyReports[0].complianceScore}%</p>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1",
                    trends.compliance > 0 ? "text-emerald-500" : "text-red-500"
                  )}>
                    {trends.compliance > 0 ? (
                      <TrendingUp className="h-5 w-5" />
                    ) : (
                      <TrendingDown className="h-5 w-5" />
                    )}
                    <span className="font-medium">
                      {Math.abs(trends.compliance)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters and Actions */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={selectedType === "all" ? "default" : "outline"}
              onClick={() => setSelectedType("all")}
              className={selectedType === "all" ? "bg-emerald-600" : ""}
            >
              Todos
            </Button>
            <Button
              variant={selectedType === "WEEKLY" ? "default" : "outline"}
              onClick={() => setSelectedType("WEEKLY")}
              className={selectedType === "WEEKLY" ? "bg-emerald-600" : ""}
            >
              Semanales
            </Button>
            <Button
              variant={selectedType === "MONTHLY" ? "default" : "outline"}
              onClick={() => setSelectedType("MONTHLY")}
              className={selectedType === "MONTHLY" ? "bg-emerald-600" : ""}
            >
              Mensuales
            </Button>
            <Button
              variant={selectedType === "INCIDENT" ? "default" : "outline"}
              onClick={() => setSelectedType("INCIDENT")}
              className={selectedType === "INCIDENT" ? "bg-emerald-600" : ""}
            >
              Incidentes
            </Button>
          </div>

          <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4" />
            Generar Reporte
          </Button>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "rounded-lg p-3",
                    report.type === "INCIDENT" ? "bg-red-100" : "bg-slate-100"
                  )}>
                    {report.type === "INCIDENT" ? (
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    ) : (
                      <FileText className="h-6 w-6 text-slate-600" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={typeConfig[report.type].color}>
                        {typeConfig[report.type].label}
                      </Badge>
                      <Badge variant="outline" className={
                        report.status === "PUBLISHED"
                          ? "text-emerald-700 border-emerald-300"
                          : "text-yellow-700 border-yellow-300"
                      }>
                        {report.status === "PUBLISHED" ? "Publicado" : "Borrador"}
                      </Badge>
                      <span className="text-sm text-slate-500">{report.period}</span>
                    </div>

                    <h3 className="mt-2 text-lg font-semibold text-slate-900">
                      {report.title}
                    </h3>

                    {/* Stats summary */}
                    <div className="mt-3 flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-slate-500">Total: </span>
                        <span className="font-medium">{report.totalVulnerabilities}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          <span>{report.criticalCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-orange-500" />
                          <span>{report.highCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-yellow-500" />
                          <span>{report.mediumCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          <span>{report.lowCount}</span>
                        </div>
                      </div>
                      {report.complianceScore > 0 && (
                        <div>
                          <span className="text-slate-500">Cumplimiento: </span>
                          <span className={cn(
                            "font-medium",
                            report.complianceScore >= 80 ? "text-emerald-600" :
                            report.complianceScore >= 60 ? "text-yellow-600" : "text-red-600"
                          )}>
                            {report.complianceScore}%
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 text-xs text-slate-400">
                      Creado: {formatDate(report.createdAt)}
                      {report.publishedAt && ` | Publicado: ${formatDate(report.publishedAt)}`}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      PDF
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1">
                      Ver
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Report Generation Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Programación de Reportes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div>
                  <p className="font-medium">Reporte Semanal</p>
                  <p className="text-sm text-slate-500">Todos los lunes a las 8:00 AM</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">Activo</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div>
                  <p className="font-medium">Reporte Mensual</p>
                  <p className="text-sm text-slate-500">Primer día del mes a las 8:00 AM</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">Activo</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div>
                  <p className="font-medium">Alerta de Vulnerabilidad Crítica</p>
                  <p className="text-sm text-slate-500">Inmediato al detectar severidad CRITICAL</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">Activo</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
