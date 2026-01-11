import { NextRequest, NextResponse } from 'next/server'

// Mock data - would be replaced with Prisma queries
const vulnerabilities = [
  {
    id: "1",
    title: "SQL Injection en endpoint /api/transactions",
    description: "El parámetro 'account_id' es vulnerable a inyección SQL.",
    severity: "CRITICAL",
    status: "OPEN",
    category: "Injection",
    cvssScore: 9.8,
    cweId: "CWE-89",
    affectedComponent: "API Transacciones",
    affectedUrl: "/api/transactions?account_id=",
    remediation: "Usar consultas parametrizadas.",
    discoveredAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const severity = searchParams.get('severity')
  const status = searchParams.get('status')
  const category = searchParams.get('category')

  let filtered = [...vulnerabilities]

  if (severity) {
    filtered = filtered.filter(v => v.severity === severity)
  }
  if (status) {
    filtered = filtered.filter(v => v.status === status)
  }
  if (category) {
    filtered = filtered.filter(v => v.category === category)
  }

  return NextResponse.json({
    success: true,
    data: filtered,
    meta: {
      total: filtered.length,
      filters: { severity, status, category }
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const required = ['title', 'description', 'severity', 'category', 'affectedComponent']
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate severity
    const validSeverities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']
    if (!validSeverities.includes(body.severity)) {
      return NextResponse.json(
        { success: false, error: `Invalid severity. Must be one of: ${validSeverities.join(', ')}` },
        { status: 400 }
      )
    }

    const newVuln = {
      id: `vuln_${Date.now()}`,
      ...body,
      status: body.status || 'OPEN',
      discoveredAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    vulnerabilities.push(newVuln)

    return NextResponse.json({
      success: true,
      data: newVuln
    }, { status: 201 })

  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
