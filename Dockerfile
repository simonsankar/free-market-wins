FROM node:22-alpine AS builder
RUN apk add --no-cache git

WORKDIR /app

# Install deps and plugins first (better layer caching)
COPY site/package.json site/package-lock.json* site/quartz.lock.json ./site/
COPY site/quartz/ ./site/quartz/
RUN cd site && npm ci && npx quartz plugin install

# Copy all vault content + site config
COPY . .

# Build static site — --directory ../ points Quartz at the vault root
RUN cd site && npx quartz build --directory ../

FROM nginx:alpine
COPY --from=builder /app/site/public /usr/share/nginx/html
COPY site/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
