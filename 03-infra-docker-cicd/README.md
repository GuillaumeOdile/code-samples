# Infrastructure - Docker & CI/CD

> Demonstrates production-ready containerization and continuous integration/deployment practices.

## Purpose

This project showcases modern DevOps practices including:

- **Containerization**: Multi-stage Docker builds with security best practices
- **Orchestration**: Docker Compose for local development and testing
- **CI/CD**: GitHub Actions with comprehensive testing and security scanning
- **Infrastructure as Code**: Declarative configuration for reproducible environments
- **Security**: Non-root containers, vulnerability scanning, and security headers

## Architecture

### Container Strategy

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │     Nginx       │
│   (React)       │    │   (NestJS)      │    │  (Reverse       │
│   Port: 5173    │    │   Port: 3000    │    │   Proxy)        │
│                 │    │                 │    │   Port: 80/443  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   App Network   │
                    │   (Bridge)      │
                    └─────────────────┘
```

### Multi-Stage Builds

Both frontend and backend use multi-stage Docker builds:

1. **Build Stage**: Install dependencies and build the application
2. **Production Stage**: Copy built artifacts to minimal runtime image

This approach results in:
- Smaller final images (reduced attack surface)
- Faster deployments (fewer layers to transfer)
- Better security (minimal runtime dependencies)

## Features

### Docker Compose Services

- **Backend**: NestJS API with health checks and graceful shutdown
- **Frontend**: React app served by Nginx with optimized configuration
- **Nginx**: Reverse proxy with load balancing and SSL termination
- **PostgreSQL**: Database with initialization scripts (optional)
- **Redis**: Caching layer (optional)

### Security Features

- **Non-root Users**: All containers run as non-privileged users
- **Security Headers**: Comprehensive security headers in Nginx
- **Vulnerability Scanning**: Trivy integration in CI pipeline
- **Secrets Management**: Environment variables for sensitive data
- **Network Isolation**: Custom bridge network for service communication

### CI/CD Pipeline

- **Matrix Testing**: Multiple Node.js and compiler versions
- **Code Quality**: Linting, type checking, and security audits
- **Docker Builds**: Multi-platform builds with caching
- **Integration Tests**: Full stack testing with Docker Compose
- **Security Scanning**: Vulnerability and secret detection
- **Performance Testing**: Basic load testing and health checks

## How to Run

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- Make (optional, for convenience commands)

### Quick Start

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Development Mode

```bash
# Start with development configuration
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Rebuild and restart services
docker-compose up -d --build

# View service status
docker-compose ps
```

### Production Mode

```bash
# Start with production configuration
docker-compose --profile production up -d

# With database and cache
docker-compose --profile production --profile database --profile cache up -d
```

### Individual Services

```bash
# Start only backend and frontend
docker-compose up -d backend frontend

# Start with database
docker-compose --profile database up -d

# Start with cache
docker-compose --profile cache up -d
```

## Service Configuration

### Backend Service

```yaml
backend:
  build:
    context: ../01-backend-nestjs-clean-arch
    dockerfile: Dockerfile
  ports:
    - "3000:3000"
  environment:
    - NODE_ENV=production
    - PORT=3000
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
    interval: 30s
    timeout: 10s
    retries: 3
```

**Features:**
- Health checks for reliability
- Non-root user for security
- Graceful shutdown handling
- Optimized for production

### Frontend Service

```yaml
frontend:
  build:
    context: ../02-frontend-react-component
    dockerfile: Dockerfile
  ports:
    - "5173:80"
  environment:
    - VITE_API_URL=http://localhost:3000
  depends_on:
    backend:
      condition: service_healthy
```

**Features:**
- Nginx for serving static files
- Security headers and optimizations
- Gzip compression
- SPA routing support

### Nginx Reverse Proxy

```yaml
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
```

**Features:**
- Load balancing
- SSL termination
- Rate limiting
- Security headers
- Health checks

## Docker Images

### Backend Image

```dockerfile
# Multi-stage build for NestJS
FROM node:18-alpine AS builder
# ... build stage

FROM node:18-alpine AS production
# ... production stage with non-root user
```

**Optimizations:**
- Alpine Linux base (smaller image)
- Multi-stage build (reduced size)
- Non-root user (security)
- Health checks (reliability)

### Frontend Image

```dockerfile
# Multi-stage build for React
FROM node:18-alpine AS builder
# ... build stage

