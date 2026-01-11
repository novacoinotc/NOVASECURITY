"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn, formatRelativeTime } from "@/lib/utils"
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  ShieldAlert,
  Scan,
  Settings,
  Check,
  Trash2
} from "lucide-react"

interface Alert {
  id: string
  type: "NEW_VULNERABILITY" | "SCAN_COMPLETED" | "SCAN_FAILED" | "COMPLIANCE_CHANGE" | "SYSTEM"
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO"
  title: string
  message: string
  isRead: boolean
  isResolved: boolean
  createdAt: Date
  metadata?: Record<string, unknown>
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "NEW_VULNERABILITY",
    severity: "CRITICAL",
    title: "Nueva vulnerabilidad CRÍTICA detectada",
    message: "SQL Injection encontrada en /api/transactions. Requiere atención inmediata.",
    isRead: false,
    isResolved: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    metadata: { vulnerabilityId: "vuln_1" }
  },
  {
    id: "2",
    type: "NEW_VULNERABILITY",
    severity: "CRITICAL",
    title: "Vulnerabilidad en autenticación JWT",
    message: "Se detectó que los tokens JWT no validan correctamente el algoritmo.",
    isRead: false,
    isResolved: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: "3",
    type: "SCAN_COMPLETED",
    severity: "INFO",
    title: "Escaneo completado",
    message: "Escaneo semanal completado. 12 hallazgos encontrados (3 críticos, 5 altos).",
    isRead: true,
    isResolved: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    metadata: { scanId: "scan_1", findings: 12 }
  },
  {
    id: "4",
    type: "COMPLIANCE_CHANGE",
    severity: "HIGH",
    title: "Cambio en cumplimiento",
    message: "El control AUTH-003 cambió de 'Parcial' a 'No Cumple'. Score general bajó a 67%.",
    isRead: true,
    isResolved: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: "5",
    type: "SCAN_FAILED",
    severity: "MEDIUM",
    title: "Escaneo fallido",
    message: "El escaneo de SPEI Endpoint Security falló. Error de conexión con el target.",
    isRead: true,
    isResolved: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: "6",
    type: "SYSTEM",
    severity: "INFO",
    title: "Actualización del sistema",
    message: "Nueva versión de plantillas Nuclei disponible. Actualización recomendada.",
    isRead: true,
    isResolved: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  }
]

const typeIcons: Record<string, React.ElementType> = {
  NEW_VULNERABILITY: ShieldAlert,
  SCAN_COMPLETED: CheckCircle,
  SCAN_FAILED: XCircle,
  COMPLIANCE_CHANGE: AlertTriangle,
  SYSTEM: Info
}

const severityColors: Record<string, { bg: string; text: string; border: string }> = {
  CRITICAL: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
  HIGH: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
  MEDIUM: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200" },
  LOW: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  INFO: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" }
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(mockAlerts)
  const [filter, setFilter] = useState<"all" | "unread" | "critical">("all")

  const filteredAlerts = alerts.filter(alert => {
    if (filter === "unread") return !alert.isRead
    if (filter === "critical") return alert.severity === "CRITICAL"
    return true
  })

  const unreadCount = alerts.filter(a => !a.isRead).length
  const criticalCount = alerts.filter(a => a.severity === "CRITICAL" && !a.isResolved).length

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a))
  }

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, isRead: true })))
  }

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Alertas"
        description="Centro de notificaciones de seguridad"
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{alerts.length}</p>
                  <p className="text-sm text-slate-500">Total Alertas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={unreadCount > 0 ? "ring-2 ring-blue-500" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
                  <p className="text-sm text-slate-500">Sin Leer</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={criticalCount > 0 ? "ring-2 ring-red-500" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-red-100 p-2">
                  <ShieldAlert className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
                  <p className="text-sm text-slate-500">Críticas Activas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-emerald-600" : ""}
            >
              Todas
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "outline"}
              onClick={() => setFilter("unread")}
              className={filter === "unread" ? "bg-emerald-600" : ""}
            >
              Sin Leer ({unreadCount})
            </Button>
            <Button
              variant={filter === "critical" ? "default" : "outline"}
              onClick={() => setFilter("critical")}
              className={filter === "critical" ? "bg-emerald-600" : ""}
            >
              Críticas
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Marcar todas leídas
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Button>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-slate-500">
                No hay alertas que mostrar
              </CardContent>
            </Card>
          ) : (
            filteredAlerts.map((alert) => {
              const Icon = typeIcons[alert.type]
              const colors = severityColors[alert.severity]

              return (
                <Card
                  key={alert.id}
                  className={cn(
                    "transition-all hover:shadow-md",
                    !alert.isRead && "border-l-4 border-l-blue-500",
                    alert.severity === "CRITICAL" && !alert.isResolved && "ring-1 ring-red-200"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={cn("rounded-full p-2", colors.bg)}>
                        <Icon className={cn("h-5 w-5", colors.text)} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={cn(colors.bg, colors.text, "border", colors.border)}>
                            {alert.severity}
                          </Badge>
                          <Badge variant="outline">
                            {alert.type.replace(/_/g, " ")}
                          </Badge>
                          {!alert.isRead && (
                            <Badge className="bg-blue-100 text-blue-700">Nuevo</Badge>
                          )}
                          {alert.isResolved && (
                            <Badge className="bg-emerald-100 text-emerald-700">Resuelto</Badge>
                          )}
                        </div>

                        <h4 className="mt-2 font-semibold text-slate-900">{alert.title}</h4>
                        <p className="mt-1 text-slate-600">{alert.message}</p>

                        <p className="mt-2 text-xs text-slate-400">
                          {formatRelativeTime(alert.createdAt)}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        {!alert.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(alert.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => deleteAlert(alert.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configuración de Notificaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div>
                  <p className="font-medium">Vulnerabilidades Críticas</p>
                  <p className="text-sm text-slate-500">Notificación inmediata por email y Slack</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">Activo</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div>
                  <p className="font-medium">Escaneos Completados</p>
                  <p className="text-sm text-slate-500">Resumen por email</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">Activo</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div>
                  <p className="font-medium">Cambios de Cumplimiento</p>
                  <p className="text-sm text-slate-500">Alerta cuando el score baja</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">Activo</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div>
                  <p className="font-medium">Reporte Semanal</p>
                  <p className="text-sm text-slate-500">Resumen automático cada lunes</p>
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
