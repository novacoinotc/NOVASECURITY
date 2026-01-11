import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const then = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000)

  if (diffInSeconds < 60) return 'hace unos segundos'
  if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} min`
  if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`
  if (diffInSeconds < 604800) return `hace ${Math.floor(diffInSeconds / 86400)} días`
  return formatDate(date)
}

export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    CRITICAL: 'bg-red-600 text-white',
    HIGH: 'bg-orange-500 text-white',
    MEDIUM: 'bg-yellow-500 text-black',
    LOW: 'bg-blue-500 text-white',
    INFO: 'bg-gray-500 text-white'
  }
  return colors[severity] || colors.INFO
}

export function getSeverityBorderColor(severity: string): string {
  const colors: Record<string, string> = {
    CRITICAL: 'border-l-red-600',
    HIGH: 'border-l-orange-500',
    MEDIUM: 'border-l-yellow-500',
    LOW: 'border-l-blue-500',
    INFO: 'border-l-gray-500'
  }
  return colors[severity] || colors.INFO
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    OPEN: 'bg-red-100 text-red-800',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
    RESOLVED: 'bg-green-100 text-green-800',
    FALSE_POSITIVE: 'bg-gray-100 text-gray-800',
    ACCEPTED_RISK: 'bg-purple-100 text-purple-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export function getComplianceColor(status: string): string {
  const colors: Record<string, string> = {
    COMPLIANT: 'bg-green-100 text-green-800 border-green-300',
    PARTIAL: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    NON_COMPLIANT: 'bg-red-100 text-red-800 border-red-300',
    NOT_EVALUATED: 'bg-gray-100 text-gray-600 border-gray-300',
    NOT_APPLICABLE: 'bg-slate-100 text-slate-600 border-slate-300'
  }
  return colors[status] || colors.NOT_EVALUATED
}

export function calculateRiskScore(vulnerabilities: { severity: string }[]): number {
  const weights: Record<string, number> = {
    CRITICAL: 40,
    HIGH: 25,
    MEDIUM: 10,
    LOW: 3,
    INFO: 1
  }

  const totalWeight = vulnerabilities.reduce((acc, v) => {
    return acc + (weights[v.severity] || 0)
  }, 0)

  // Normalize to 0-100 scale (lower is better)
  const maxExpectedWeight = 500 // Adjust based on expected max vulnerabilities
  return Math.min(100, Math.round((totalWeight / maxExpectedWeight) * 100))
}

export function getWeekNumber(date: Date): string {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  return `${date.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`
}
