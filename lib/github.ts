// GitHub API types and utilities for DORA metrics calculation

export interface GitHubCommit {
  sha: string
  commit: {
    author: {
      name: string
      email: string
      date: string
    }
    message: string
  }
  author: {
    login: string
    avatar_url: string
  } | null
}

export interface GitHubPullRequest {
  number: number
  title: string
  state: string
  created_at: string
  merged_at: string | null
  closed_at: string | null
  user: {
    login: string
    avatar_url: string
  }
  head: {
    ref: string
  }
  base: {
    ref: string
  }
  merged: boolean
}

export interface GitHubRepo {
  name: string
  full_name: string
  default_branch: string
}

export interface DORAMetrics {
  deploymentFrequency: {
    value: number
    unit: string
    rating: "elite" | "high" | "medium" | "low"
    trend: number[]
  }
  leadTime: {
    value: number
    unit: string
    rating: "elite" | "high" | "medium" | "low"
  }
  changeFailureRate: {
    value: number
    rating: "elite" | "high" | "medium" | "low"
  }
  mttr: {
    value: number
    unit: string
    rating: "elite" | "high" | "medium" | "low"
  }
}

export interface DeveloperStats {
  login: string
  avatar_url: string
  commits: number
  pullRequests: number
  avgReviewTime: number
  mergedPRs: number
  commitTitles: string[]
  contributionPercent?: number
  // Additional developer performance KPIs
  mergeRate?: number // Percentage of PRs that get merged
  avgCommitsPerPR?: number // Average commits per PR
  codeQualityScore?: number // Based on PR merge rate and review time
  activeDays?: number // Number of days with commits
  prVelocity?: number // PRs per week
  firstResponseTime?: number // Average time to first review (hours)
}

export interface RepoAnalysis {
  repo: string
  metrics: DORAMetrics
  developers: DeveloperStats[]
  totalCommits: number
  totalPRs: number
  mergedPRs: number
  analyzedPeriod: {
    start: string
    end: string
  }
}

const GITHUB_API = "https://api.github.com"

async function fetchGitHub<T>(endpoint: string, token?: string): Promise<T> {
  // Use token from parameter, environment variable, or undefined
  const githubToken = token || process.env.GITHUB_TOKEN || process.env.GITHUB_API_KEY
  
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "DORA-KPI-Dashboard",
  }

  if (githubToken) {
    headers["Authorization"] = `Bearer ${githubToken}`
  }

  const response = await fetch(`${GITHUB_API}${endpoint}`, {
    headers,
    next: { revalidate: 300 }, // Cache for 5 minutes
  })

  // Check rate limit headers
  const remaining = response.headers.get("x-ratelimit-remaining")
  const resetTime = response.headers.get("x-ratelimit-reset")
  
  if (!response.ok) {
    if (response.status === 404) {
      const errorMsg = githubToken 
        ? "Repository not found. Please check the repository URL and ensure it exists."
        : "Repository not found or is private. Please check the URL or provide a GitHub token for private repositories."
      throw new Error(errorMsg)
    }
    if (response.status === 401) {
      const errorMsg = githubToken
        ? "Authentication failed. Your GitHub token is invalid or expired. Please check your token and try again. You can create a new token at https://github.com/settings/tokens"
        : "Authentication required. This repository may be private. Please provide a GitHub token in the form or set GITHUB_TOKEN in your .env.local file. You can create a token at https://github.com/settings/tokens"
      throw new Error(errorMsg)
    }
    if (response.status === 403) {
      const rateLimitInfo = remaining !== null 
        ? ` Rate limit remaining: ${remaining}.` 
        : ""
      const resetInfo = resetTime 
        ? ` Rate limit resets at: ${new Date(parseInt(resetTime) * 1000).toLocaleString()}.`
        : ""
      
      if (!githubToken) {
        throw new Error(
          `API rate limit exceeded for unauthenticated requests (60 requests/hour).` +
          ` Please add a GitHub token in your .env.local file (GITHUB_TOKEN=your_token) or provide it in the form.` +
          ` With a token, you get 5,000 requests/hour.${resetInfo}`
        )
      }
      throw new Error(
        `API rate limit exceeded or access denied.${rateLimitInfo}${resetInfo}` +
        ` Please check your token permissions or try again later.`
      )
    }
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
  }

  // Log rate limit info in development
  if (process.env.NODE_ENV === "development" && remaining !== null) {
    console.log(`GitHub API: ${remaining} requests remaining`)
  }

  return response.json()
}

