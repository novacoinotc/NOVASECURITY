"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn, getComplianceColor } from "@/lib/utils"
import {
  Key,
  Users,
  Server,
  FileText,
  Lock,
  UserCheck,
  Activity,
  TestTube,
  CheckCircle,
  XCircle,
  AlertCircle,
  MinusCircle,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import type { ComplianceStatus, Priority } from "@/types"

interface ChecklistItem {
  code: string
  title: string
  description: string
  requirement: string
  status: ComplianceStatus
  priority: Priority
  standard: string
  evidence?: string
  notes?: string
}

interface ChecklistCategory {
  id: string
  name: string
  icon: React.ElementType
  description: string
  items: ChecklistItem[]
}

const checklistData: ChecklistCategory[] = [
  {
    id: "auth",
    name: "Identidad, Autenticación y Sesiones",
    icon: Key,
    description: "Controles de acceso, MFA, tokens y manejo de sesiones",
    items: [
      {
        code: "AUTH-001",
        title: "MFA obligatorio en login",
        description: "Autenticación multifactor requerida para todos los usuarios",
        requirement: "MFA obligatorio (login + acciones críticas)",
        status: "COMPLIANT",
        priority: "CRITICAL",
        standard: "CNBV/ISO27001",
        evidence: "MFA implementado con TOTP y SMS backup"
      },
      {
        code: "AUTH-002",
        title: "MFA en acciones críticas",
        description: "MFA requerido para dispersiones, cambios de configuración, etc.",
        requirement: "MFA en operaciones sensibles",
        status: "PARTIAL",
        priority: "CRITICAL",
        standard: "CNBV",
        notes: "Falta implementar en cambio de beneficiarios"
      },
      {
        code: "AUTH-003",
        title: "Tokens JWT con expiración corta",
        description: "Access tokens con TTL máximo de 15 minutos",
        requirement: "Tokens JWT con expiración ≤15 min",
        status: "NON_COMPLIANT",
        priority: "HIGH",
        standard: "CNBV/ISO27001",
        notes: "Actualmente 24 horas, URGENTE corregir"
      },
      {
        code: "AUTH-004",
        title: "Refresh tokens separados",
        description: "Uso de refresh tokens independientes del access token",
        requirement: "Refresh tokens separados y seguros",
        status: "COMPLIANT",
        priority: "HIGH",
        standard: "ISO27001"
      },
      {
        code: "AUTH-005",
        title: "Revocación inmediata de tokens",
        description: "Capacidad de invalidar tokens en tiempo real",
        requirement: "Revocación inmediata de tokens comprometidos",
        status: "PARTIAL",
        priority: "HIGH",
        standard: "CNBV",
        notes: "Funciona pero tarda hasta 5 min en propagarse"
      },
      {
        code: "AUTH-006",
        title: "Protección contra reuso de tokens",
        description: "Detectar y prevenir uso de tokens revocados",
        requirement: "Protección contra reuso de tokens",
        status: "COMPLIANT",
        priority: "MEDIUM",
        standard: "ISO27001"
      },
      {
        code: "AUTH-007",
        title: "Detección de IPs no autorizadas",
        description: "Alertar accesos desde ubicaciones inusuales",
        requirement: "Protección contra IPs no autorizadas",
        status: "NON_COMPLIANT",
        priority: "HIGH",
        standard: "CNBV",
        notes: "No implementado, alto riesgo"
      },
      {
        code: "AUTH-008",
        title: "Invalidación al cambiar contraseña",
        description: "Cerrar todas las sesiones al cambiar password",
        requirement: "Invalidación de sesiones al cambiar contraseña",
        status: "COMPLIANT",
        priority: "MEDIUM",
        standard: "ISO27001"
      }
    ]
  },
  {
    id: "rbac",
    name: "Roles, Permisos y Segregación",
    icon: Users,
    description: "Control de acceso basado en roles, segregación de funciones",
    items: [
      {
        code: "RBAC-001",
        title: "RBAC implementado en código",
        description: "Verificación de permisos en backend, no solo UI",
        requirement: "RBAC estricto en código (no solo UI)",
        status: "PARTIAL",
        priority: "CRITICAL",
        standard: "CNBV",
        notes: "Algunos endpoints no validan roles correctamente"
      },
      {
        code: "RBAC-002",
        title: "Separación de funciones",
        description: "Distintos permisos para Lectura/Creación/Autorización/Ejecución",
        requirement: "Separación: Lectura/Creación/Autorización/Ejecución",
        status: "COMPLIANT",
        priority: "CRITICAL",
        standard: "CNBV"
      },
      {
        code: "RBAC-003",
        title: "Doble aprobación (maker/checker)",
        description: "Dos usuarios distintos para operaciones críticas",
        requirement: "Doble aprobación para operaciones críticas",
        status: "COMPLIANT",
        priority: "CRITICAL",
        standard: "CNBV",
        evidence: "Implementado en dispersiones y cambios de límites"
      },
      {
        code: "RBAC-004",
        title: "Verificación de conflicto de interés",
        description: "Usuario no puede crear Y autorizar la misma dispersión",
        requirement: "Verificar si usuario puede crear Y autorizar",
        status: "PARTIAL",
        priority: "CRITICAL",
        standard: "CNBV",
        notes: "Hay bypass en dispersiones programadas"
      },
      {
        code: "RBAC-005",
        title: "Principio de menor privilegio",
        description: "Usuarios con permisos mínimos necesarios",
        requirement: "Permisos mínimos por defecto",
        status: "NON_COMPLIANT",
        priority: "HIGH",
        standard: "ISO27001",
        notes: "Roles demasiado amplios, necesitan granularidad"
      }
    ]
  },
  {
    id: "apis",
    name: "APIs y Servicios",
    icon: Server,
    description: "Seguridad en endpoints, rate limiting, whitelisting",
    items: [
      {
        code: "API-001",
        title: "Autenticación en todas las APIs",
        description: "Ningún endpoint público sin autenticación",
        requirement: "Autenticación fuerte en todas las APIs",
        status: "PARTIAL",
        priority: "CRITICAL",
        standard: "CNBV",
        notes: "2 endpoints de health sin auth (revisar si necesario)"
      },
      {
        code: "API-002",
        title: "Rate limiting implementado",
        description: "Límites de peticiones por endpoint",
        requirement: "Rate limiting por endpoint",
        status: "NON_COMPLIANT",
        priority: "HIGH",
        standard: "ISO27001",
        notes: "URGENTE: No hay rate limiting en APIs financieras"
      },
      {
        code: "API-003",
        title: "IP Whitelisting en APIs críticas",
        description: "Solo IPs autorizadas pueden acceder a SPEI/dispersiones",
        requirement: "IP whitelisting en APIs de SPEI/balances/dispersión",
        status: "COMPLIANT",
        priority: "CRITICAL",
        standard: "CNBV",
        evidence: "Implementado en WAF y en aplicación"
      },
      {
        code: "API-004",
        title: "Requests firmados (HMAC)",
        description: "Peticiones críticas con firma criptográfica",
        requirement: "Requests críticos firmados (HMAC)",
        status: "COMPLIANT",
        priority: "HIGH",
        standard: "CNBV"
      },
      {
        code: "API-005",
        title: "Kill switches funcionales",
        description: "Capacidad de deshabilitar operaciones inmediatamente",
        requirement: "Kill switches para emergencias",
        status: "COMPLIANT",
        priority: "CRITICAL",
        standard: "CNBV",
        evidence: "Panel de emergencia probado mensualmente"
      },
      {
        code: "API-006",
        title: "Validación de entrada",
        description: "Sanitización de todos los inputs",
        requirement: "Input validation en todos los endpoints",
        status: "PARTIAL",
        priority: "HIGH",
        standard: "ISO27001",
        notes: "Faltan validaciones en algunos campos de texto libre"
      }
    ]
  },
  {
    id: "logs",
    name: "Logs y Auditoría",
    icon: FileText,
    description: "Registro de eventos, inmutabilidad, alertas",
    items: [
      {
        code: "LOG-001",
        title: "Logs de login completos",
        description: "Registro de todos los intentos de acceso",
        requirement: "Logs de login exitosos y fallidos",
        status: "COMPLIANT",
        priority: "HIGH",
        standard: "CNBV"
      },
      {
        code: "LOG-002",
        title: "Logs de acciones críticas",
        description: "Registro de dispersiones, cambios de config, etc.",
        requirement: "Logs de todas las acciones críticas",
        status: "COMPLIANT",
        priority: "CRITICAL",
        standard: "CNBV"
      },
      {
        code: "LOG-003",
        title: "Logs append-only",
        description: "Logs inmutables, no editables",
        requirement: "Logs append-only e inmutables",
        status: "COMPLIANT",
        priority: "HIGH",
        standard: "ISO27001",
        evidence: "CloudWatch Logs con policies de inmutabilidad"
      },
      {
        code: "LOG-004",
        title: "Almacenamiento separado",
        description: "Logs en sistema independiente de la DB principal",
        requirement: "Almacenamiento separado de la DB principal",
        status: "COMPLIANT",
        priority: "HIGH",
        standard: "ISO27001"
      },
      {
        code: "LOG-005",
        title: "Alertas por alteración",
        description: "Detectar intentos de modificar logs",
        requirement: "Alertas automáticas por alteración de logs",
        status: "PARTIAL",
        priority: "MEDIUM",
        standard: "ISO27001",
        notes: "Alertas configuradas pero no probadas recientemente"
      },
      {
        code: "LOG-006",
        title: "Retención adecuada",
        description: "Logs almacenados por tiempo requerido (5 años CNBV)",
        requirement: "Retención de 5 años mínimo",
        status: "COMPLIANT",
        priority: "HIGH",
        standard: "CNBV"
      },
      {
        code: "LOG-007",
        title: "Logs de errores",
        description: "Registro de excepciones y errores del sistema",
        requirement: "Logs de errores y excepciones",
        status: "COMPLIANT",
        priority: "MEDIUM",
        standard: "ISO27001"
      }
    ]
  },
  {
    id: "infra",
    name: "Infraestructura y Secretos",
    icon: Lock,
    description: "Gestión de secretos, acceso a producción, cloud security",
    items: [
      {
        code: "INF-001",
        title: "Secrets en manager",
        description: "Credenciales en AWS Secrets Manager, no en código",
        requirement: "Secrets en manager (no .env)",
        status: "PARTIAL",
        priority: "CRITICAL",
        standard: "ISO27001",
        notes: "70% migrado, quedan algunos en variables de entorno"
      },
      {
        code: "INF-002",
        title: "Producción sin IP pública",
        description: "Servidores de producción solo accesibles vía VPN",
        requirement: "Producción sin IP pública, requiere VPN+MFA",
        status: "COMPLIANT",
        priority: "CRITICAL",
        standard: "CNBV"
      },
      {
        code: "INF-003",
        title: "Menor privilegio en cloud",
        description: "IAM roles con permisos mínimos",
        requirement: "Menor privilegio en cuentas cloud",
        status: "PARTIAL",
        priority: "HIGH",
        standard: "ISO27001",
        notes: "Algunas cuentas tienen AdministratorAccess"
      },
      {
        code: "INF-004",
        title: "Escaneo de puertos",
        description: "Monitoreo continuo de puertos expuestos",
        requirement: "Escaneo de puertos/buckets/servicios expuestos",
        status: "COMPLIANT",
        priority: "HIGH",
        standard: "ISO27001"
      },
      {
        code: "INF-005",
        title: "Encriptación en reposo",
        description: "Datos encriptados en base de datos y backups",
        requirement: "Encriptación de datos en reposo",
        status: "COMPLIANT",
        priority: "CRITICAL",
        standard: "CNBV"
      }
    ]
  },
  {
    id: "vendors",
    name: "Proveedores y Terceros",
    icon: UserCheck,
    description: "Gestión de accesos externos, trazabilidad",
    items: [
      {
        code: "VEN-001",
        title: "Accesos temporales",
        description: "Proveedores con acceso limitado en tiempo",
        requirement: "Accesos temporales y auditados",
        status: "PARTIAL",
        priority: "HIGH",
        standard: "CNBV",
        notes: "Algunos accesos no tienen fecha de expiración"
      },
      {
        code: "VEN-002",
        title: "Revocación automática de ex-empleados",
        description: "Desactivar accesos al terminar relación laboral",
        requirement: "Revocación automática de ex-empleados",
        status: "NON_COMPLIANT",
        priority: "CRITICAL",
        standard: "CNBV",
        notes: "URGENTE: Proceso manual, hay retrasos de hasta 1 semana"
      },
      {
        code: "VEN-003",
        title: "Trazabilidad de terceros",
        description: "Registro completo de acciones de proveedores",
        requirement: "Trazabilidad completa",
        status: "COMPLIANT",
        priority: "HIGH",
        standard: "CNBV"
      },
      {
        code: "VEN-004",
        title: "Contratos de confidencialidad",
        description: "NDAs firmados con todos los proveedores",
        requirement: "NDAs y acuerdos de seguridad",
        status: "COMPLIANT",
        priority: "MEDIUM",
        standard: "ISO27001"
      }
    ]
  },
  {
    id: "monitoring",
    name: "Monitoreo y Respuesta",
    icon: Activity,
    description: "Detección de anomalías, alertas, respuesta a incidentes",
    items: [
      {
        code: "MON-001",
        title: "Detección de anomalías",
        description: "Identificar comportamientos inusuales",
        requirement: "Detección de comportamiento anómalo",
        status: "COMPLIANT",
        priority: "HIGH",
        standard: "CNBV",
        evidence: "ML model para detección de fraude implementado"
      },
      {
        code: "MON-002",
        title: "Alertas en tiempo real",
        description: "Notificaciones inmediatas de eventos críticos",
        requirement: "Alertas en tiempo real",
        status: "COMPLIANT",
        priority: "CRITICAL",
        standard: "CNBV"
      },
      {
        code: "MON-003",
        title: "Plan de respuesta a incidentes",
        description: "Procedimientos documentados para incidentes",
        requirement: "Plan de respuesta a incidentes",
        status: "COMPLIANT",
        priority: "CRITICAL",
        standard: "CNBV/ISO27001"
      },
      {
        code: "MON-004",
        title: "Kill switch de operaciones",
        description: "Capacidad de congelar operaciones inmediatamente",
        requirement: "Capacidad de congelar operaciones",
        status: "COMPLIANT",
        priority: "CRITICAL",
        standard: "CNBV"
      },
      {
        code: "MON-005",
        title: "Dashboard de seguridad",
        description: "Visibilidad en tiempo real del estado de seguridad",
        requirement: "Monitoreo centralizado",
        status: "PARTIAL",
        priority: "MEDIUM",
        standard: "ISO27001",
        notes: "Este proyecto lo está implementando"
      }
    ]
  },
  {
    id: "testing",
    name: "Pruebas de Seguridad",
    icon: TestTube,
    description: "Pentesting, simulaciones, ambientes separados",
    items: [
      {
        code: "TST-001",
        title: "Pentesting periódico",
        description: "Pruebas de penetración al menos trimestrales",
        requirement: "Pentesting periódico",
        status: "PARTIAL",
        priority: "HIGH",
        standard: "CNBV",
        notes: "Último pentest hace 6 meses, debe ser trimestral"
      },
      {
        code: "TST-002",
        title: "Simulación de fraude interno",
        description: "Ejercicios de red team para fraude interno",
        requirement: "Simulaciones de fraude interno",
        status: "NON_COMPLIANT",
        priority: "HIGH",
        standard: "CNBV",
        notes: "Nunca se ha realizado"
      },
      {
        code: "TST-003",
        title: "Ambientes separados",
        description: "Desarrollo, QA y Producción completamente aislados",
        requirement: "Ambientes separados (dev/qa/prod)",
        status: "COMPLIANT",
        priority: "CRITICAL",
        standard: "ISO27001"
      },
      {
        code: "TST-004",
        title: "Simulación de credenciales comprometidas",
        description: "Ejercicios de respuesta a robo de credenciales",
        requirement: "Simulación de credenciales comprometidas",
        status: "NON_COMPLIANT",
        priority: "MEDIUM",
        standard: "ISO27001",
        notes: "Planificado para Q2"
      },
      {
        code: "TST-005",
        title: "Escaneo automatizado",
        description: "Escaneos de seguridad en CI/CD",
        requirement: "Seguridad en pipeline de desarrollo",
        status: "PARTIAL",
        priority: "HIGH",
        standard: "ISO27001",
        notes: "Solo SAST, falta DAST"
      }
    ]
  }
]

const statusIcons: Record<ComplianceStatus, React.ElementType> = {
  COMPLIANT: CheckCircle,
  PARTIAL: AlertCircle,
  NON_COMPLIANT: XCircle,
  NOT_EVALUATED: MinusCircle,
  NOT_APPLICABLE: MinusCircle
}

const statusLabels: Record<ComplianceStatus, string> = {
  COMPLIANT: "Cumple",
  PARTIAL: "Parcial",
  NON_COMPLIANT: "No Cumple",
  NOT_EVALUATED: "No Evaluado",
  NOT_APPLICABLE: "N/A"
}

export default function ChecklistPage() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    checklistData.map(c => c.id)
  )

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    )
  }

  // Calculate overall stats
  const allItems = checklistData.flatMap(c => c.items)
  const stats = {
    total: allItems.length,
    compliant: allItems.filter(i => i.status === "COMPLIANT").length,
    partial: allItems.filter(i => i.status === "PARTIAL").length,
    nonCompliant: allItems.filter(i => i.status === "NON_COMPLIANT").length,
    notEvaluated: allItems.filter(i => i.status === "NOT_EVALUATED").length
  }

  const complianceScore = Math.round(
    ((stats.compliant + stats.partial * 0.5) / stats.total) * 100
  )

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Checklist de Seguridad"
        description="Evaluación de cumplimiento CNBV / ISO 27001"
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Overall Score */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Cumplimiento General</h3>
                <p className="text-sm text-slate-500">
                  {stats.compliant} de {stats.total} controles implementados
                </p>
              </div>
              <div className="text-right">
                <p className={cn(
                  "text-4xl font-bold",
                  complianceScore >= 80 ? "text-emerald-600" :
                  complianceScore >= 60 ? "text-yellow-600" : "text-red-600"
                )}>
                  {complianceScore}%
                </p>
              </div>
            </div>
            <Progress
              value={complianceScore}
              className="mt-4 h-3"
              indicatorClassName={
                complianceScore >= 80 ? "bg-emerald-500" :
                complianceScore >= 60 ? "bg-yellow-500" : "bg-red-500"
              }
            />
            <div className="mt-4 flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span>{stats.compliant} Cumple</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span>{stats.partial} Parcial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span>{stats.nonCompliant} No Cumple</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="space-y-4">
          {checklistData.map((category) => {
            const Icon = category.icon
            const isExpanded = expandedCategories.includes(category.id)
            const categoryItems = category.items
            const categoryStats = {
              compliant: categoryItems.filter(i => i.status === "COMPLIANT").length,
              partial: categoryItems.filter(i => i.status === "PARTIAL").length,
              nonCompliant: categoryItems.filter(i => i.status === "NON_COMPLIANT").length
            }
            const categoryScore = Math.round(
              ((categoryStats.compliant + categoryStats.partial * 0.5) / categoryItems.length) * 100
            )

            return (
              <Card key={category.id}>
                <CardHeader
                  className="cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "rounded-lg p-2",
                        categoryScore >= 80 ? "bg-emerald-100" :
                        categoryScore >= 60 ? "bg-yellow-100" : "bg-red-100"
                      )}>
                        <Icon className={cn(
                          "h-5 w-5",
                          categoryScore >= 80 ? "text-emerald-600" :
                          categoryScore >= 60 ? "text-yellow-600" : "text-red-600"
                        )} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <p className="text-sm text-slate-500">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={cn(
                          "text-xl font-bold",
                          categoryScore >= 80 ? "text-emerald-600" :
                          categoryScore >= 60 ? "text-yellow-600" : "text-red-600"
                        )}>
                          {categoryScore}%
                        </p>
                        <p className="text-xs text-slate-500">
                          {categoryStats.compliant}/{categoryItems.length} controles
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="border-t">
                    <div className="divide-y">
                      {category.items.map((item) => {
                        const StatusIcon = statusIcons[item.status]
                        return (
                          <div key={item.code} className="py-4">
                            <div className="flex items-start gap-4">
                              <div className={cn(
                                "rounded-full p-1.5 mt-0.5",
                                item.status === "COMPLIANT" ? "bg-emerald-100" :
                                item.status === "PARTIAL" ? "bg-yellow-100" :
                                item.status === "NON_COMPLIANT" ? "bg-red-100" : "bg-slate-100"
                              )}>
                                <StatusIcon className={cn(
                                  "h-4 w-4",
                                  item.status === "COMPLIANT" ? "text-emerald-600" :
                                  item.status === "PARTIAL" ? "text-yellow-600" :
                                  item.status === "NON_COMPLIANT" ? "text-red-600" : "text-slate-400"
                                )} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono text-xs text-slate-400">
                                    {item.code}
                                  </span>
                                  <Badge className={getComplianceColor(item.status)}>
                                    {statusLabels[item.status]}
                                  </Badge>
                                  <Badge variant="outline" className={cn(
                                    item.priority === "CRITICAL" ? "border-red-300 text-red-700" :
                                    item.priority === "HIGH" ? "border-orange-300 text-orange-700" :
                                    "border-slate-300 text-slate-700"
                                  )}>
                                    {item.priority}
                                  </Badge>
                                  <span className="text-xs text-slate-400">{item.standard}</span>
                                </div>
                                <h4 className="mt-1 font-medium text-slate-900">
                                  {item.title}
                                </h4>
                                <p className="text-sm text-slate-600">{item.description}</p>
                                <p className="mt-1 text-xs text-slate-500">
                                  Requerimiento: {item.requirement}
                                </p>
                                {item.notes && (
                                  <div className={cn(
                                    "mt-2 p-2 rounded text-sm",
                                    item.status === "NON_COMPLIANT" ? "bg-red-50 text-red-700" :
                                    item.status === "PARTIAL" ? "bg-yellow-50 text-yellow-700" :
                                    "bg-slate-50 text-slate-600"
                                  )}>
                                    <strong>Nota:</strong> {item.notes}
                                  </div>
                                )}
                                {item.evidence && (
                                  <div className="mt-2 p-2 rounded bg-emerald-50 text-sm text-emerald-700">
                                    <strong>Evidencia:</strong> {item.evidence}
                                  </div>
                                )}
                              </div>
                              <Button variant="outline" size="sm">
                                Evaluar
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
