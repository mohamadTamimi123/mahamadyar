# 🚀 CI/CD Pipeline Documentation

## Overview
This project uses GitHub Actions for Continuous Integration (CI) and Continuous Deployment (CD) with Docker containerization.

## Workflows

### 1. CI (Continuous Integration) - `.github/workflows/ci.yml`

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs:**
- **build-and-test-api**: Builds and tests the NestJS API
- **build-and-test-ui**: Builds and tests the Next.js UI
- **docker-build-test**: Tests Docker image builds

**Features:**
- ✅ Node.js 20 setup with npm caching
- ✅ Dependency installation
- ✅ Linting and type checking
- ✅ Build verification
- ✅ Docker image testing
- ✅ Build artifact validation

### 2. CD (Continuous Deployment) - `.github/workflows/cd.yml`

**Triggers:**
- Push to `main` branch
- Git tags starting with `v*`

**Jobs:**
- **build-and-push-images**: Builds and pushes Docker images to GHCR
- **security-scan**: Scans images for vulnerabilities

**Features:**
- ✅ Multi-platform builds (linux/amd64, linux/arm64)
- ✅ GitHub Container Registry (GHCR) integration
- ✅ Semantic versioning support
- ✅ Build caching for faster builds
- ✅ Security scanning with Trivy
- ✅ Deployment summary generation

### 3. Deploy to Production - `.github/workflows/deploy.yml`

**Triggers:**
- After successful CD workflow completion on `main` branch

**Features:**
- ✅ SSH deployment to production server
- ✅ Health checks after deployment
- ✅ Rollback capability
- ✅ Deployment status notifications

## Docker Images

### API Image
- **Registry**: `ghcr.io/{repository}-api`
- **Tags**: `latest`, `main`, semantic versions
- **Base**: Node.js 20 Alpine
- **Port**: 5000

### UI Image
- **Registry**: `ghcr.io/{repository}-ui`
- **Tags**: `latest`, `main`, semantic versions
- **Base**: Node.js 20 Alpine
- **Port**: 3001

## Environment Variables

### Required Secrets
```bash
# Server deployment
SERVER_HOST=your-server-ip
SERVER_USER=root
SERVER_SSH_KEY=your-private-ssh-key

# Production environment
POSTGRES_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret
EMAIL_FROM=noreply@yourdomain.com
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
```

## Deployment Process

### 1. Development
```bash
# Local development
docker-compose up -d
```

### 2. CI/CD Pipeline
1. **Push to main** → Triggers CI
2. **CI passes** → Triggers CD
3. **CD builds images** → Pushes to GHCR
4. **Security scan** → Validates images
5. **Deploy workflow** → Deploys to production

### 3. Production Deployment
```bash
# Manual deployment (if needed)
cd /root/peligent
git pull origin main
docker-compose -f deploy/docker-compose.prod.yml down
docker-compose -f deploy/docker-compose.prod.yml pull
docker-compose -f deploy/docker-compose.prod.yml up -d
```

## Monitoring

### Health Checks
- **API**: `http://localhost:5001/family-members`
- **UI**: `http://localhost:3001`
- **Database**: PostgreSQL health check
- **MailHog**: `http://localhost:8025`

### Logs
```bash
# View logs
docker-compose -f deploy/docker-compose.prod.yml logs -f

# View specific service logs
docker-compose -f deploy/docker-compose.prod.yml logs -f api
docker-compose -f deploy/docker-compose.prod.yml logs -f ui
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Docker Build Issues**
   - Verify Dockerfile syntax
   - Check for missing files in build context
   - Ensure proper base image versions

3. **Deployment Failures**
   - Verify SSH key permissions
   - Check server disk space
   - Ensure ports are available

### Debug Commands
```bash
# Check container status
docker ps -a

# Check container logs
docker logs <container-name>

# Check resource usage
docker stats

# Restart services
docker-compose -f deploy/docker-compose.prod.yml restart
```

## Security

### Image Scanning
- Trivy vulnerability scanning
- SARIF report generation
- GitHub Security tab integration

### Best Practices
- ✅ Use specific image tags
- ✅ Regular security updates
- ✅ Minimal base images
- ✅ Non-root user execution
- ✅ Secrets management

## Performance

### Build Optimization
- ✅ Multi-stage Docker builds
- ✅ Build caching
- ✅ Parallel job execution
- ✅ Dependency caching

### Runtime Optimization
- ✅ Health checks
- ✅ Restart policies
- ✅ Resource limits
- ✅ Multi-platform support

---

## 🎯 Quick Start

1. **Setup Repository Secrets**
2. **Push to main branch**
3. **Monitor GitHub Actions**
4. **Verify deployment**

For more details, check the individual workflow files in `.github/workflows/`.
