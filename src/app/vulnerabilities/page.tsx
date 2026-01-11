"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn, getSeverityColor, getStatusColor, formatDate } from "@/lib/utils"
import {
  Filter,
  Download,
  Plus,
  Search,
  ChevronDown,
  ExternalLink,
  AlertTriangle
} from "lucide-react"
import type { Vulnerability, Severity, VulnerabilityStatus } from "@/types"

// Mock data
const mockVulnerabilities: Vulnerability[] = [
  {
    id: "1",
    title: "SQL Injection en endpoint /api/transactions",
    description: "El parámetro 'account_id' es vulnerable a inyección SQL. Un atacante podría extraer datos sensibles de la base de datos incluyendo información de transacciones SPEI. Esta vulnerabilidad permite acceso no autorizado a datos financieros críticos.",
    severity: "CRITICAL",
    status: "OPEN",
    category: "Injection",
    cvssScore: 9.8,
    cweId: "CWE-89",
    affectedComponent: "API Transacciones",
    affectedUrl: "/api/transactions?account_id=",
    remediation: "Usar consultas parametrizadas (prepared statements) y validar todos los inputs. Implementar ORM con escape automático.",
    discoveredAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    title: "JWT sin validación de firma",
    description: "Los tokens JWT no validan correctamente la firma. El sistema acepta tokens con algoritmo 'none' permitiendo la creación de tokens fraudulentos sin conocer el secret.",
    severity: "CRITICAL",
    status: "IN_PROGRESS",
    category: "Authentication",
    cvssScore: 9.1,
    cweId: "CWE-347",
    affectedComponent: "Sistema Auth",
    remediation: "Validar explícitamente el algoritmo JWT. Rechazar tokens con alg:'none'. Usar librerías actualizadas.",
    discoveredAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    title: "Falta de Rate Limiting en API de dispersiones",
    description: "El endpoint de dispersiones no tiene límite de peticiones, permitiendo ataques de fuerza bruta, enumeración de cuentas y potencial DoS.",
    severity: "HIGH",
    status: "OPEN",
    category: "API Security",
    cvssScore: 7.5,
    cweId: "CWE-770",
    affectedComponent: "API Dispersiones",
    affectedUrl: "/api/dispersions",
    remediation: "Implementar rate limiting por IP y por usuario. Considerar límites más estrictos para endpoints financieros.",
    discoveredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "4",
    title: "Secrets expuestos en repositorio",
    description: "Se encontraron credenciales de base de datos y API keys en archivos .env commiteados al historial de Git.",
    severity: "HIGH",
    status: "RESOLVED",
    category: "Secret Management",
    cvssScore: 8.2,
    cweId: "CWE-798",
    affectedComponent: "Configuración",
    remediation: "Rotar todas las credenciales expuestas. Usar git-secrets o similar para prevenir futuros commits de secrets.",
    discoveredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    resolvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "5",
    title: "Cross-Site Scripting (XSS) en campo de notas",
    description: "El campo de notas en transacciones no sanitiza entrada HTML, permitiendo XSS stored que se ejecuta cuando otros usuarios ven la transacción.",
    severity: "MEDIUM",
    status: "OPEN",
    category: "XSS",
    cvssScore: 6.1,
    cweId: "CWE-79",
    affectedComponent: "Dashboard",
    affectedUrl: "/dashboard/transactions",
    remediation: "Sanitizar todas las entradas de usuario. Usar Content Security Policy. Escapar HTML al renderizar.",
    discoveredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "6",
    title: "Sesiones sin timeout adecuado",
    description: "Las sesiones de usuario no expiran después de inactividad, manteniéndose activas indefinidamente.",
    severity: "MEDIUM",
    status: "OPEN",
    category: "Session Management",
    cvssScore: 5.4,
    cweId: "CWE-613",
    affectedComponent: "Sistema Auth",
    remediation: "Implementar timeout de sesión de 15 minutos de inactividad. Agregar logout automático.",
    discoveredAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "7",
    title: "Headers de seguridad faltantes",
    description: "La aplicación no incluye headers de seguridad importantes como X-Frame-Options, X-Content-Type-Options, HSTS.",
    severity: "LOW",
    status: "OPEN",
    category: "Configuration",
    cvssScore: 3.7,
    cweId: "CWE-693",
    affectedComponent: "Web Server",
    remediation: "Configurar headers de seguridad en el servidor web o middleware de Next.js.",
    discoveredAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const severityOrder: Record<Severity, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
  INFO: 4
}

export default function VulnerabilitiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState<Severity | "ALL">("ALL")
  const [statusFilter, setStatusFilter] = useState<VulnerabilityStatus | "ALL">("ALL")

  const filteredVulns = mockVulnerabilities
    .filter((v) => {
      const matchesSearch = v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSeverity = severityFilter === "ALL" || v.severity === severityFilter
      const matchesStatus = statusFilter === "ALL" || v.status === statusFilter
      return matchesSearch && matchesSeverity && matchesStatus
    })
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])

  const stats = {
    total: mockVulnerabilities.length,
    critical: mockVulnerabilities.filter(v => v.severity === "CRITICAL").length,
    high: mockVulnerabilities.filter(v => v.severity === "HIGH").length,
    open: mockVulnerabilities.filter(v => v.status === "OPEN").length
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Vulnerabilidades"
        description="Gestión y seguimiento de vulnerabilidades detectadas"
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-slate-500">Total</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-600">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
              <p className="text-sm text-slate-500">Críticas</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-500">{stats.high}</div>
              <p className="text-sm text-slate-500">Altas</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.open}</div>
              <p className="text-sm text-slate-500">Abiertas</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar vulnerabilidades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value as Severity | "ALL")}
                className="h-10 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">Todas las severidades</option>
                <option value="CRITICAL">Crítica</option>
                <option value="HIGH">Alta</option>
                <option value="MEDIUM">Media</option>
                <option value="LOW">Baja</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as VulnerabilityStatus | "ALL")}
                className="h-10 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">Todos los estados</option>
                <option value="OPEN">Abierta</option>
                <option value="IN_PROGRESS">En Progreso</option>
                <option value="RESOLVED">Resuelta</option>
                <option value="FALSE_POSITIVE">Falso Positivo</option>
              </select>

              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Exportar
              </Button>

              <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4" />
                Nueva
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Vulnerability List */}
        <div className="space-y-4">
          {filteredVulns.map((vuln) => (
            <Card key={vuln.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "rounded-full p-2 mt-1",
                    vuln.severity === "CRITICAL" ? "bg-red-100" :
                    vuln.severity === "HIGH" ? "bg-orange-100" :
                    vuln.severity === "MEDIUM" ? "bg-yellow-100" : "bg-blue-100"
                  )}>
                    <AlertTriangle className={cn(
                      "h-5 w-5",
                      vuln.severity === "CRITICAL" ? "text-red-600" :
                      vuln.severity === "HIGH" ? "text-orange-500" :
                      vuln.severity === "MEDIUM" ? "text-yellow-600" : "text-blue-500"
                    )} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={getSeverityColor(vuln.severity)}>
                            {vuln.severity}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(vuln.status)}>
                            {vuln.status}
                          </Badge>
                          <span className="text-sm text-slate-500">{vuln.category}</span>
                          {vuln.cvssScore && (
                            <span className="text-sm font-medium text-slate-700">
                              CVSS: {vuln.cvssScore}
                            </span>
                          )}
                          {vuln.cweId && (
                            <span className="text-sm text-slate-500">{vuln.cweId}</span>
                          )}
                        </div>
                        <h3 className="mt-2 text-lg font-semibold text-slate-900">
                          {vuln.title}
                        </h3>
                        <p className="mt-1 text-slate-600">{vuln.description}</p>

                        <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                          <span>Componente: {vuln.affectedComponent}</span>
                          <span>Descubierto: {formatDate(vuln.discoveredAt)}</span>
                          {vuln.resolvedAt && (
                            <span className="text-emerald-600">
                              Resuelto: {formatDate(vuln.resolvedAt)}
                            </span>
                          )}
                        </div>

                        {vuln.remediation && (
                          <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                            <p className="text-sm font-medium text-slate-700">Remediación:</p>
                            <p className="text-sm text-slate-600">{vuln.remediation}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">
                          Ver detalles
                        </Button>
                        {vuln.affectedUrl && (
                          <Button variant="ghost" size="sm" className="gap-1">
                            <ExternalLink className="h-3 w-3" />
                            URL
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
