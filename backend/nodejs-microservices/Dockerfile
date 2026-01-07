FROM node:20-alpine
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# If your entry is src/index.js
EXPOSE 3000
CMD ["node", "src/index.js"]
