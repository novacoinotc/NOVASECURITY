"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatRelativeTime } from "@/lib/utils"
import {
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import type { Scan } from "@/types"

interface RecentScansProps {
  scans: Scan[]
}

const statusConfig = {
  PENDING: { icon: Clock, color: "text-slate-500", bg: "bg-slate-100" },
  RUNNING: { icon: Loader2, color: "text-blue-500", bg: "bg-blue-100", animate: true },
  COMPLETED: { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-100" },
  FAILED: { icon: XCircle, color: "text-red-500", bg: "bg-red-100" },
  CANCELLED: { icon: XCircle, color: "text-slate-400", bg: "bg-slate-100" }
}

export function RecentScans({ scans }: RecentScansProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Escaneos Recientes</CardTitle>
        <div className="flex items-center gap-2">
          <Link href="/scans/new">
            <Button size="sm" className="gap-1 bg-emerald-600 hover:bg-emerald-700">
              <Play className="h-4 w-4" />
              Nuevo Escaneo
            </Button>
          </Link>
          <Link href="/scans">
            <Button variant="ghost" size="sm" className="gap-1">
              Ver todos
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {scans.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              No hay escaneos registrados
            </div>
          ) : (
            scans.map((scan) => {
              const status = statusConfig[scan.status]
              const StatusIcon = status.icon
              return (
                <div
                  key={scan.id}
                  className="flex items-center gap-4 rounded-lg border p-4 transition-shadow hover:shadow-md"
                >
                  <div className={cn("rounded-full p-2", status.bg)}>
                    <StatusIcon
                      className={cn(
                        "h-5 w-5",
                        status.color,
                        status.animate && "animate-spin"
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-slate-900 truncate">
                        {scan.name}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {scan.type}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                      <span>{scan.scanner}</span>
                      <span>|</span>
                      <span>{scan.targetUrl}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {scan.status === "COMPLETED" && (
                      <p className={cn(
                        "text-lg font-semibold",
                        scan.findings > 0 ? "text-red-500" : "text-emerald-500"
                      )}>
                        {scan.findings} hallazgos
                      </p>
                    )}
                    <p className="text-xs text-slate-400">
                      {scan.completedAt
                        ? formatRelativeTime(scan.completedAt)
                        : scan.startedAt
                        ? "En progreso..."
                        : "Pendiente"}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
