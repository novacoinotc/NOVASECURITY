// ============================================
// NOVACORE Security - Type Definitions
// ============================================

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'
export type VulnerabilityStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'FALSE_POSITIVE' | 'ACCEPTED_RISK'
export type ScanType = 'FULL' | 'QUICK' | 'API' | 'AUTHENTICATION' | 'INJECTION' | 'CUSTOM'
export type ScanStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
export type ComplianceStatus = 'NOT_EVALUATED' | 'COMPLIANT' | 'PARTIAL' | 'NON_COMPLIANT' | 'NOT_APPLICABLE'
export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
export type ReportType = 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'INCIDENT' | 'AUDIT'

export interface Vulnerability {
  id: string
  title: string
  description: string
  severity: Severity
  status: VulnerabilityStatus
  category: string
  cvssScore?: number
  cweId?: string
  affectedComponent: string
  affectedUrl?: string
  evidenceData?: string
  remediation?: string
  discoveredAt: Date
  confirmedAt?: Date
  resolvedAt?: Date
  scanId?: string
  checklistItemId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Scan {
  id: string
  name: string
  type: ScanType
  status: ScanStatus
  targetUrl: string
  config?: Record<string, unknown>
  startedAt?: Date
  completedAt?: Date
  duration?: number
  findings: number
  scanner: string
  version?: string
  vulnerabilities?: Vulnerability[]
  createdAt: Date
  updatedAt: Date
}

export interface ChecklistCategory {
  id: string
  name: string
  description?: string
  order: number
  icon?: string
  items?: ChecklistItem[]
}

export interface ChecklistItem {
  id: string
  code: string
  title: string
  description: string
  requirement: string
  status: ComplianceStatus
  evidence?: string
  notes?: string
  priority: Priority
  standard: string
  categoryId: string
  category?: ChecklistCategory
  evaluatedAt?: Date
  evaluatedBy?: string
}

export interface DashboardStats {
  totalVulnerabilities: number
  openVulnerabilities: number
  criticalCount: number
  highCount: number
  mediumCount: number
  lowCount: number
  complianceScore: number
  lastScanDate?: Date
  riskScore: number
}

export interface SecurityChecklistData {
  categories: Array<{
    id: string
    name: string
    icon: string
    items: Array<{
      code: string
      title: string
      description: string
      requirement: string
      status: ComplianceStatus
      priority: Priority
    }>
  }>
}

// Scanner configurations
export interface ScannerConfig {
  scanner: 'zap' | 'nuclei' | 'sqlmap' | 'nikto' | 'custom'
  targetUrl: string
  options?: Record<string, unknown>
}

export interface ScanResult {
  scanner: string
  vulnerabilities: Array<{
    title: string
    description: string
    severity: Severity
    category: string
    affectedUrl?: string
    evidence?: string
    remediation?: string
    cweId?: string
    cvssScore?: number
  }>
  startedAt: Date
  completedAt: Date
  error?: string
}
