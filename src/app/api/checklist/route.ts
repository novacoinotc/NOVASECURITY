import { NextRequest, NextResponse } from 'next/server'

// Checklist data structure
const checklistData = {
  categories: [
    {
      id: "auth",
      name: "Identidad, Autenticación y Sesiones",
      items: [
        { code: "AUTH-001", status: "COMPLIANT", evaluatedAt: new Date().toISOString() },
        { code: "AUTH-002", status: "PARTIAL", evaluatedAt: new Date().toISOString() },
        { code: "AUTH-003", status: "NON_COMPLIANT", evaluatedAt: new Date().toISOString() },
        { code: "AUTH-004", status: "COMPLIANT", evaluatedAt: new Date().toISOString() },
        { code: "AUTH-005", status: "PARTIAL", evaluatedAt: new Date().toISOString() },
        { code: "AUTH-006", status: "COMPLIANT", evaluatedAt: new Date().toISOString() },
        { code: "AUTH-007", status: "NON_COMPLIANT", evaluatedAt: new Date().toISOString() },
        { code: "AUTH-008", status: "COMPLIANT", evaluatedAt: new Date().toISOString() }
      ]
    },
    {
      id: "rbac",
      name: "Roles, Permisos y Segregación",
      items: [
        { code: "RBAC-001", status: "PARTIAL", evaluatedAt: new Date().toISOString() },
        { code: "RBAC-002", status: "COMPLIANT", evaluatedAt: new Date().toISOString() },
        { code: "RBAC-003", status: "COMPLIANT", evaluatedAt: new Date().toISOString() },
        { code: "RBAC-004", status: "PARTIAL", evaluatedAt: new Date().toISOString() },
        { code: "RBAC-005", status: "NON_COMPLIANT", evaluatedAt: new Date().toISOString() }
      ]
    }
  ]
}

export async function GET() {
  // Calculate compliance score
  const allItems = checklistData.categories.flatMap(c => c.items)
  const compliant = allItems.filter(i => i.status === "COMPLIANT").length
  const partial = allItems.filter(i => i.status === "PARTIAL").length
  const score = Math.round(((compliant + partial * 0.5) / allItems.length) * 100)

  return NextResponse.json({
    success: true,
    data: checklistData,
    meta: {
      totalItems: allItems.length,
      compliant,
      partial,
      nonCompliant: allItems.filter(i => i.status === "NON_COMPLIANT").length,
      complianceScore: score
    }
  })
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.code || !body.status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: code, status' },
        { status: 400 }
      )
    }

    const validStatuses = ['COMPLIANT', 'PARTIAL', 'NON_COMPLIANT', 'NOT_EVALUATED', 'NOT_APPLICABLE']
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    // Find and update the item
    for (const category of checklistData.categories) {
      const item = category.items.find(i => i.code === body.code)
      if (item) {
        item.status = body.status
        item.evaluatedAt = new Date().toISOString()

        return NextResponse.json({
          success: true,
          data: item,
          message: 'Checklist item updated'
        })
      }
    }

    return NextResponse.json(
      { success: false, error: 'Checklist item not found' },
      { status: 404 }
    )

  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
