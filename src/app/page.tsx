"use client"

import { Header } from "@/components/dashboard/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { VulnerabilityList } from "@/components/dashboard/vulnerability-list"
import { RiskGauge } from "@/components/dashboard/risk-gauge"
import { ComplianceOverview } from "@/components/dashboard/compliance-overview"
import { RecentScans } from "@/components/dashboard/recent-scans"
import { SeverityChart } from "@/components/dashboard/severity-chart"

// Mock data - será reemplazado con datos reales de la API
const mockStats = {
  totalVulnerabilities: 47,
  openVulnerabilities: 23,
  criticalCount: 3,
  highCount: 8,
  mediumCount: 12,
  lowCount: 18,
  complianceScore: 67,
  riskScore: 72
}

const mockVulnerabilities = [
  {
    id: "1",
    title: "SQL Injection en endpoint /api/transactions",
    description: "El parámetro 'account_id' es vulnerable a inyección SQL. Un atacante podría extraer datos sensibles de la base de datos incluyendo información de transacciones SPEI.",
    severity: "CRITICAL" as const,
    status: "OPEN" as const,
    category: "Injection",
    affectedComponent: "API Transacciones",
    affectedUrl: "/api/transactions?account_id=",
    discoveredAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    title: "JWT sin validación de firma",
    description: "Los tokens JWT no validan correctamente la firma, permitiendo la creación de tokens fraudulentos.",
    severity: "CRITICAL" as const,
    status: "IN_PROGRESS" as const,
    category: "Authentication",
    affectedComponent: "Sistema Auth",
    discoveredAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    title: "Falta de Rate Limiting en API de dispersiones",
    description: "El endpoint de dispersiones no tiene límite de peticiones, permitiendo ataques de fuerza bruta y DoS.",
    severity: "HIGH" as const,
    status: "OPEN" as const,
    category: "API Security",
    affectedComponent: "API Dispersiones",
    affectedUrl: "/api/dispersions",
    discoveredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "4",
    title: "Secrets expuestos en repositorio",
    description: "Se encontraron credenciales de base de datos en archivos .env commiteados al repositorio.",
    severity: "HIGH" as const,
    status: "RESOLVED" as const,
    category: "Secret Management",
    affectedComponent: "Configuración",
    discoveredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    resolvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "5",
    title: "Cross-Site Scripting (XSS) en dashboard",
    description: "El campo de notas en transacciones no sanitiza entrada HTML, permitiendo XSS stored.",
    severity: "MEDIUM" as const,
    status: "OPEN" as const,
    category: "XSS",
    affectedComponent: "Dashboard",
    affectedUrl: "/dashboard/transactions",
    discoveredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const mockScans = [
  {
    id: "1",
    name: "Escaneo Completo Semanal",
    type: "FULL" as const,
    status: "COMPLETED" as const,
    targetUrl: "https://staging.novacore.mx",
    scanner: "OWASP ZAP",
    findings: 12,
    startedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    name: "SQL Injection Scan",
    type: "INJECTION" as const,
    status: "RUNNING" as const,
    targetUrl: "https://staging.novacore.mx/api",
    scanner: "SQLMap",
    findings: 0,
    startedAt: new Date(Date.now() - 30 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    name: "API Authentication Test",
    type: "AUTHENTICATION" as const,
    status: "COMPLETED" as const,
    targetUrl: "https://staging.novacore.mx/api/auth",
    scanner: "Nuclei",
    findings: 3,
    startedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const mockComplianceCategories = [
  { id: "1", name: "Autenticación y Sesiones", icon: "Key", compliant: 5, total: 8, score: 62 },
  { id: "2", name: "Roles y Permisos (RBAC)", icon: "Users", compliant: 3, total: 5, score: 60 },
  { id: "3", name: "APIs y Servicios", icon: "Server", compliant: 4, total: 6, score: 67 },
  { id: "4", name: "Logs y Auditoría", icon: "FileText", compliant: 6, total: 7, score: 86 },
  { id: "5", name: "Infraestructura y Secretos", icon: "Lock", compliant: 3, total: 5, score: 60 },
  { id: "6", name: "Proveedores y Terceros", icon: "UserCheck", compliant: 2, total: 4, score: 50 },
  { id: "7", name: "Monitoreo y Respuesta", icon: "Activity", compliant: 4, total: 5, score: 80 },
  { id: "8", name: "Pruebas de Seguridad", icon: "TestTube", compliant: 3, total: 5, score: 60 }
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <Header
        title="Dashboard de Seguridad"
        description="NOVACORE - Monitoreo de vulnerabilidades y cumplimiento"
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stats Cards */}
        <StatsCards stats={mockStats} />

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Vulnerabilities */}
          <div className="lg:col-span-2 space-y-6">
            <VulnerabilityList vulnerabilities={mockVulnerabilities} />
            <RecentScans scans={mockScans} />
          </div>

          {/* Right Column - Risk & Compliance */}
          <div className="space-y-6">
            <RiskGauge score={mockStats.riskScore} />
            <SeverityChart
              data={{
                critical: mockStats.criticalCount,
                high: mockStats.highCount,
                medium: mockStats.mediumCount,
                low: mockStats.lowCount,
                info: 6
              }}
            />
            <ComplianceOverview
              categories={mockComplianceCategories}
              overallScore={mockStats.complianceScore}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
