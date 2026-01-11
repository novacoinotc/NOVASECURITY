"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn, formatDate, formatRelativeTime } from "@/lib/utils"
import {
  Play,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Settings,
  Calendar,
  Target,
  Zap,
  Shield
} from "lucide-react"
import type { Scan, ScanType, ScanStatus } from "@/types"

const mockScans: Scan[] = [
  {
    id: "1",
    name: "Escaneo Completo Semanal",
    type: "FULL",
    status: "COMPLETED",
    targetUrl: "https://staging.novacore.mx",
    scanner: "OWASP ZAP",
    version: "2.14.0",
    findings: 12,
    duration: 7200,
    config: { depth: 5, threads: 10 },
    startedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    name: "SQL Injection Scan",
    type: "INJECTION",
    status: "RUNNING",
    targetUrl: "https://staging.novacore.mx/api",
    scanner: "SQLMap",
    version: "1.7.11",
    findings: 0,
    startedAt: new Date(Date.now() - 30 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    name: "API Authentication Test",
    type: "AUTHENTICATION",
    status: "COMPLETED",
    targetUrl: "https://staging.novacore.mx/api/auth",
    scanner: "Nuclei",
    version: "3.1.0",
    findings: 3,
    duration: 1800,
    startedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "4",
    name: "Quick API Scan",
    type: "QUICK",
    status: "COMPLETED",
    targetUrl: "https://staging.novacore.mx/api",
    scanner: "Nuclei",
    version: "3.1.0",
    findings: 5,
    duration: 300,
    startedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 47.9 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "5",
    name: "SPEI Endpoint Security",
    type: "API",
    status: "FAILED",
    targetUrl: "https://staging.novacore.mx/api/spei",
    scanner: "Custom",
    findings: 0,
    startedAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 71.5 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "6",
    name: "Scheduled Weekly Scan",
    type: "FULL",
    status: "PENDING",
    targetUrl: "https://staging.novacore.mx",
    scanner: "OWASP ZAP",
    findings: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const scanTypeConfig: Record<ScanType, { label: string; color: string; icon: React.ElementType }> = {
  FULL: { label: "Completo", color: "bg-purple-100 text-purple-700", icon: Shield },
  QUICK: { label: "Rápido", color: "bg-blue-100 text-blue-700", icon: Zap },
  API: { label: "API", color: "bg-green-100 text-green-700", icon: Target },
  AUTHENTICATION: { label: "Auth", color: "bg-orange-100 text-orange-700", icon: Shield },
  INJECTION: { label: "Injection", color: "bg-red-100 text-red-700", icon: Target },
  CUSTOM: { label: "Custom", color: "bg-slate-100 text-slate-700", icon: Settings }
}

const statusConfig: Record<ScanStatus, { label: string; color: string; icon: React.ElementType; animate?: boolean }> = {
  PENDING: { label: "Pendiente", color: "text-slate-500", icon: Clock },
  RUNNING: { label: "Ejecutando", color: "text-blue-500", icon: Loader2, animate: true },
  COMPLETED: { label: "Completado", color: "text-emerald-500", icon: CheckCircle },
  FAILED: { label: "Fallido", color: "text-red-500", icon: XCircle },
  CANCELLED: { label: "Cancelado", color: "text-slate-400", icon: XCircle }
}

export default function ScansPage() {
  const [activeTab, setActiveTab] = useState<"all" | "running" | "scheduled">("all")

  const filteredScans = mockScans.filter(scan => {
    if (activeTab === "running") return scan.status === "RUNNING"
    if (activeTab === "scheduled") return scan.status === "PENDING"
    return true
  })

  const stats = {
    total: mockScans.length,
    running: mockScans.filter(s => s.status === "RUNNING").length,
    completed: mockScans.filter(s => s.status === "COMPLETED").length,
    findings: mockScans.reduce((acc, s) => acc + s.findings, 0)
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Escaneos de Seguridad"
        description="Ejecuta y gestiona escaneos automatizados"
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={activeTab === "all" ? "default" : "outline"}
              onClick={() => setActiveTab("all")}
              className={activeTab === "all" ? "bg-emerald-600" : ""}
            >
              Todos ({stats.total})
            </Button>
            <Button
              variant={activeTab === "running" ? "default" : "outline"}
              onClick={() => setActiveTab("running")}
              className={activeTab === "running" ? "bg-emerald-600" : ""}
            >
              En Ejecución ({stats.running})
            </Button>
            <Button
              variant={activeTab === "scheduled" ? "default" : "outline"}
              onClick={() => setActiveTab("scheduled")}
              className={activeTab === "scheduled" ? "bg-emerald-600" : ""}
            >
              Programados
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Programar
            </Button>
            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Play className="h-4 w-4" />
              Nuevo Escaneo
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-slate-500">Total Escaneos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                <span className="text-2xl font-bold text-blue-600">{stats.running}</span>
              </div>
              <p className="text-sm text-slate-500">En Ejecución</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-emerald-600">{stats.completed}</div>
              <p className="text-sm text-slate-500">Completados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{stats.findings}</div>
              <p className="text-sm text-slate-500">Hallazgos Totales</p>
            </CardContent>
          </Card>
        </div>

        {/* Scan Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Escaneos Rápidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { name: "OWASP ZAP Full", scanner: "OWASP ZAP", type: "FULL", duration: "~2 hrs" },
                { name: "SQL Injection", scanner: "SQLMap", type: "INJECTION", duration: "~30 min" },
                { name: "Auth Testing", scanner: "Nuclei", type: "AUTHENTICATION", duration: "~15 min" },
                { name: "Quick Scan", scanner: "Nuclei", type: "QUICK", duration: "~5 min" }
              ].map((template) => (
                <Card key={template.name} className="border-dashed hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer transition-colors">
                  <CardContent className="p-4 text-center">
                    <div className="mx-auto w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                      <Play className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-xs text-slate-500">{template.scanner}</p>
                    <p className="text-xs text-slate-400 mt-1">{template.duration}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scans List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Historial de Escaneos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredScans.map((scan) => {
                const typeInfo = scanTypeConfig[scan.type]
                const statusInfo = statusConfig[scan.status]
                const StatusIcon = statusInfo.icon
                const TypeIcon = typeInfo.icon

                return (
                  <div
                    key={scan.id}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:shadow-md transition-shadow"
                  >
                    <div className={cn(
                      "rounded-full p-2",
                      scan.status === "RUNNING" ? "bg-blue-100" :
                      scan.status === "COMPLETED" ? "bg-emerald-100" :
                      scan.status === "FAILED" ? "bg-red-100" : "bg-slate-100"
                    )}>
                      <StatusIcon className={cn(
                        "h-5 w-5",
                        statusInfo.color,
                        statusInfo.animate && "animate-spin"
                      )} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium text-slate-900">{scan.name}</h4>
                        <Badge className={typeInfo.color}>
                          {typeInfo.label}
                        </Badge>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                        <span>{scan.scanner} {scan.version}</span>
                        <span>|</span>
                        <span className="truncate">{scan.targetUrl}</span>
                      </div>
                      {scan.startedAt && (
                        <p className="mt-1 text-xs text-slate-400">
                          {scan.status === "RUNNING"
                            ? `Iniciado ${formatRelativeTime(scan.startedAt)}`
                            : scan.completedAt
                            ? `Completado ${formatRelativeTime(scan.completedAt)}`
                            : `Iniciado ${formatRelativeTime(scan.startedAt)}`}
                          {scan.duration && ` (${Math.round(scan.duration / 60)} min)`}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      {scan.status === "COMPLETED" && (
                        <p className={cn(
                          "text-xl font-bold",
                          scan.findings > 0 ? "text-red-500" : "text-emerald-500"
                        )}>
                          {scan.findings}
                          <span className="text-sm font-normal text-slate-400 ml-1">
                            hallazgos
                          </span>
                        </p>
                      )}
                      {scan.status === "RUNNING" && (
                        <div className="flex items-center gap-2 text-blue-500">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Ejecutando...</span>
                        </div>
                      )}
                      {scan.status === "PENDING" && (
                        <Button size="sm" className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                          <Play className="h-3 w-3" />
                          Iniciar
                        </Button>
                      )}
                      {scan.status === "FAILED" && (
                        <Button size="sm" variant="outline" className="gap-1 text-red-500">
                          Reintentar
                        </Button>
                      )}
                    </div>

                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
