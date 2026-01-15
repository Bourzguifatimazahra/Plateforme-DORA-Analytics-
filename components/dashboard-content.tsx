"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AnimatedKPICard } from "@/components/animated-kpi-card"
import { AnimatedChart } from "@/components/animated-chart"
import { DeveloperStatsTable } from "@/components/developer-stats-table"
import AIAssistant from "@/components/ai-assistant"
import { Header } from "@/components/header"
import { generatePDFReport } from "@/lib/pdf-export"
import type { RepoAnalysis, DORAMetrics, DeveloperStats } from "@/lib/github"
import {
  Zap,
  Clock,
  AlertTriangle,
  RotateCcw,
  Loader2,
  RefreshCw,
  FileDown,
  ArrowUpRight,
  ArrowDownRight,
  GitCommit,
  GitPullRequest,
  GitMerge,
  Calendar,
  LayoutDashboard,
  Users,
  MessageSquare,
  TrendingUp,
  Target,
  Activity,
  Award,
  Crown,
  Shield,
  Rocket,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useI18n } from "@/lib/i18n"
import { Skeleton } from "@/components/ui/skeleton"
import { LoadingOverlay } from "@/components/loading-overlay"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend as RechartsLegend,
  BarChart,
  Bar,
  LabelList,
} from "recharts"

interface AnalysisResponse {
  aggregated: RepoAnalysis
  individual: RepoAnalysis[]
}

const defaultMetrics: DORAMetrics = {
  deploymentFrequency: { value: 0, unit: "per week", rating: "low", trend: Array(12).fill(0) },
  leadTime: { value: 0, unit: "hours", rating: "low" },
  changeFailureRate: { value: 0, rating: "low" },
  mttr: { value: 0, unit: "hours", rating: "low" },
}

