FROM node:22 AS builder
WORKDIR /app

# Install deps first (better layer caching)
COPY site/package.json site/package-lock.json* ./site/
RUN cd site && npm ci

# Copy all vault content + site source
COPY . .

# Build static site — copies vault images into public/, runs `astro build`
# (which reads the vault root as content via the glob loader in
# site/src/content/config.ts), then generates the Pagefind search index.
RUN cd site && npm run build

FROM nginx:alpine
COPY --from=builder /app/site/dist /usr/share/nginx/html
COPY site/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