FROM nginx:alpine AS production
# ... production stage with Nginx
```

**Optimizations:**
- Nginx for serving (performance)
- Security headers (security)
- Gzip compression (bandwidth)
- Static file caching (performance)

## CI/CD Pipeline

### Workflow Stages

1. **Code Quality**
   - Linting and formatting
   - Type checking
   - Security audits

2. **Testing**
   - Unit tests with coverage
   - Integration tests
   - E2E tests

3. **Building**
   - Docker image builds
   - Multi-platform support
   - Layer caching

4. **Security**
   - Vulnerability scanning
   - Secret detection
   - Dependency audits

5. **Deployment**
   - Container registry push
   - Environment-specific configs
   - Health checks

### Matrix Strategy

```yaml
strategy:
  matrix:
    node-version: [18, 20]
    compiler: [gcc, clang]
    build-type: [Debug, Release]
```

**Benefits:**
- Test multiple versions
- Catch compatibility issues
- Ensure cross-platform support

### Security Scanning

```yaml
- name: Run Trivy vulnerability scanner
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
    format: 'sarif'
    output: 'trivy-results.sarif'
```

**Features:**
- Container vulnerability scanning
- Dependency security audits
- Secret detection
- Compliance checking

## Environment Configuration

### Development

```bash
# .env.development
NODE_ENV=development
API_URL=http://localhost:3000
DATABASE_URL=postgresql://user:pass@localhost:5432/users_dev
```

### Production

```bash
# .env.production
NODE_ENV=production
API_URL=https://api.example.com
DATABASE_URL=postgresql://user:pass@db:5432/users_prod
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Backend port | `3000` |
| `VITE_API_URL` | Frontend API URL | `http://localhost:3000` |
| `POSTGRES_DB` | Database name | `users_db` |
| `POSTGRES_USER` | Database user | `users_user` |
| `POSTGRES_PASSWORD` | Database password | `users_password` |

## Monitoring and Logging

### Health Checks

All services include health check endpoints:

```bash
# Backend health
curl http://localhost:3000/health

# Frontend health
curl http://localhost:5173/health

# Nginx health
curl http://localhost/health
```

### Logging

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# View logs with timestamps
docker-compose logs -f -t
```

### Monitoring

```bash
# Check service status
docker-compose ps

# View resource usage
docker stats

# Check container health
docker inspect --format='{{.State.Health.Status}}' users-api
```

## Security Best Practices

### Container Security

- **Non-root Users**: All containers run as non-privileged users
- **Minimal Base Images**: Alpine Linux for smaller attack surface
- **Regular Updates**: Automated dependency updates in CI
- **Vulnerability Scanning**: Trivy integration for security checks

### Network Security

- **Network Isolation**: Custom bridge network for services
- **No Exposed Ports**: Only necessary ports exposed
- **Internal Communication**: Services communicate via internal network

### Application Security

- **Security Headers**: Comprehensive security headers in Nginx
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: All inputs validated at API boundaries
- **Error Handling**: Secure error messages without information leakage

## Performance Optimization

### Docker Optimizations

- **Multi-stage Builds**: Reduced final image size
- **Layer Caching**: Optimized layer ordering for cache hits
- **Build Cache**: GitHub Actions cache for faster builds
- **Multi-platform**: Support for AMD64 and ARM64

### Application Optimizations

- **Nginx Caching**: Static file caching and compression
- **Health Checks**: Fast health check endpoints
- **Graceful Shutdown**: Proper signal handling
- **Resource Limits**: Memory and CPU limits for containers

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check port usage
   netstat -tulpn | grep :3000
   
   # Use different ports
   docker-compose up -d -p 3001:3000
   ```

2. **Service Dependencies**
   ```bash
   # Check service health
   docker-compose ps
   
   # View service logs
   docker-compose logs backend
   ```

3. **Build Failures**
   ```bash
   # Clean build
   docker-compose build --no-cache
   
   # Remove unused images
   docker system prune -a
   ```

### Debug Commands

```bash
# Enter running container
docker-compose exec backend sh

# View container logs
docker logs users-api

# Check container health
docker inspect users-api

# View network configuration
docker network ls
docker network inspect infra-docker-cicd_app-network
```

## Next Steps

1. **Kubernetes**: Deploy to Kubernetes cluster
2. **Monitoring**: Add Prometheus and Grafana
3. **Logging**: Centralized logging with ELK stack
4. **Secrets**: External secrets management
5. **Backup**: Database backup and recovery procedures
6. **Scaling**: Horizontal pod autoscaling
7. **SSL**: Automated SSL certificate management
8. **CDN**: Content delivery network integration


