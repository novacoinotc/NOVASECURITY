import { NextRequest, NextResponse } from 'next/server'
import {
  createScanJob,
  getAllScanJobs,
  executeScan
} from '@/lib/scanners/scan-orchestrator'

export async function GET() {
  const jobs = getAllScanJobs()

  return NextResponse.json({
    success: true,
    data: jobs.map(job => ({
      id: job.id,
      name: job.name,
      type: job.type,
      status: job.status,
      progress: job.progress,
      targetUrl: job.target.url,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
      findings: job.result?.stats.vulnerabilitiesFound || 0,
      error: job.error
    })),
    meta: {
      total: jobs.length,
      running: jobs.filter(j => j.status === 'RUNNING').length,
      completed: jobs.filter(j => j.status === 'COMPLETED').length
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.targetUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, targetUrl' },
        { status: 400 }
      )
    }

    // Validate scan type
    const validTypes = ['FULL', 'QUICK', 'API', 'AUTHENTICATION', 'INJECTION', 'CUSTOM']
    const type = body.type || 'FULL'
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Create scan job
    const job = createScanJob(
      body.name,
      type,
      {
        url: body.targetUrl,
        type: body.targetType || 'web',
        auth: body.auth,
        headers: body.headers
      },
      body.options
    )

    // Execute scan in background (non-blocking)
    executeScan(job.id).catch(error => {
      console.error(`Scan ${job.id} failed:`, error)
    })

    return NextResponse.json({
      success: true,
      data: {
        id: job.id,
        name: job.name,
        type: job.type,
        status: job.status,
        targetUrl: job.target.url
      },
      message: 'Scan started successfully'
    }, { status: 201 })

  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
