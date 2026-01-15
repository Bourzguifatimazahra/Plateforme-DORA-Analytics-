# DORA KPI Dashboard

A comprehensive, AI-powered dashboard for tracking and analyzing DORA (DevOps Research and Assessment) metrics across multiple Git platforms. This application helps development teams understand their software delivery performance through visual analytics and intelligent insights.

![DORA Metrics Dashboard](https://img.shields.io/badge/DORA-Metrics-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Framer Motion](https://img.shields.io/badge/Framer-Motion-purple)

## 🚀 Features

### Core Capabilities

- **Multi-Platform Support**: Analyze repositories from GitHub, GitLab, and Azure DevOps
- **DORA Metrics Tracking**: Comprehensive tracking of the four key DORA metrics:
  - **Deployment Frequency**: How often code is deployed to production
  - **Lead Time for Changes**: Time from commit to production
  - **Change Failure Rate**: Percentage of deployments causing failures
  - **Mean Time to Restore (MTTR)**: Average time to recover from failures

### Developer Performance Analytics

- **Individual Developer Metrics**:
  - Commit frequency and contribution percentage
  - Pull request velocity and merge rate
  - Average review time
  - Code quality scores
  - Active days tracking
  - PR velocity per developer

- **Team Performance Insights**:
  - Average merge rate across team
  - PR velocity trends
  - Top contributors identification
  - Active developer count

### AI-Powered DevOps Assistant (Dora)

An integrated AI chat assistant that helps users:

- Ask questions about DevOps performance
- Receive explanations of DORA metrics
- Understand why metrics improved or degraded
- Get suggestions to optimize pipelines

**Example Questions Dora Can Answer**:
- "Why did deployment frequency decrease last week?"
- "Which repository has the highest failure rate?"
- "How can we reduce lead time for changes?"
- "What's causing our change failure rate to be high?"
- "How can we improve our MTTR?"

### Time Period Filtering

Filter your analysis by different time periods:
- **Last Day**: Quick snapshot of recent activity
- **Last Week**: Short-term performance trends
- **Last Month**: Monthly performance overview (default)
- **Last Year**: Long-term trend analysis

### Visualizations & Reports

- **Animated Charts**: Interactive deployment frequency trends
- **Performance Ratings**: Visual indicators (Elite, High, Medium, Low) based on DORA benchmarks
- **PDF Export**: Generate comprehensive reports for stakeholders
- **Real-time Updates**: Refresh data on demand

### Design Features

- **Modern UI**: Beautiful, responsive design with smooth animations
- **Dark Mode Support**: Automatic theme switching
- **Accessibility**: WCAG-compliant interface
- **Mobile Responsive**: Works seamlessly on all devices

## 🛠️ Technologies Used

### Frontend

- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **TypeScript 5**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **Framer Motion**: Advanced animations and transitions
- **Radix UI**: Accessible component primitives
- **Recharts**: Data visualization library
- **Lucide React**: Icon library

### Backend & APIs

- **Next.js API Routes**: Serverless API endpoints
- **GitHub API**: Repository data fetching
- **GitLab API**: GitLab repository integration
- **Azure DevOps API**: Azure repository integration
- **OpenAI API**: AI-powered chat assistant

### Development Tools

- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

### Data Processing

- **date-fns**: Date manipulation and formatting
- **jsPDF**: PDF report generation

## 📦 Installation

### Prerequisites

- Node.js 18+ or higher
- pnpm (recommended) or npm/yarn
- Git

### Setup Steps

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd dora-kpi-dashboard
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Configure environment variables**:
   
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

   For private repositories, you may also need:
   ```env
   GITLAB_TOKEN=your_gitlab_token_here
   AZURE_DEVOPS_TOKEN=your_azure_token_here
   ```

4. **Run the development server**:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Analyzing a Repository

1. **Navigate to Analyze Page**: Click "Start Analysis" on the home page
2. **Select Platform**: Choose GitHub, GitLab, or Azure DevOps
3. **Enter Repository Details**:
   - **GitHub**: `owner/repo` or `https://github.com/owner/repo`
   - **GitLab**: `owner/repo` or `https://gitlab.com/owner/repo`
   - **Azure DevOps**: `org/project/repo` or full Azure DevOps URL
4. **Add Access Token** (optional): Required for private repositories
5. **Click "Start Analysis"**: Wait for the analysis to complete

### Using the Dashboard

1. **Overview Tab**: View DORA metrics and team performance KPIs
2. **Team Performance Tab**: Detailed developer statistics and contributions
3. **AI Assistant Tab**: Chat with Dora about your DevOps metrics

### Time Period Filtering

- Use the dropdown in the dashboard header to select:
  - Last Day
  - Last Week
  - Last Month
  - Last Year

### Exporting Reports

- Click the "Export PDF" button to generate a comprehensive report
- Reports include all metrics, charts, and developer statistics

## 📊 DORA Metrics Explained

### Deployment Frequency

**What it measures**: How often code is successfully deployed to production.

**Benchmarks**:
- **Elite**: Multiple deployments per day
- **High**: Daily to weekly deployments
- **Medium**: Weekly to monthly deployments
- **Low**: Less than monthly deployments

### Lead Time for Changes

**What it measures**: The time from when code is committed until it's running in production.

**Benchmarks**:
- **Elite**: Less than 1 hour
- **High**: Less than 1 day
- **Medium**: Less than 1 week
- **Low**: More than 1 week

### Change Failure Rate

**What it measures**: The percentage of deployments that result in a failure in production.

**Benchmarks**:
- **Elite**: 0-15%
- **High**: 16-30%
- **Medium**: 31-45%
- **Low**: More than 45%

### Mean Time to Restore (MTTR)

**What it measures**: How long it takes to restore service when a failure occurs.

**Benchmarks**:
- **Elite**: Less than 1 hour
- **High**: Less than 1 day
- **Medium**: Less than 1 week
- **Low**: More than 1 week

## 🔧 Configuration

### API Rate Limits

The application respects API rate limits for all platforms:
- **GitHub**: 5,000 requests/hour (unauthenticated), 15,000/hour (authenticated)
- **GitLab**: 2,000 requests/hour
- **Azure DevOps**: Varies by organization

### Caching

Data is cached for 5 minutes to reduce API calls and improve performance.

### Analysis Limits

- Maximum 500 commits per repository
- Maximum 500 pull requests/merge requests per repository
- Supports multiple repositories in a single analysis

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- DORA (DevOps Research and Assessment) for the metrics framework
- All the open-source libraries that made this project possible
- The development teams using this tool to improve their DevOps practices

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check the documentation
- Contact the maintainers

## 🔮 Future Enhancements

- [ ] Real-time webhook integration for live updates
- [ ] Custom metric definitions
- [ ] Team comparison views
- [ ] Integration with CI/CD tools
- [ ] Advanced filtering and search
- [ ] Export to multiple formats (CSV, JSON)
- [ ] Custom dashboard layouts
- [ ] Alert system for metric thresholds

---

**Built with ❤️ for DevOps teams everywhere**
