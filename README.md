# NOVACORE Security

Sistema de seguridad automatizados para monitoreo de vulnerabilidades y cumplimiento normativo (CNBV/ISO 27001) del sistema financiero NOVACORE.

## Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                        NOVACORE SECURITY                        │
├─────────────────────────────────────────────────────────────────┤
│  Frontend (Vercel)          │  Backend APIs (Next.js)          │
│  ┌───────────────────────┐  │  ┌───────────────────────────┐   │
│  │  Dashboard            │  │  │  /api/vulnerabilities     │   │
│  │  Vulnerabilidades     │  │  │  /api/scans               │   │
│  │  Checklist Seguridad  │  │  │  /api/reports             │   │
│  │  Escaneos             │  │  │  /api/checklist           │   │
│  │  Reportes             │  │  │  /api/health              │   │
│  │  Alertas              │  │  └───────────────────────────┘   │
│  └───────────────────────┘  │                                   │
├─────────────────────────────┴───────────────────────────────────┤
│  Base de Datos (Neon PostgreSQL)                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  vulnerabilities │ scans │ checklist_items │ reports     │  │
│  │  alerts │ audit_logs │ targets                            │  │
│  └───────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  Scanners (Railway - opcional)                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │  OWASP ZAP  │ │   SQLMap    │ │   Nuclei    │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

## Funcionalidades

### Dashboard Principal
- Resumen de vulnerabilidades por severidad (CRÍTICO/ALTO/MEDIO/BAJO)
- Indicador de riesgo general
- Score de cumplimiento normativo
- Escaneos recientes y su estado
- Distribución de vulnerabilidades por categoría

### Gestión de Vulnerabilidades
- Lista completa con filtros por severidad, estado y categoría
- Detalles incluyendo CVSS score, CWE ID, evidencia
- Recomendaciones de remediación
- Tracking de estado (OPEN → IN_PROGRESS → RESOLVED)

### Checklist de Seguridad (CNBV/ISO 27001)
Evaluación de 8 categorías con 45+ controles:

1. **Identidad, Autenticación y Sesiones**
   - MFA obligatorio
   - Tokens JWT con expiración ≤15 min
   - Revocación inmediata de tokens

2. **Roles, Permisos y Segregación**
   - RBAC estricto en código
   - Doble aprobación (maker/checker)
   - Principio de menor privilegio

3. **APIs y Servicios**
   - Rate limiting por endpoint
   - IP whitelisting
   - Requests firmados (HMAC)

4. **Logs y Auditoría**
   - Logs inmutables
   - Almacenamiento separado
   - Retención 5+ años

5. **Infraestructura y Secretos**
   - Secrets en manager
   - VPN + MFA para producción
   - Escaneo de puertos

6. **Proveedores y Terceros**
   - Accesos temporales
   - Revocación automática
   - Trazabilidad completa

7. **Monitoreo y Respuesta**
   - Detección de anomalías
   - Alertas en tiempo real
   - Kill switches

8. **Pruebas de Seguridad**
   - Pentesting periódico
   - Simulaciones de fraude
   - Ambientes separados

### Sistema de Escaneo
- Escaneos automatizados configurables
- Integración con OWASP ZAP, SQLMap, Nuclei
- Checks personalizados para lógica de negocio SPEI
- Programación de escaneos recurrentes

### Reportes
- Reportes semanales automáticos
- Reportes mensuales y trimestrales
- Reportes de incidentes
- Exportación a PDF
- Tendencias y métricas

### Alertas
- Notificaciones de vulnerabilidades críticas
- Alertas de cambios en cumplimiento
- Integración con Slack/Email

## Instalación

### Requisitos
- Node.js >= 18
- PostgreSQL (Neon)

### Configuración Local

```bash
# Clonar repositorio
git clone <repo-url>
cd novacore-security

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con credenciales de Neon

# Generar cliente Prisma
npm run db:generate

# Aplicar migraciones
npm run db:push

# Iniciar desarrollo
npm run dev
```

### Variables de Entorno

```env
# Base de datos Neon
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/novacore-security?sslmode=require"
DIRECT_URL="postgresql://user:pass@ep-xxx.neon.tech/novacore-security?sslmode=require"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Target NOVACORE (staging)
NOVACORE_STAGING_URL="https://staging.novacore.mx"
```

## Despliegue

### Vercel (Frontend + API)
1. Conectar repositorio en Vercel
2. Configurar variables de entorno
3. Deploy automático

### Neon (Base de datos)
1. Crear proyecto en [neon.tech](https://neon.tech)
2. Copiar connection string a `DATABASE_URL`
3. Ejecutar `npm run db:push`

### Railway (Scanners - opcional)
1. Crear proyecto en Railway
2. Desplegar servicio con Dockerfile de scanners
3. Configurar `RAILWAY_SCANNER_URL`

## API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/vulnerabilities` | Lista vulnerabilidades |
| POST | `/api/vulnerabilities` | Crear vulnerabilidad |
| GET | `/api/scans` | Lista escaneos |
| POST | `/api/scans` | Iniciar escaneo |
| GET | `/api/scans/:id` | Detalle de escaneo |
| GET | `/api/reports` | Lista reportes |
| POST | `/api/reports` | Generar reporte |
| GET | `/api/checklist` | Estado del checklist |
| PUT | `/api/checklist` | Actualizar control |
| GET | `/api/health` | Health check |

## Estructura del Proyecto

```
src/
├── app/
│   ├── api/           # API Routes
│   ├── alerts/        # Página de alertas
│   ├── checklist/     # Checklist de seguridad
│   ├── reports/       # Reportes
│   ├── scans/         # Escaneos
│   ├── vulnerabilities/ # Vulnerabilidades
│   ├── layout.tsx     # Layout principal
│   └── page.tsx       # Dashboard
├── components/
│   ├── dashboard/     # Componentes del dashboard
│   └── ui/           # Componentes UI base
├── lib/
│   ├── scanners/     # Motor de escaneo
│   ├── db.ts         # Cliente Prisma
│   └── utils.ts      # Utilidades
├── types/            # Tipos TypeScript
└── prisma/
    └── schema.prisma # Schema de BD
```

## Controles de Seguridad Críticos a Evaluar

Basado en el análisis del checklist, los controles que representan mayor riesgo si NO existen:

### CRÍTICO (Requiere acción inmediata)
1. **AUTH-003**: JWT sin expiración corta (actualmente 24h, debe ser 15 min)
2. **AUTH-007**: Sin detección de IPs no autorizadas
3. **RBAC-001**: RBAC no validado en backend
4. **API-002**: Sin rate limiting en APIs financieras
5. **VEN-002**: Revocación manual de ex-empleados
6. **TST-002**: Sin simulaciones de fraude interno

### ALTO (Requiere plan de remediación)
1. **AUTH-002**: MFA faltante en algunas acciones críticas
2. **AUTH-005**: Revocación de tokens tarda 5 min
3. **RBAC-004**: Bypass en maker/checker para dispersiones programadas
4. **INF-001**: 30% de secrets aún en .env
5. **TST-001**: Pentesting no es trimestral

## Stack Tecnológico

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de datos**: PostgreSQL (Neon)
- **ORM**: Prisma
- **UI Components**: Radix UI, Lucide Icons
- **Charts**: Recharts
- **Despliegue**: Vercel, Railway

## Licencia

Propietario - NOVACORE
