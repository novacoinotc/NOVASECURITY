// Scan Orchestrator
// Manages scan execution, scheduling, and result processing

import type { Finding, ScanResult, ScanTarget, ScanOptions } from './base'
import { runAllSecurityChecks } from './security-checks'

export interface ScanJob {
  id: string
  name: string
  type: 'FULL' | 'QUICK' | 'API' | 'AUTHENTICATION' | 'INJECTION' | 'CUSTOM'
  target: ScanTarget
  options?: ScanOptions
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  progress: number
  startedAt?: Date
  completedAt?: Date
  result?: ScanResult
  error?: string
}

// In-memory job store (would be replaced with DB in production)
const jobs = new Map<string, ScanJob>()

export function createScanJob(
  name: string,
  type: ScanJob['type'],
  target: ScanTarget,
  options?: ScanOptions
): ScanJob {
  const id = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const job: ScanJob = {
    id,
    name,
    type,
    target,
    options,
    status: 'PENDING',
    progress: 0
  }

  jobs.set(id, job)
  return job
}

export function getScanJob(id: string): ScanJob | undefined {
  return jobs.get(id)
}

export function getAllScanJobs(): ScanJob[] {
  return Array.from(jobs.values())
}

export async function executeScan(jobId: string): Promise<ScanResult> {
  const job = jobs.get(jobId)
  if (!job) {
    throw new Error(`Scan job ${jobId} not found`)
  }

  // Update status
  job.status = 'RUNNING'
  job.startedAt = new Date()
  job.progress = 0

  const startTime = Date.now()

  try {
    let findings: Finding[] = []

    // Run appropriate scans based on type
    switch (job.type) {
      case 'FULL':
        // Full scan runs all checks
        job.progress = 10
        findings = await runAllSecurityChecks(job.target.url)
        job.progress = 90
        break

      case 'QUICK':
        // Quick scan runs only essential checks
        job.progress = 20
        findings = await runQuickScan(job.target.url)
        job.progress = 90
        break

      case 'API':
        // API specific security checks
        job.progress = 20
        findings = await runAPIScan(job.target.url)
        job.progress = 90
        break

      case 'AUTHENTICATION':
        // Auth-focused checks
        job.progress = 20
        findings = await runAuthScan(job.target.url)
        job.progress = 90
        break

      case 'INJECTION':
        // Injection vulnerability checks
        job.progress = 20
        findings = await runInjectionScan(job.target.url)
        job.progress = 90
        break

      default:
        findings = await runAllSecurityChecks(job.target.url)
    }

    const endTime = Date.now()
    const duration = Math.round((endTime - startTime) / 1000)

    const result: ScanResult = {
      scanner: 'novacore-security',
      version: '1.0.0',
      startedAt: job.startedAt,
      completedAt: new Date(),
      duration,
      findings,
      errors: [],
      stats: {
        requestsMade: findings.length * 10, // Estimated
        endpointsScanned: 15,
        vulnerabilitiesFound: findings.length
      }
    }

    job.status = 'COMPLETED'
    job.completedAt = new Date()
    job.progress = 100
    job.result = result

    return result

  } catch (error) {
    job.status = 'FAILED'
    job.error = error instanceof Error ? error.message : 'Unknown error'
    job.completedAt = new Date()
    throw error
  }
}

// Specialized scan functions
async function runQuickScan(targetUrl: string): Promise<Finding[]> {
  // Simulated quick scan - checks only critical items
  const { checkSecurityHeaders } = await import('./security-checks')
  return (await checkSecurityHeaders(targetUrl))
    .filter(r => !r.passed && r.finding)
    .map(r => r.finding!)
}

async function runAPIScan(targetUrl: string): Promise<Finding[]> {
  const { checkRateLimiting, checkRBACBypass } = await import('./security-checks')
  const results = [
    ...(await checkRateLimiting(targetUrl)),
    ...(await checkRBACBypass(targetUrl))
  ]
  return results.filter(r => !r.passed && r.finding).map(r => r.finding!)
}

async function runAuthScan(targetUrl: string): Promise<Finding[]> {
  const { checkJWTConfiguration } = await import('./security-checks')
  return (await checkJWTConfiguration(targetUrl))
    .filter(r => !r.passed && r.finding)
    .map(r => r.finding!)
}

async function runInjectionScan(targetUrl: string): Promise<Finding[]> {
  const { checkSQLInjection, checkXSS } = await import('./security-checks')
  const results = [
    ...(await checkSQLInjection(targetUrl)),
    ...(await checkXSS(targetUrl))
  ]
  return results.filter(r => !r.passed && r.finding).map(r => r.finding!)
}

// Scheduling
export interface ScheduledScan {
  id: string
  name: string
  type: ScanJob['type']
  target: ScanTarget
  cronExpression: string
  enabled: boolean
  lastRun?: Date
  nextRun?: Date
}

const scheduledScans = new Map<string, ScheduledScan>()

export function createScheduledScan(
  name: string,
  type: ScanJob['type'],
  target: ScanTarget,
  cronExpression: string
): ScheduledScan {
  const id = `schedule_${Date.now()}`

  const schedule: ScheduledScan = {
    id,
    name,
    type,
    target,
    cronExpression,
    enabled: true
  }

  scheduledScans.set(id, schedule)
  return schedule
}

export function getScheduledScans(): ScheduledScan[] {
  return Array.from(scheduledScans.values())
}