export async function getRepoInfo(owner: string, repo: string, token?: string): Promise<GitHubRepo> {
  return fetchGitHub<GitHubRepo>(`/repos/${owner}/${repo}`, token)
}

export async function getCommits(owner: string, repo: string, since: string, perPage = 100, token?: string): Promise<GitHubCommit[]> {
  const commits: GitHubCommit[] = []
  let page = 1
  const maxPages = 5 // Limit to 500 commits

  while (page <= maxPages) {
    const pageCommits = await fetchGitHub<GitHubCommit[]>(
      `/repos/${owner}/${repo}/commits?since=${since}&per_page=${perPage}&page=${page}`,
      token,
    )

    if (pageCommits.length === 0) break
    commits.push(...pageCommits)
    if (pageCommits.length < perPage) break
    page++
  }

  return commits
}

export async function getPullRequests(
  owner: string,
  repo: string,
  state: "all" | "open" | "closed" = "all",
  perPage = 100,
  token?: string,
): Promise<GitHubPullRequest[]> {
  const prs: GitHubPullRequest[] = []
  let page = 1
  const maxPages = 5 // Limit to 500 PRs

  while (page <= maxPages) {
    const pagePRs = await fetchGitHub<GitHubPullRequest[]>(
      `/repos/${owner}/${repo}/pulls?state=${state}&per_page=${perPage}&page=${page}`,
      token,
    )

    if (pagePRs.length === 0) break
    prs.push(...pagePRs)
    if (pagePRs.length < perPage) break
    page++
  }

  return prs
}

function rateDeploymentFrequency(deploysPerWeek: number): "elite" | "high" | "medium" | "low" {
  // DORA benchmarks: Elite = on-demand (multiple per day), High = daily-weekly, Medium = weekly-monthly, Low = monthly+
  if (deploysPerWeek >= 7) return "elite" // Daily or more
  if (deploysPerWeek >= 1) return "high" // At least weekly
  if (deploysPerWeek >= 0.25) return "medium" // At least monthly
  return "low"
}

function rateLeadTime(hours: number): "elite" | "high" | "medium" | "low" {
  // DORA benchmarks: Elite = <1 hour, High = <1 day, Medium = <1 week, Low = >1 week
  if (hours < 1) return "elite"
  if (hours < 24) return "high"
  if (hours < 168) return "medium" // 7 days
  return "low"
}

function rateChangeFailureRate(rate: number): "elite" | "high" | "medium" | "low" {
  // DORA benchmarks: Elite = 0-15%, High = 16-30%, Medium = 16-30%, Low = >30%
  if (rate <= 15) return "elite"
  if (rate <= 30) return "high"
  if (rate <= 45) return "medium"
  return "low"
}

function rateMTTR(hours: number): "elite" | "high" | "medium" | "low" {
  // DORA benchmarks: Elite = <1 hour, High = <1 day, Medium = <1 week, Low = >1 week
  if (hours < 1) return "elite"
  if (hours < 24) return "high"
  if (hours < 168) return "medium"
  return "low"
}

