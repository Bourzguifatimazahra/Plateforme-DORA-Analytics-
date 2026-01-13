 # 📊 Multi-Repo Analytics Platform

## 🎯 Overview

A unified DevOps intelligence platform that analyzes GitHub, GitLab, and Azure DevOps repositories to provide DORA metrics, performance insights, and automated reporting for engineering leadership.
# Dashboard

Here's a screenshot of my dashboard:

![Dashboard Screenshot]( Gemini_Generated_Image_b96h3rb96h3rb96h.png)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/multi-repo-analytics
cd multi-repo-analytics

# Backend setup
cd backend
npm install
cp .env.example .env
npm run dev

# Frontend setup
cd ../frontend
npm install
npm run dev

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph "Data Sources"
        GH[GitHub Repo]
        GL[GitLab Repo]
        AD[Azure DevOps Repo]
    end

    subgraph "Platform"
        API[API Gateway]
        DC[Data Collector]
        KE[KPI Engine]
        DB[(PostgreSQL)]
        PDF[PDF Generator]
        RE[Recommendation Engine]
        FE[Frontend Dashboard]
    end

    GH --> API
    GL --> API
    AD --> API
    
    API --> DC
    DC --> KE
    KE --> DB
    KE --> PDF
    KE --> RE
    
    DB --> FE
    PDF --> FE
    RE --> FE
    
    FE --> User[End User]
```

## 🛠️ Technology Stack

### Frontend
<p align="left">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white" alt="Chart.js" />
  <img src="https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux" />
</p>

### Backend
<p align="left">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest" />
</p>

### DevOps & Tools
<p align="left">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions" />
  <img src="https://img.shields.io/badge/Puppeteer-40B5A4?style=for-the-badge&logo=puppeteer&logoColor=white" alt="Puppeteer" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" />
</p>

## 📁 Project Structure

```
multi-repo-analytics/
├── 📁 backend
│   ├── 📁 src
│   │   ├── 📁 api
│   │   │   ├── auth
│   │   │   ├── repos
│   │   │   ├── metrics
│   │   │   └── reports
│   │   ├── 📁 connectors
│   │   │   ├── github
│   │   │   ├── gitlab
│   │   │   └── azure-devops
│   │   ├── 📁 services
│   │   │   ├── data-collector
│   │   │   ├── kpi-calculator
│   │   │   ├── recommendation-engine
│   │   │   └── pdf-generator
│   │   └── 📁 database
│   │       └── models
├── 📁 frontend
│   ├── 📁 src
│   │   ├── 📁 components
│   │   │   ├── Dashboard
│   │   │   ├── Charts
│   │   │   ├── Reports
│   │   │   └── Settings
│   │   ├── 📁 pages
│   │   │   ├── Home
│   │   │   ├── Repositories
│   │   │   ├── Metrics
│   │   │   └── Recommendations
│   │   └── 📁 services
│   │       ├── api
│   │       └── auth
├── 📁 infra
│   ├── docker-compose.yml
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── nginx.conf
├── 📁 docs
│   ├── API.md
│   └── DEPLOYMENT.md
└── docker-compose.yml
```

## 🔧 Key Features

### 📊 DORA Metrics Calculation
- **Deployment Frequency**: Number of deployments per day/week
- **Lead Time for Changes**: Time from commit to production
- **Change Failure Rate**: Percentage of deployments causing incidents
- **Mean Time To Recovery**: Average time to restore service

### 🔗 Multi-Platform Support
- **GitHub**: Full PR, commit, and workflow analysis
- **GitLab**: Merge request and pipeline metrics
- **Azure DevOps**: Repo and pipeline integration

### 📈 Dashboard & Visualization
- Real-time metrics display
- Comparative analysis across platforms
- Historical trend tracking
- Customizable views

### 📄 Automated Reporting
- Professional PDF generation
- Executive summaries
- Actionable recommendations
- Scheduled report delivery

## 📋 API Endpoints

### Authentication
```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/refresh
```

### Repository Management
```
GET    /api/repos
POST   /api/repos/connect
GET    /api/repos/:id/metrics
DELETE /api/repos/:id
```

### Metrics & Analysis
```
GET    /api/metrics/dora
GET    /api/metrics/trends
GET    /api/metrics/comparison
POST   /api/metrics/calculate
```

### Reports
```
GET    /api/reports
POST   /api/reports/generate
GET    /api/reports/:id/download
```

## 🐳 Docker Deployment

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: analytics
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://admin:secure_password@postgres:5432/analytics
      NODE_ENV: production
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    environment:
      VITE_API_URL: http://backend:5000
    depends_on:
      - backend

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./infra/nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - frontend
      - backend

volumes:
  postgres_data:
```

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test

