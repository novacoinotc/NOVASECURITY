"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Shield,
  Bug,
  Scan,
  FileText,
  Settings,
  AlertTriangle,
  CheckSquare,
  Target
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Vulnerabilidades", href: "/vulnerabilities", icon: Bug },
  { name: "Checklist Seguridad", href: "/checklist", icon: CheckSquare },
  { name: "Escaneos", href: "/scans", icon: Scan },
  { name: "Reportes", href: "/reports", icon: FileText },
  { name: "Alertas", href: "/alerts", icon: AlertTriangle },
  { name: "Targets", href: "/targets", icon: Target },
  { name: "Configuración", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-slate-800">
        <Shield className="h-8 w-8 text-emerald-500" />
        <div>
          <h1 className="text-lg font-bold text-white">NOVACORE</h1>
          <p className="text-xs text-slate-400">Security Monitor</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Status */}
      <div className="border-t border-slate-800 p-4">
        <div className="rounded-lg bg-slate-800 p-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-400">Sistema activo</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Último escaneo: hace 2 horas
          </p>
        </div>
      </div>
    </div>
  )
}
