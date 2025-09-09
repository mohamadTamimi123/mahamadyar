# 🌳 Family Tree Management System

A comprehensive family tree management system built with modern web technologies, featuring user authentication, admin dashboard, and interactive family tree visualization.

## 🚀 Features

### Core Features
- **👥 Family Member Management**: Add, edit, and manage family members
- **🌳 Interactive Family Tree**: D3.js-powered tree visualization
- **🔐 User Authentication**: Email/password with OTP verification
- **📧 Email System**: Automated email notifications and OTP delivery
- **👨‍💼 Admin Dashboard**: Complete administrative control panel
- **📱 Responsive Design**: Modern, mobile-friendly interface

### Technical Features
- **🐳 Docker Containerization**: Full containerized deployment
- **🔄 CI/CD Pipeline**: Automated testing and deployment
- **🔒 Security Scanning**: Automated vulnerability detection
- **📊 Health Monitoring**: Comprehensive system monitoring
- **🔄 Rollback Support**: Easy rollback capabilities

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js UI    │    │   NestJS API    │    │   PostgreSQL    │
│   (Port 3001)   │◄──►│   (Port 5001)   │◄──►│   (Port 5025)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   MailHog       │    │   Docker        │    │   GitHub        │
│   (Port 8025)   │    │   Compose       │    │   Actions       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5.2** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **HeroUI/NextUI** - UI components
- **D3.js** - Data visualization
- **Axios** - HTTP client

### Backend
- **NestJS** - Node.js framework
- **TypeORM** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Nodemailer** - Email service
- **bcrypt** - Password hashing

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **GitHub Container Registry** - Image storage
- **Trivy** - Security scanning

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git
- Node.js 20+ (for local development)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/shajare-back.git
   cd shajare-back
   ```

2. **Setup environment**
   ```bash
   cp env.template .env
   # Edit .env with your configuration
   ```

3. **Start services**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - **UI**: http://localhost:3001
   - **API**: http://localhost:5001
   - **MailHog**: http://localhost:8025
   - **Database**: localhost:5025

### Production Deployment

1. **Setup server secrets** (GitHub repository settings)
   ```
   SERVER_HOST=your-server-ip
   SERVER_USER=root
   SERVER_SSH_KEY=your-private-ssh-key
   POSTGRES_PASSWORD=your-secure-password
   JWT_SECRET=your-jwt-secret
   ```

2. **Deploy automatically**
   ```bash
   git push origin main
   # GitHub Actions will handle the rest
   ```

3. **Manual deployment** (if needed)
   ```bash
   ./deploy/deploy.sh
   ```

## 📁 Project Structure

```
shajare-back/
├── family-tree-api/          # NestJS API
│   ├── src/
│   │   ├── entities/         # Database entities
│   │   ├── services/         # Business logic
│   │   ├── controllers/      # API endpoints
│   │   └── scripts/          # Database scripts
│   └── Dockerfile
├── family-tree-ui/           # Next.js UI
│   ├── src/
│   │   ├── app/              # Next.js app router
│   │   ├── components/       # React components
│   │   └── lib/              # Utilities
│   └── Dockerfile
├── deploy/                   # Deployment files
│   ├── docker-compose.prod.yml
│   ├── deploy.sh
│   ├── rollback.sh
│   └── monitor.sh
├── .github/workflows/        # CI/CD pipelines
│   ├── ci.yml
│   ├── cd.yml
│   └── deploy.yml
└── docs/                     # Documentation
    └── CI-CD.md
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_PASSWORD` | Database password | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `EMAIL_FROM` | Email sender address | `noreply@familytree.com` |
| `NEXT_PUBLIC_API_BASE_URL` | API base URL | `http://localhost:5001` |

### Database Schema

- **family_members**: Core family member data
- **users**: User authentication data
- **Relations**: Foreign key relationships between members

## 📊 Monitoring

### Health Checks
- **API**: `GET /family-members`
- **UI**: `GET /`
- **Database**: PostgreSQL health check
- **MailHog**: `GET /`

### Monitoring Script
```bash
./deploy/monitor.sh [interval-seconds]
```

### Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f ui
```

## 🔒 Security

### Implemented Security Measures
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ OTP email verification
- ✅ Input validation and sanitization
- ✅ SQL injection prevention (TypeORM)
- ✅ CORS configuration
- ✅ Docker security scanning

### Security Scanning
- Automated Trivy vulnerability scanning
- SARIF report generation
- GitHub Security tab integration

## 🚀 CI/CD Pipeline

### Continuous Integration (CI)
- **Triggers**: Push to `main`/`develop`, Pull requests
- **Jobs**: API build/test, UI build/test, Docker build test
- **Features**: Linting, type checking, build verification

### Continuous Deployment (CD)
- **Triggers**: Push to `main`, Git tags
- **Jobs**: Build/push images, security scanning
- **Features**: Multi-platform builds, semantic versioning

### Production Deployment
- **Triggers**: After successful CD
- **Features**: SSH deployment, health checks, rollback support

## 📚 API Documentation

### Authentication Endpoints
- `POST /family-members/login` - User login
- `POST /family-members/register-with-credentials` - User registration
- `POST /family-members/verify-otp` - OTP verification
- `POST /family-members/resend-otp` - Resend OTP

### Family Member Endpoints
- `GET /family-members` - List all members
- `POST /family-members` - Create member
- `PUT /family-members/:id` - Update member
- `DELETE /family-members/:id` - Delete member
- `GET /family-members/tree/all` - Get tree data

### Admin Endpoints
- `GET /family-members/users` - List users
- `PATCH /family-members/users/:id/verify` - Verify user
- `DELETE /family-members/users/:id` - Delete user

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Troubleshooting

**Common Issues:**
- **Build failures**: Check Node.js version and dependencies
- **Docker issues**: Verify Dockerfile syntax and build context
- **Deployment failures**: Check SSH keys and server permissions

**Debug Commands:**
```bash
# Check container status
docker ps -a

# Check logs
docker-compose logs -f

# Restart services
docker-compose restart

# Check resource usage
docker stats
```

### Getting Help
- 📖 Check the [CI/CD Documentation](docs/CI-CD.md)
- 🐛 Report issues on GitHub
- 💬 Join our community discussions

---

**Made with ❤️ for family tree management**
