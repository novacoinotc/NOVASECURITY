import { NextRequest, NextResponse } from 'next/server'
import { getScanJob } from '@/lib/scanners/scan-orchestrator'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const job = getScanJob(id)

  if (!job) {
    return NextResponse.json(
      { success: false, error: 'Scan not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    data: {
      id: job.id,
      name: job.name,
      type: job.type,
      status: job.status,
      progress: job.progress,
      target: {
        url: job.target.url,
        type: job.target.type
      },
      startedAt: job.startedAt,
      completedAt: job.completedAt,
      duration: job.result?.duration,
      result: job.result ? {
        findings: job.result.findings,
        stats: job.result.stats,
        errors: job.result.errors
      } : null,
      error: job.error
    }
  })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const job = getScanJob(id)

  if (!job) {
    return NextResponse.json(
      { success: false, error: 'Scan not found' },
      { status: 404 }
    )
  }

  if (job.status === 'RUNNING') {
    // Mark as cancelled
    job.status = 'CANCELLED'
    job.completedAt = new Date()
  }

  return NextResponse.json({
    success: true,
    message: 'Scan cancelled'
  })
}