export async function analyzeRepository(owner: string, repo: string, days: number = 90, token?: string): Promise<RepoAnalysis> {
  // Analyze specified number of days
  const since = new Date()
  since.setDate(since.getDate() - days)
  const sinceISO = since.toISOString()

  // Fetch data in parallel
  const [repoInfo, commits, pullRequests] = await Promise.all([
    getRepoInfo(owner, repo, token),
    getCommits(owner, repo, sinceISO, 100, token),
    getPullRequests(owner, repo, "all", 100, token),
  ])

  // Filter PRs to last 90 days
  const recentPRs = pullRequests.filter((pr) => new Date(pr.created_at) >= since)
  const mergedPRs = recentPRs.filter((pr) => pr.merged_at && pr.base.ref === repoInfo.default_branch)

  // Calculate Deployment Frequency (merges to main branch as proxy)
  const weeks = days / 7
  const deploysPerWeek = mergedPRs.length / weeks

  // Calculate weekly deployment trend
  const weeklyDeployments: number[] = []
  for (let i = 0; i < 12; i++) {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - (i + 1) * 7)
    const weekEnd = new Date()
    weekEnd.setDate(weekEnd.getDate() - i * 7)

    const count = mergedPRs.filter((pr) => {
      const mergedDate = new Date(pr.merged_at!)
      return mergedDate >= weekStart && mergedDate < weekEnd
    }).length

    weeklyDeployments.unshift(count)
  }

  // Calculate Lead Time for Changes (time from first commit in branch to merge)
  let totalLeadTime = 0
  let leadTimeCount = 0

  for (const pr of mergedPRs) {
    if (pr.merged_at && pr.created_at) {
      const leadTime = new Date(pr.merged_at).getTime() - new Date(pr.created_at).getTime()
      totalLeadTime += leadTime
      leadTimeCount++
    }
  }

  const avgLeadTimeHours = leadTimeCount > 0 ? totalLeadTime / leadTimeCount / (1000 * 60 * 60) : 0

  // Calculate Change Failure Rate (reverts as proxy)
  const revertPRs = mergedPRs.filter(
    (pr) =>
      pr.title.toLowerCase().includes("revert") ||
      pr.title.toLowerCase().includes("hotfix") ||
      pr.title.toLowerCase().includes("fix:") ||
      pr.title.toLowerCase().includes("bugfix"),
  )
  const changeFailureRate = mergedPRs.length > 0 ? (revertPRs.length / mergedPRs.length) * 100 : 0

  // Calculate MTTR (time between failure PR and fix PR - simplified)
  // Using average time to close fix PRs as proxy
  const fixPRs = recentPRs.filter(
    (pr) => (pr.title.toLowerCase().includes("fix") || pr.title.toLowerCase().includes("hotfix")) && pr.merged_at,
  )

  let totalFixTime = 0
  for (const pr of fixPRs) {
    if (pr.merged_at && pr.created_at) {
      totalFixTime += new Date(pr.merged_at).getTime() - new Date(pr.created_at).getTime()
    }
  }
  const avgMTTRHours = fixPRs.length > 0 ? totalFixTime / fixPRs.length / (1000 * 60 * 60) : 0

  const developerMap = new Map<string, DeveloperStats>()

  // Process commits
  for (const commit of commits) {
    const login = commit.author?.login || commit.commit.author.email
    const existing = developerMap.get(login) || {
      login,
      avatar_url: commit.author?.avatar_url || "",
      commits: 0,
      pullRequests: 0,
      avgReviewTime: 0,
      mergedPRs: 0,
      commitTitles: [],
    }
    existing.commits++
    // Add commit title (first line of commit message)
    const commitTitle = commit.commit.message.split("\n")[0].substring(0, 100)
    if (existing.commitTitles.length < 20) {
      existing.commitTitles.push(commitTitle)
    }
    developerMap.set(login, existing)
  }

  // Process PRs
  for (const pr of recentPRs) {
    const login = pr.user.login
    const existing = developerMap.get(login) || {
      login,
      avatar_url: pr.user.avatar_url,
      commits: 0,
      pullRequests: 0,
      avgReviewTime: 0,
      mergedPRs: 0,
      commitTitles: [],
    }
    existing.pullRequests++
    if (pr.merged_at) {
      existing.mergedPRs++
      const reviewTime = new Date(pr.merged_at).getTime() - new Date(pr.created_at).getTime()
      existing.avgReviewTime =
        (existing.avgReviewTime * (existing.mergedPRs - 1) + reviewTime / (1000 * 60 * 60)) / existing.mergedPRs
    }
    developerMap.set(login, existing)
  }

  const totalCommitsAll = commits.length
  const developers = Array.from(developerMap.values())
    .map((dev) => ({
      ...dev,
      contributionPercent: totalCommitsAll > 0 ? (dev.commits / totalCommitsAll) * 100 : 0,
    }))
    .sort((a, b) => b.commits - a.commits)

  return {
    repo: `${owner}/${repo}`,
    metrics: {
      deploymentFrequency: {
        value: Number(deploysPerWeek.toFixed(1)),
        unit: "per week",
        rating: rateDeploymentFrequency(deploysPerWeek),
        trend: weeklyDeployments,
      },
      leadTime: {
        value: Number(avgLeadTimeHours.toFixed(1)),
        unit: "hours",
        rating: rateLeadTime(avgLeadTimeHours),
      },
      changeFailureRate: {
        value: Number(changeFailureRate.toFixed(1)),
        rating: rateChangeFailureRate(changeFailureRate),
      },
      mttr: {
        value: Number(avgMTTRHours.toFixed(1)),
        unit: "hours",
        rating: rateMTTR(avgMTTRHours),
      },
    },
    developers,
    totalCommits: commits.length,
    totalPRs: recentPRs.length,
    mergedPRs: mergedPRs.length,
    analyzedPeriod: {
      start: sinceISO,
      end: new Date().toISOString(),
    },
  }
}

