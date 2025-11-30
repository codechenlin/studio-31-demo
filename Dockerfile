# =========================
# Stage 1: Build
# =========================
FROM node:20-alpine AS builder

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm ci

# Copiar todo el código fuente
COPY . .

# Compilar la aplicación Next.js en modo standalone
RUN npm run build

# =========================
# Stage 2: Production
# =========================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copiar archivos necesarios desde el builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json* ./
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Instalar solo dependencias de producción
RUN npm ci --omit=dev

# Exponer el puerto de producción de Next.js
EXPOSE 3000

# Variables de entorno (Coolify las inyectará en runtime)
ENV NEXT_PUBLIC_SUPABASE_URL=""
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=""

# Comando de inicio
CMD ["node", "server.js"]
