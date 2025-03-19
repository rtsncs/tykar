FROM docker.io/oven/bun:1-alpine as builder
WORKDIR /app

COPY package.json bun.lockb .
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM docker.io/nginx:1.27-alpine
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