export function aggregateAnalyses(analyses: RepoAnalysis[]): RepoAnalysis {
  if (analyses.length === 1) return analyses[0]

  // Aggregate metrics across repos
  const totalDeployFreq = analyses.reduce((sum, a) => sum + a.metrics.deploymentFrequency.value, 0) / analyses.length
  const totalLeadTime = analyses.reduce((sum, a) => sum + a.metrics.leadTime.value, 0) / analyses.length
  const totalCFR = analyses.reduce((sum, a) => sum + a.metrics.changeFailureRate.value, 0) / analyses.length
  const totalMTTR = analyses.reduce((sum, a) => sum + a.metrics.mttr.value, 0) / analyses.length

  // Aggregate weekly deployments
  const aggregatedTrend = analyses[0].metrics.deploymentFrequency.trend.map((_, i) =>
    analyses.reduce((sum, a) => sum + (a.metrics.deploymentFrequency.trend[i] || 0), 0),
  )

  // Merge developer stats
  const devMap = new Map<string, DeveloperStats>()
  for (const analysis of analyses) {
    for (const dev of analysis.developers) {
      const existing = devMap.get(dev.login)
      if (existing) {
        existing.commits += dev.commits
        existing.pullRequests += dev.pullRequests
        existing.mergedPRs += dev.mergedPRs
        existing.avgReviewTime = (existing.avgReviewTime + dev.avgReviewTime) / 2
        existing.commitTitles = [...existing.commitTitles, ...dev.commitTitles].slice(0, 20)
      } else {
        devMap.set(dev.login, { ...dev })
      }
    }
  }

  return {
    repo: analyses.map((a) => a.repo).join(", "),
    metrics: {
      deploymentFrequency: {
        value: Number(totalDeployFreq.toFixed(1)),
        unit: "per week",
        rating: rateDeploymentFrequency(totalDeployFreq),
        trend: aggregatedTrend,
      },
      leadTime: {
        value: Number(totalLeadTime.toFixed(1)),
        unit: "hours",
        rating: rateLeadTime(totalLeadTime),
      },
      changeFailureRate: {
        value: Number(totalCFR.toFixed(1)),
        rating: rateChangeFailureRate(totalCFR),
      },
      mttr: {
        value: Number(totalMTTR.toFixed(1)),
        unit: "hours",
        rating: rateMTTR(totalMTTR),
      },
    },
    developers: Array.from(devMap.values()).sort((a, b) => b.commits - a.commits),
    totalCommits: analyses.reduce((sum, a) => sum + a.totalCommits, 0),
    totalPRs: analyses.reduce((sum, a) => sum + a.totalPRs, 0),
    mergedPRs: analyses.reduce((sum, a) => sum + a.mergedPRs, 0),
    analyzedPeriod: {
      start: analyses[0].analyzedPeriod.start,
      end: analyses[0].analyzedPeriod.end,
    },
  }
}
