import { NextRequest, NextResponse } from 'next/server'

// Mock data
const reports = [
  {
    id: "1",
    title: "Reporte Semanal de Seguridad",
    type: "WEEKLY",
    period: "2024-W02",
    status: "PUBLISHED",
    summary: {
      totalVulnerabilities: 23,
      criticalCount: 3,
      highCount: 8,
      mediumCount: 9,
      lowCount: 3,
      complianceScore: 67,
      topCategories: ["Injection", "Authentication", "API Security"]
    },
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString()
  }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const status = searchParams.get('status')

  let filtered = [...reports]

  if (type) {
    filtered = filtered.filter(r => r.type === type)
  }
  if (status) {
    filtered = filtered.filter(r => r.status === status)
  }

  return NextResponse.json({
    success: true,
    data: filtered,
    meta: {
      total: filtered.length
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validTypes = ['WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUAL', 'INCIDENT', 'AUDIT']
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { success: false, error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Generate report based on current data
    const newReport = {
      id: `report_${Date.now()}`,
      title: body.title || `Reporte ${body.type} - ${new Date().toISOString().slice(0, 10)}`,
      type: body.type,
      period: body.period || getCurrentPeriod(body.type),
      status: "DRAFT",
      summary: generateReportSummary(),
      createdAt: new Date().toISOString()
    }

    reports.push(newReport)

    return NextResponse.json({
      success: true,
      data: newReport
    }, { status: 201 })

  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    )
  }
}

function getCurrentPeriod(type: string): string {
  const now = new Date()
  switch (type) {
    case 'WEEKLY':
      const weekNum = Math.ceil(
        ((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 86400000 +
          new Date(now.getFullYear(), 0, 1).getDay() + 1) / 7
      )
      return `${now.getFullYear()}-W${weekNum.toString().padStart(2, '0')}`
    case 'MONTHLY':
      return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`
    case 'QUARTERLY':
      return `${now.getFullYear()}-Q${Math.ceil((now.getMonth() + 1) / 3)}`
    default:
      return now.toISOString().slice(0, 10)
  }
}

function generateReportSummary() {
  // In production, this would aggregate real vulnerability data
  return {
    totalVulnerabilities: 23,
    criticalCount: 3,
    highCount: 8,
    mediumCount: 9,
    lowCount: 3,
    complianceScore: 67,
    topCategories: ["Injection", "Authentication", "API Security"],
    recommendations: [
      "Priorizar corrección de vulnerabilidades SQL Injection",
      "Implementar rate limiting en APIs financieras",
      "Revisar configuración de JWT tokens"
    ]
  }
}
