// Base Scanner Interface and Types
// This module defines the core scanner functionality

export interface ScanTarget {
  url: string
  type: 'web' | 'api' | 'internal'
  auth?: {
    type: 'bearer' | 'basic' | 'cookie' | 'api-key'
    credentials: Record<string, string>
  }
  headers?: Record<string, string>
}

export interface ScanOptions {
  depth?: number
  threads?: number
  timeout?: number
  excludePatterns?: string[]
  includePatterns?: string[]
  customPayloads?: string[]
}

export interface Finding {
  title: string
  description: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'
  category: string
  affectedUrl?: string
  evidence?: string
  remediation?: string
  cweId?: string
  cvssScore?: number
  references?: string[]
}

export interface ScanResult {
  scanner: string
  version?: string
  startedAt: Date
  completedAt: Date
  duration: number // seconds
  findings: Finding[]
  errors: string[]
  stats: {
    requestsMade: number
    endpointsScanned: number
    vulnerabilitiesFound: number
  }
}

export abstract class BaseScanner {
  abstract name: string
  abstract version: string

  abstract scan(target: ScanTarget, options?: ScanOptions): Promise<ScanResult>

  protected createEmptyResult(): ScanResult {
    return {
      scanner: this.name,
      version: this.version,
      startedAt: new Date(),
      completedAt: new Date(),
      duration: 0,
      findings: [],
      errors: [],
      stats: {
        requestsMade: 0,
        endpointsScanned: 0,
        vulnerabilitiesFound: 0
      }
    }
  }

  protected categorizeFindings(findings: Finding[]): Record<string, Finding[]> {
    return findings.reduce((acc, finding) => {
      const category = finding.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(finding)
      return acc
    }, {} as Record<string, Finding[]>)
  }
}