export function DashboardContent() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const router = useRouter()
  const repos = searchParams.get("repos")
  const isDemo = searchParams.get("demo") === "1"
  const projectName = searchParams.get("project") || "My Project"
  const platform = searchParams.get("platform") || "github"
  const token = searchParams.get("token") || undefined
  const [data, setData] = useState<AnalysisResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isExporting, setIsExporting] = useState(false)
  const [timePeriod, setTimePeriod] = useState<"day" | "week" | "month" | "year">("month")

  const getDaysForPeriod = (period: "day" | "week" | "month" | "year"): number => {
    switch (period) {
      case "day":
        return 1
      case "week":
        return 7
      case "month":
        return 30
      case "year":
        return 365
      default:
        return 30
    }
  }

  const fetchData = async () => {
    if (isDemo) {
      // Static demo data for the dashboard preview - matching the visual references
      const demoAnalysis: RepoAnalysis = {
        repo: "vercel/next.js",
        totalCommits: 12847,
        totalPRs: 2156,
        mergedPRs: 1893,
        analyzedPeriod: {
          start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date().toISOString(),
        },
        metrics: {
          deploymentFrequency: {
            value: 4.2,
            unit: "per day",
            rating: "elite",
            trend: [35, 38, 42, 40, 45, 43, 48, 46, 44, 42, 47, 49],
          },
          leadTime: {
            value: 2.3,
            unit: "hours",
            rating: "elite",
          },
          changeFailureRate: {
            value: 3.2,
            rating: "elite",
          },
          mttr: {
            value: 0.75,
            unit: "hours",
            rating: "high",
          },
        },
        developers: [
          {
            login: "Marcus Johnson",
            avatar_url: "/placeholder-user.jpg",
            commits: 312,
            pullRequests: 67,
            mergedPRs: 89,
            avgReviewTime: 2.1,
            commitTitles: ["Refactor deployment pipeline", "Improve error handling"],
          },
          {
            login: "David Kim",
            avatar_url: "/placeholder-user.jpg",
            commits: 267,
            pullRequests: 52,
            mergedPRs: 78,
            avgReviewTime: 2.4,
            commitTitles: ["Add canary rollout strategy", "Optimize database migrations"],
          },
          {
            login: "Emily Rodriguez",
            avatar_url: "/placeholder-user.jpg",
            commits: 245,
            pullRequests: 48,
            mergedPRs: 72,
            avgReviewTime: 1.5,
            commitTitles: ["Improve observability dashboards", "Add tracing"],
          },
          {
            login: "Sarah Chen",
            avatar_url: "/placeholder-user.jpg",
            commits: 198,
            pullRequests: 42,
            mergedPRs: 65,
            avgReviewTime: 1.8,
            commitTitles: ["Fix authentication bugs", "Update dependencies"],
          },
          {
            login: "Lisa Wang",
            avatar_url: "/placeholder-user.jpg",
            commits: 185,
            pullRequests: 38,
            mergedPRs: 58,
            avgReviewTime: 1.9,
            commitTitles: ["Improve test coverage", "Refactor API endpoints"],
          },
        ],
      }

      setData({
        aggregated: demoAnalysis,
        individual: [demoAnalysis],
      })
      setLoading(false)
      return
    }

    if (!repos) {
      router.push("/analyze")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const days = getDaysForPeriod(timePeriod)
      const params = new URLSearchParams({
        repos: repos,
        platform: platform,
        days: days.toString(),
      })
      if (token) {
        params.set("token", token)
      }

      const response = await fetch(`/api/analyze?${params.toString()}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to analyze repositories")
      }

      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repos, timePeriod, platform, token, isDemo])

  const handleExportPDF = async () => {
    if (!data) return
    setIsExporting(true)
    try {
      await generatePDFReport(data.aggregated, projectName)
    } catch (err) {
      console.error("PDF export failed:", err)
    } finally {
      setIsExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <LoadingOverlay message="Analyzing repository and generating insights..." />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] pt-16">
          <div className="w-full max-w-5xl px-4 space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-64" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-32" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
            </div>
            <Skeleton className="h-80 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] pt-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="max-w-md border-destructive/50 bg-card">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  {t("common.error")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{error}</p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => router.push("/analyze")} className="border-border">
                    Back
                  </Button>
                  <Button onClick={fetchData} className="bg-gradient-to-r from-primary to-accent text-white">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { aggregated } = data

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Project Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{projectName}</h1>
              <p className="text-muted-foreground mt-1">{aggregated.repo}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Select value={timePeriod} onValueChange={(v) => setTimePeriod(v as typeof timePeriod)}>
                <SelectTrigger className="w-[140px] border-border bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Last Day</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={fetchData} className="border-border bg-transparent">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
                disabled={isExporting}
                className="border-border bg-transparent"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileDown className="h-4 w-4 mr-2" />
                )}
                {t("dashboard.exportPdf")}
              </Button>
              <Button asChild className="bg-gradient-to-r from-primary to-accent text-white">
                <Link href="/analyze">New Analysis</Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <TabsList className="bg-secondary/50 p-1">
              <TabsTrigger value="overview" className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                {t("dashboard.overview")}
              </TabsTrigger>
              <TabsTrigger value="team" className="gap-2">
                <Users className="h-4 w-4" />
                {t("dashboard.team")}
              </TabsTrigger>
              <TabsTrigger value="assistant" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                {t("dashboard.aiAssistant")}
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <AnimatePresence mode="wait">
            <TabsContent key="overview" value="overview" className="space-y-6">
              <DashboardOverview analysis={aggregated} />
            </TabsContent>

            <TabsContent key="team" value="team" className="space-y-6">
              <TeamPerformance analysis={aggregated} />
            </TabsContent>

            <TabsContent key="assistant" value="assistant" className="space-y-6">
              <AIAssistant analysis={aggregated} projectName={projectName} />
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </main>
    </div>
  )
}

function DashboardOverview({ analysis }: { analysis: RepoAnalysis }) {
  const { t } = useI18n()
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Determine if dark mode is active
  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark")
  
  // Chart colors that adapt to theme
  const chartColors = {
    axis: isDark ? "#F8FAFC" : "#0F172A", // Light text on dark bg, dark text on light bg
    grid: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    tooltipBg: isDark ? "#111827" : "#FFFFFF",
    tooltipBorder: isDark ? "#1E293B" : "#E2E8F0",
    tooltipText: isDark ? "#F8FAFC" : "#0F172A",
  }
  
  const metrics = analysis?.metrics || defaultMetrics
  const totalCommits = analysis?.totalCommits || 0
  const totalPRs = analysis?.totalPRs || 0
  const mergedPRs = analysis?.mergedPRs || 0
  const contributors = analysis?.developers?.length || 0
  const analyzedPeriod = analysis?.analyzedPeriod || { start: new Date().toISOString(), end: new Date().toISOString() }

  // Section 1: KPIs Globaux (Header) - Cartes horizontales
  const globalKPIs = [
    { 
      icon: GitCommit, 
      label: "Total Commits", 
      value: totalCommits, 
      trend: "+8.3%", 
      trendDirection: "up" as const,
      color: "text-blue-400"
    },
    { 
      icon: GitPullRequest, 
      label: "Pull Requests", 
      value: totalPRs, 
      trend: "+12.1%", 
      trendDirection: "up" as const,
      color: "text-emerald-400"
    },
    { 
      icon: GitMerge, 
      label: "Merged PRs", 
      value: mergedPRs, 
      trend: "+15.7%", 
      trendDirection: "up" as const,
      color: "text-emerald-400"
    },
    { 
      icon: Users, 
      label: "Contributors", 
      value: contributors, 
      trend: "+5.2%", 
      trendDirection: "up" as const,
      color: "text-orange-400"
    },
  ]

  // Section 2: Métriques DORA avec badges et tendances
  const doraMetrics = [
    {
      title: t("kpi.deploymentFrequency"),
      value: metrics.deploymentFrequency?.value ?? 0,
      unit: metrics.deploymentFrequency?.unit ?? "per week",
      rating: metrics.deploymentFrequency?.rating || "low",
      icon: Zap,
      description: "How often code is deployed to production",
      trend: "+12.5%",
      trendDirection: "up" as const,
    },
    {
      title: t("kpi.leadTime"),
      value: metrics.leadTime?.value ?? 0,
      unit: metrics.leadTime?.unit ?? "hours",
      rating: metrics.leadTime?.rating || "low",
      icon: Clock,
      description: "Time from commit to production",
      trend: "-8.2%",
      trendDirection: "down" as const,
    },
    {
      title: t("kpi.changeFailureRate"),
      value: metrics.changeFailureRate?.value ?? 0,
      unit: "%",
      rating: metrics.changeFailureRate?.rating || "low",
      icon: AlertTriangle,
      description: "Percentage of deployments causing failures",
      trend: "-15.3%",
      trendDirection: "down" as const,
    },
    {
      title: t("kpi.mttr"),
      value: metrics.mttr?.value ?? 0,
      unit: metrics.mttr?.unit ?? "hours",
      rating: metrics.mttr?.rating || "low",
      icon: RotateCcw,
      description: "Recovery time after incidents",
      trend: "-22.1%",
      trendDirection: "down" as const,
    },
  ]

  // Données pour les graphiques
  const weeks = (metrics.deploymentFrequency?.trend || Array(12).fill(0)).map((_, index) => `W${index + 1}`)
  const deploymentTrendData = weeks.map((week, index) => ({
    week,
    deployments: metrics.deploymentFrequency?.trend?.[index] ?? 0,
    failures: Math.floor((metrics.deploymentFrequency?.trend?.[index] ?? 0) * 0.1),
  }))

  // Données pour le donut chart PR Status
  const openPRs = totalPRs - mergedPRs
  const closedPRs = Math.floor(totalPRs * 0.1)
  const prStatusData = [
    { name: "Merged", value: mergedPRs, color: "#10B981" },
    { name: "Open", value: openPRs, color: "#3B82F6" },
    { name: "Closed", value: closedPRs, color: "#EF4444" },
  ]

  // Données pour l'histogramme activité hebdomadaire
  const weeklyActivityData = [
    { day: "Mon", commits: 45, prs: 12 },
    { day: "Tue", commits: 52, prs: 15 },
    { day: "Wed", commits: 48, prs: 14 },
    { day: "Thu", commits: 55, prs: 18 },
    { day: "Fri", commits: 42, prs: 11 },
    { day: "Sat", commits: 15, prs: 3 },
    { day: "Sun", commits: 8, prs: 2 },
  ]

  // Données pour Lead Time Distribution
  const leadTimeDistributionData = [
    { range: "<1h", count: 140 },
    { range: "1-2h", count: 230 },
    { range: "2-4h", count: 175 },
    { range: "4-8h", count: 90 },
    { range: "8-24h", count: 50 },
    { range: ">24h", count: 25 },
  ]

  return (
    <div className="space-y-8">
      {/* Section 1: KPIs Globaux (Header) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-foreground">Repository Overview</h2>
          <p className="text-sm text-muted-foreground">Global metrics for your repository</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {globalKPIs.map((kpi, index) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-border/50 bg-card hover:bg-card/80 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-primary/10 ${kpi.color}`}>
                        <kpi.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{kpi.label}</p>
                        <p className="text-2xl font-bold text-foreground">{kpi.value.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="inline-flex items-center text-xs font-medium text-emerald-400">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        {kpi.trend}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">vs last period</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Section 2: Métriques DORA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-foreground">DORA Metrics</h2>
          <p className="text-sm text-muted-foreground">Key performance indicators for software delivery</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {doraMetrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="border-border/50 bg-card hover:bg-card/80 transition-colors relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2 rounded-lg bg-primary/10`}>
                      <metric.icon className="h-5 w-5 text-primary" />
                    </div>
                    <Badge rating={metric.rating} />
                  </div>
                  <div className="mb-2">
                    <p className="text-3xl font-bold text-foreground mb-1">
                      {metric.value} {metric.unit}
                    </p>
                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    {metric.trendDirection === "up" ? (
                      <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-400" />
                    )}
                    <span className={`text-xs font-medium ${
                      metric.trendDirection === "up" ? "text-emerald-400" : "text-red-400"
                    }`}>
                      {metric.trend}
                    </span>
                    <span className="text-xs text-muted-foreground">vs last period</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Section 3: Analytics & Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-foreground">Deployment Analytics</h2>
          <p className="text-sm text-muted-foreground">Deployment trends and performance classification</p>
        </div>
        
        {/* Deployment Trend + DORA Performance Level */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          {/* Deployment Trend (12 weeks) */}
          <Card className="border-border/50 bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                Deployment Trend
              </CardTitle>
              <p className="text-sm text-muted-foreground">Weekly deployment activity over the last 12 weeks</p>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={deploymentTrendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} opacity={0.3} />
                    <XAxis
                      dataKey="week"
                      stroke={chartColors.axis}
                      tick={{ fill: chartColors.axis }}
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                    />
                    <YAxis
                      stroke={chartColors.axis}
                      tick={{ fill: chartColors.axis }}
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: chartColors.tooltipBg,
                        border: `1px solid ${chartColors.tooltipBorder}`,
                        borderRadius: 8,
                        color: chartColors.tooltipText,
                        fontSize: 12,
                      }}
                    />
                    <RechartsLegend wrapperStyle={{ color: chartColors.axis }} />
                    <Line
                      type="monotone"
                      dataKey="deployments"
                      name="Deployments"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      dot={false}
                    >
                      <LabelList dataKey="deployments" position="top" fill={chartColors.axis} fontSize={10} />
                    </Line>
                    <Line
                      type="monotone"
                      dataKey="failures"
                      name="Failures"
                      stroke="#EF4444"
                      strokeWidth={2}
                      dot={false}
                    >
                      <LabelList dataKey="failures" position="top" fill={chartColors.axis} fontSize={10} />
                    </Line>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* DORA Performance Level */}
          <Card className="border-border/50 bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">DORA Performance Level</CardTitle>
              <p className="text-sm text-muted-foreground">Overall team performance classification</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-64">
                <div className="relative w-48 h-48 mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="hsl(var(--border))"
                      strokeWidth="16"
                      fill="none"
                      opacity={0.2}
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#10B981"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 80}`}
                      strokeDashoffset={`${2 * Math.PI * 80 * 0.25}`}
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 0.75 }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-foreground">Elite</span>
                    <span className="text-sm text-muted-foreground">Performance</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Insights: Weekly Activity + PR Status */}
        <div className="mb-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-foreground">Activity Insights</h2>
            <p className="text-sm text-muted-foreground">Detailed breakdown of development activity</p>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Weekly Activity Histogram */}
            <Card className="border-border/50 bg-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">Weekly Activity</CardTitle>
                <p className="text-sm text-muted-foreground">Commits and pull requests by day</p>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyActivityData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} opacity={0.3} />
                      <XAxis
                        dataKey="day"
                        stroke={chartColors.axis}
                        tick={{ fill: chartColors.axis }}
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                      />
                      <YAxis
                        stroke={chartColors.axis}
                        tick={{ fill: chartColors.axis }}
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: chartColors.tooltipBg,
                          border: `1px solid ${chartColors.tooltipBorder}`,
                          borderRadius: 8,
                          color: chartColors.tooltipText,
                          fontSize: 12,
                        }}
                      />
                      <RechartsLegend wrapperStyle={{ color: chartColors.axis }} />
                      <Bar dataKey="commits" fill="#8B5CF6" radius={[4, 4, 0, 0]}>
                        <LabelList dataKey="commits" position="top" fill={chartColors.axis} fontSize={10} />
                      </Bar>
                      <Bar dataKey="prs" fill="#06B6D4" radius={[4, 4, 0, 0]}>
                        <LabelList dataKey="prs" position="top" fill={chartColors.axis} fontSize={10} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Pull Request Status Donut Chart */}
            <Card className="border-border/50 bg-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">Pull Request Status</CardTitle>
                <p className="text-sm text-muted-foreground">Distribution of PR states</p>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {prStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: chartColors.tooltipBg,
                          border: `1px solid ${chartColors.tooltipBorder}`,
                          borderRadius: 8,
                          color: chartColors.tooltipText,
                          fontSize: 12,
                        }}
                        formatter={(value: number) => [`${value}`, ""]}
                      />
                      <RechartsLegend
                        verticalAlign="bottom"
                        height={36}
                        wrapperStyle={{ color: chartColors.axis }}
                        formatter={(value, entry: any) => `${value}: ${entry.payload.value}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Lead Time Distribution */}
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Lead Time Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">Time from commit to deployment</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={leadTimeDistributionData}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 60, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} opacity={0.3} />
                  <XAxis 
                    type="number" 
                    stroke={chartColors.axis}
                    tick={{ fill: chartColors.axis }}
                    tickLine={false} 
                    axisLine={false} 
                    fontSize={12} 
                  />
                  <YAxis
                    dataKey="range"
                    type="category"
                    stroke={chartColors.axis}
                    tick={{ fill: chartColors.axis }}
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: chartColors.tooltipBg,
                      border: `1px solid ${chartColors.tooltipBorder}`,
                      borderRadius: 8,
                      color: chartColors.tooltipText,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]}>
                    <LabelList dataKey="count" position="right" fill={chartColors.axis} fontSize={11} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// Badge component for DORA ratings
function Badge({ rating }: { rating: "elite" | "high" | "medium" | "low" }) {
  const config = {
    elite: { bg: "bg-emerald-500", text: "text-white", label: "Elite" },
    high: { bg: "bg-blue-500", text: "text-white", label: "High" },
    medium: { bg: "bg-amber-500", text: "text-white", label: "Medium" },
    low: { bg: "bg-red-500", text: "text-white", label: "Low" },
  }
  const { bg, text, label } = config[rating] || config.medium

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  )
}

function MetricBar({ label, rating }: { label: string; rating: "elite" | "high" | "medium" | "low" }) {
  const widths: Record<string, string> = {
    low: "25%",
    medium: "50%",
    high: "75%",
    elite: "100%",
  }

  const colors: Record<string, string> = {
    low: "from-red-500 to-red-400",
    medium: "from-amber-500 to-amber-400",
    high: "from-blue-500 to-blue-400",
    elite: "from-emerald-500 to-emerald-400",
  }

  const safeRating = rating && widths[rating] ? rating : "low"

  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-card-foreground">{label}</span>
        <span className="text-muted-foreground capitalize">{safeRating}</span>
      </div>
      <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: widths[safeRating] }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`h-full bg-gradient-to-r ${colors[safeRating]} rounded-full`}
        />
      </div>
    </div>
  )
}

const CHART_COLORS = ["#4f46e5", "#10b981", "#f97316", "#6366f1", "#ec4899", "#22c55e", "#eab308", "#06b6d4"]

function TeamPerformance({ analysis }: { analysis: RepoAnalysis }) {
  const { t } = useI18n()
  const developers = analysis.developers || []

  if (!developers.length) {
    return (
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">{t("dashboard.team")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No developer activity detected for this period.</p>
        </CardContent>
      </Card>
    )
  }

  const totalCommits = developers.reduce((sum, d) => sum + d.commits, 0)
  const totalPRs = developers.reduce((sum, d) => sum + d.pullRequests, 0)
  const totalDeploys = developers.reduce((sum, d) => sum + (d.mergedPRs || 0), 0)
  const totalReviews = developers.reduce((sum, d) => sum + d.pullRequests, 0)

  // Sort developers by commits for leaderboard
  const sortedDevelopers = [...developers]
    .map((d) => ({
      ...d,
      mergeRate: d.pullRequests > 0 ? (d.mergedPRs / d.pullRequests) * 100 : 0,
    }))
    .sort((a, b) => b.commits - a.commits)

  // Get rank badge component
  const getRankBadge = (index: number) => {
    if (index === 0) {
      return <Crown className="h-5 w-5 text-yellow-400" />
    } else if (index === 1) {
      return <Shield className="h-5 w-5 text-gray-400" />
    } else if (index === 2) {
      return <Award className="h-5 w-5 text-orange-400" />
    } else {
      return <span className="text-sm font-bold text-muted-foreground">#{index + 1}</span>
    }
  }

  // Calculate max values for progress bars
  const maxCommits = Math.max(...sortedDevelopers.map((d) => d.commits), 1)
  const maxPRs = Math.max(...sortedDevelopers.map((d) => d.pullRequests), 1)
  const maxDeploys = Math.max(...sortedDevelopers.map((d) => d.mergedPRs || 0), 1)

  return (
    <div className="space-y-8">
      {/* Section 1: KPIs Globaux */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-foreground">Team Performance</h2>
          <p className="text-sm text-muted-foreground">Individual contributor metrics and rankings</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/50 bg-card hover:bg-card/80 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                  <GitCommit className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Commits</p>
                  <p className="text-2xl font-bold text-foreground">{totalCommits}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card hover:bg-card/80 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <GitPullRequest className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total PRs</p>
                  <p className="text-2xl font-bold text-foreground">{totalPRs}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card hover:bg-card/80 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Code Reviews</p>
                  <p className="text-2xl font-bold text-foreground">{totalReviews}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card hover:bg-card/80 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400">
                  <Rocket className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Deployments</p>
                  <p className="text-2xl font-bold text-foreground">{totalDeploys}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Section 2: Team Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-foreground">Team Leaderboard</h2>
          <p className="text-sm text-muted-foreground">Performance ranking based on contributions</p>
        </div>
        <Card className="border-border/50 bg-card">
          <CardContent className="p-6">
            <div className="space-y-4">
              {sortedDevelopers.slice(0, 10).map((dev, index) => (
                <motion.div
                  key={dev.login}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-card/80 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank Badge */}
                    <div className="flex-shrink-0">{getRankBadge(index)}</div>

                    {/* Profile Picture */}
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={dev.avatar_url || "/placeholder-user.jpg"} alt={dev.login} />
                      <AvatarFallback>
                        <Users className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>

                    {/* Name and Role */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{dev.login}</p>
                      <p className="text-sm text-muted-foreground">Developer</p>
                    </div>

                    {/* Metrics with Progress Bars */}
                    <div className="hidden md:grid md:grid-cols-5 gap-4 flex-1">
                      {/* Commits */}
                      <div className="min-w-[100px]">
                        <div className="flex items-center justify-between mb-1">
                          <GitCommit className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">{dev.commits}</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(dev.commits / maxCommits) * 100}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="h-full bg-blue-500 rounded-full"
                          />
                        </div>
                      </div>

                      {/* PRs */}
                      <div className="min-w-[100px]">
                        <div className="flex items-center justify-between mb-1">
                          <GitPullRequest className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">{dev.pullRequests}</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(dev.pullRequests / maxPRs) * 100}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="h-full bg-emerald-500 rounded-full"
                          />
                        </div>
                      </div>

                      {/* Reviews */}
                      <div className="min-w-[80px]">
                        <div className="flex items-center justify-between mb-1">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">{dev.pullRequests}</span>
                        </div>
                      </div>

                      {/* Lead Time */}
                      <div className="min-w-[80px]">
                        <div className="flex items-center justify-between mb-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            {dev.avgReviewTime.toFixed(1)}h
                          </span>
                        </div>
                      </div>

                      {/* Deploys */}
                      <div className="min-w-[100px]">
                        <div className="flex items-center justify-between mb-1">
                          <Rocket className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">{dev.mergedPRs || 0}</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${((dev.mergedPRs || 0) / maxDeploys) * 100}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="h-full bg-orange-500 rounded-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Trend Indicator */}
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm font-medium text-emerald-400">+12%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