# Run e2e tests
npm run test:e2e
```

## 📊 Data Collection Schema

```mermaid
graph LR
    subgraph "GitHub"
        GH_API[GitHub API]
        GH_Webhooks[GitHub Webhooks]
    end
    
    subgraph "GitLab"
        GL_API[GitLab API]
        GL_Webhooks[GitLab Webhooks]
    end
    
    subgraph "Azure DevOps"
        ADO_API[Azure DevOps API]
        ADO_Webhooks[Azure Webhooks]
    end
    
    subgraph "Data Processing"
        DC[Data Collector]
        NM[Normalization Module]
        QC[Quality Check]
    end
    
    subgraph "Storage"
        RM[Raw Metrics]
        AM[Aggregated Metrics]
        CM[Calculated Metrics]
    end
    
    GH_API --> DC
    GL_API --> DC
    ADO_API --> DC
    
    DC --> RM
    RM --> NM
    NM --> QC
    QC --> AM
    AM --> CM
```

## 🚀 Development Workflow

### Day 1: Core Infrastructure
- [x] Project setup and scaffolding
- [x] Database schema design
- [x] GitHub connector implementation
- [x] Basic API endpoints
- [x] Authentication system

### Day 2: MVP Features
- [x] GitLab and Azure DevOps connectors
- [x] DORA metrics calculation
- [x] Dashboard UI
- [x] PDF report generation
- [x] Recommendation engine

## 👥 Team Structure

| Role | Members | Responsibilities |
|------|---------|------------------|
| **Tech Lead** | 1 | Architecture, Code Review, Technical Decisions, Validation, Documentation  |
| **Backend Dev** | 2 | API Development, Data Connectors, KPI Engine |
| **Frontend Dev** | 2 | UI/UX, Dashboard, Visualization |
| **DevOps** | 1 | Infrastructure, CI/CD, Deployment |
| **Ai** | 2 |Powered DevOps Assistant |

## 📈 Success Metrics

### Technical Metrics
- ✅ API response time < 200ms
- ✅ Data collection accuracy > 99%
- ✅ PDF generation < 10 seconds
- ✅ System uptime > 99.5%

### Business Metrics
- ✅ DORA metrics calculated accurately
- ✅ Cross-platform comparison enabled
- ✅ Actionable recommendations provided
- ✅ Executive reports generated automatically

## 🔒 Security

- Token-based authentication
- Environment variable management
- API rate limiting
- SQL injection prevention
- XSS protection
- CORS configuration
- Audit logging

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [User Manual](./docs/USER_GUIDE.md)
- [Development Guide](./docs/DEVELOPMENT.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@multirepo-analytics.com or open an issue in the repository.

---

**Built with ❤️ for engineering teams who value data-driven decisions.**

<p align="center">
  <img src="https://img.shields.io/badge/MVP-Ready-green" alt="MVP Ready" />
  <img src="https://img.shields.io/badge/Production-Ready-blue" alt="Production Ready" />
  <img src="https://img.shields.io/badge/Open%20Source-MIT-orange" alt="Open Source" />
</p>
