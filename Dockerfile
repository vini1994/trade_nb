# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript and Frontend
RUN npm run build
RUN npm run frontend:build

# Create necessary directories
RUN mkdir -p db logs data

# Expose port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

# Start the API server
CMD ["node", "dist/api/index.js"] 