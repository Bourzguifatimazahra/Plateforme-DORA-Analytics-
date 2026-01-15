// Unified data source interface and analysis functions

import { analyzeRepository as analyzeGitHub, type RepoAnalysis, type DORAMetrics, type DeveloperStats } from "./github"
import {
  getGitLabProject,
  getGitLabCommits,
  getGitLabMergeRequests,
  type GitLabCommit,
  type GitLabMergeRequest,
} from "./gitlab"
import {
  getAzureRepository,
  getAzureCommits,
  getAzurePullRequests,
  type AzureCommit,
  type AzurePullRequest,
} from "./azure"

export type Platform = "github" | "gitlab" | "azure"

function rateDeploymentFrequency(deploysPerWeek: number): "elite" | "high" | "medium" | "low" {
  if (deploysPerWeek >= 7) return "elite"
  if (deploysPerWeek >= 1) return "high"
  if (deploysPerWeek >= 0.25) return "medium"
  return "low"
}

function rateLeadTime(hours: number): "elite" | "high" | "medium" | "low" {
  if (hours < 1) return "elite"
  if (hours < 24) return "high"
  if (hours < 168) return "medium"
  return "low"
}

function rateChangeFailureRate(rate: number): "elite" | "high" | "medium" | "low" {
  if (rate <= 15) return "elite"
  if (rate <= 30) return "high"
  if (rate <= 45) return "medium"
  return "low"
}

function rateMTTR(hours: number): "elite" | "high" | "medium" | "low" {
  if (hours < 1) return "elite"
  if (hours < 24) return "high"
  if (hours < 168) return "medium"
  return "low"
}

export async function analyzeGitLabRepository(
  projectPath: string,
  days: number = 90,
  token?: string,
): Promise<RepoAnalysis> {
  const since = new Date()
  since.setDate(since.getDate() - days)
  const sinceISO = since.toISOString()

  const [project, commits, mergeRequests] = await Promise.all([
    getGitLabProject(projectPath, token),
    getGitLabCommits(projectPath, sinceISO, token),
    getGitLabMergeRequests(projectPath, "all", token),
  ])

  const recentMRs = mergeRequests.filter((mr) => new Date(mr.created_at) >= since)
  const mergedMRs = recentMRs.filter((mr) => mr.merged_at && mr.target_branch === project.default_branch)

  const weeks = days / 7
  const deploysPerWeek = mergedMRs.length / weeks

  const weeklyDeployments: number[] = []
  for (let i = 0; i < 12; i++) {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - (i + 1) * 7)
    const weekEnd = new Date()
    weekEnd.setDate(weekEnd.getDate() - i * 7)

    const count = mergedMRs.filter((mr) => {
      const mergedDate = new Date(mr.merged_at!)
      return mergedDate >= weekStart && mergedDate < weekEnd
    }).length

    weeklyDeployments.unshift(count)
  }

  let totalLeadTime = 0
  let leadTimeCount = 0

  for (const mr of mergedMRs) {
    if (mr.merged_at && mr.created_at) {
      const leadTime = new Date(mr.merged_at).getTime() - new Date(mr.created_at).getTime()
      totalLeadTime += leadTime
      leadTimeCount++
    }
  }

  const avgLeadTimeHours = leadTimeCount > 0 ? totalLeadTime / leadTimeCount / (1000 * 60 * 60) : 0

  const revertMRs = mergedMRs.filter(
    (mr) =>
      mr.title.toLowerCase().includes("revert") ||
      mr.title.toLowerCase().includes("hotfix") ||
      mr.title.toLowerCase().includes("fix:") ||
      mr.title.toLowerCase().includes("bugfix"),
  )
  const changeFailureRate = mergedMRs.length > 0 ? (revertMRs.length / mergedMRs.length) * 100 : 0

  const fixMRs = recentMRs.filter(
    (mr) => (mr.title.toLowerCase().includes("fix") || mr.title.toLowerCase().includes("hotfix")) && mr.merged_at,
  )

  let totalFixTime = 0
  for (const mr of fixMRs) {
    if (mr.merged_at && mr.created_at) {
      totalFixTime += new Date(mr.merged_at).getTime() - new Date(mr.created_at).getTime()
    }
  }
  const avgMTTRHours = fixMRs.length > 0 ? totalFixTime / fixMRs.length / (1000 * 60 * 60) : 0

  const developerMap = new Map<string, DeveloperStats>()

  for (const commit of commits) {
    const login = commit.author?.username || commit.author_email
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
    const commitTitle = commit.message.split("\n")[0].substring(0, 100)
    if (existing.commitTitles.length < 20) {
      existing.commitTitles.push(commitTitle)
    }
    developerMap.set(login, existing)
  }

  for (const mr of recentMRs) {
    const login = mr.author.username
    const existing = developerMap.get(login) || {
      login,
      avatar_url: mr.author.avatar_url,
      commits: 0,
      pullRequests: 0,
      avgReviewTime: 0,
      mergedPRs: 0,
      commitTitles: [],
    }
    existing.pullRequests++
    if (mr.merged_at) {
      existing.mergedPRs++
      const reviewTime = new Date(mr.merged_at).getTime() - new Date(mr.created_at).getTime()
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
    repo: projectPath,
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
    totalPRs: recentMRs.length,
    mergedPRs: mergedMRs.length,
    analyzedPeriod: {
      start: sinceISO,
      end: new Date().toISOString(),
    },
  }
}

export async function analyzeAzureRepository(
  organization: string,
  project: string,
  repository: string,
  days: number = 90,
  token?: string,
): Promise<RepoAnalysis> {
  const since = new Date()
  since.setDate(since.getDate() - days)
  const sinceISO = since.toISOString()

  const [repoInfo, commits, pullRequests] = await Promise.all([
    getAzureRepository(organization, project, repository, token),
    getAzureCommits(organization, project, repository, sinceISO, token),
    getAzurePullRequests(organization, project, repository, token),
  ])

  const recentPRs = pullRequests.filter((pr) => new Date(pr.creationDate) >= since)
  const mergedPRs = recentPRs.filter(
    (pr) => pr.status === "completed" && pr.targetRefName === `refs/heads/${repoInfo.defaultBranch}`,
  )

  const weeks = days / 7
  const deploysPerWeek = mergedPRs.length / weeks

  const weeklyDeployments: number[] = []
  for (let i = 0; i < 12; i++) {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - (i + 1) * 7)
    const weekEnd = new Date()
    weekEnd.setDate(weekEnd.getDate() - i * 7)

    const count = mergedPRs.filter((pr) => {
      const closedDate = pr.closedDate ? new Date(pr.closedDate) : null
      return closedDate && closedDate >= weekStart && closedDate < weekEnd
    }).length

    weeklyDeployments.unshift(count)
  }

  let totalLeadTime = 0
  let leadTimeCount = 0

  for (const pr of mergedPRs) {
    if (pr.closedDate && pr.creationDate) {
      const leadTime = new Date(pr.closedDate).getTime() - new Date(pr.creationDate).getTime()
      totalLeadTime += leadTime
      leadTimeCount++
    }
  }

  const avgLeadTimeHours = leadTimeCount > 0 ? totalLeadTime / leadTimeCount / (1000 * 60 * 60) : 0

  const revertPRs = mergedPRs.filter(
    (pr) =>
      pr.title.toLowerCase().includes("revert") ||
      pr.title.toLowerCase().includes("hotfix") ||
      pr.title.toLowerCase().includes("fix:") ||
      pr.title.toLowerCase().includes("bugfix"),
  )
  const changeFailureRate = mergedPRs.length > 0 ? (revertPRs.length / mergedPRs.length) * 100 : 0

  const fixPRs = recentPRs.filter(
    (pr) => (pr.title.toLowerCase().includes("fix") || pr.title.toLowerCase().includes("hotfix")) && pr.closedDate,
  )

  let totalFixTime = 0
  for (const pr of fixPRs) {
    if (pr.closedDate && pr.creationDate) {
      totalFixTime += new Date(pr.closedDate).getTime() - new Date(pr.creationDate).getTime()
    }
  }
  const avgMTTRHours = fixPRs.length > 0 ? totalFixTime / fixPRs.length / (1000 * 60 * 60) : 0

  const developerMap = new Map<string, DeveloperStats>()

  for (const commit of commits) {
    const login = commit.author.name || commit.author.email
    const existing = developerMap.get(login) || {
      login,
      avatar_url: "",
      commits: 0,
      pullRequests: 0,
      avgReviewTime: 0,
      mergedPRs: 0,
      commitTitles: [],
    }
    existing.commits++
    const commitTitle = commit.comment.split("\n")[0].substring(0, 100)
    if (existing.commitTitles.length < 20) {
      existing.commitTitles.push(commitTitle)
    }
    developerMap.set(login, existing)
  }

  for (const pr of recentPRs) {
    const login = pr.createdBy.displayName || pr.createdBy.uniqueName
    const existing = developerMap.get(login) || {
      login,
      avatar_url: pr.createdBy.imageUrl || "",
      commits: 0,
      pullRequests: 0,
      avgReviewTime: 0,
      mergedPRs: 0,
      commitTitles: [],
    }
    existing.pullRequests++
    if (pr.closedDate && pr.status === "completed") {
      existing.mergedPRs++
      const reviewTime = new Date(pr.closedDate).getTime() - new Date(pr.creationDate).getTime()
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
    repo: `${organization}/${project}/${repository}`,
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

export async function analyzeGitHubRepository(owner: string, repo: string, days: number = 90, token?: string): Promise<RepoAnalysis> {
  const { analyzeRepository } = await import("./github")
  return analyzeRepository(owner, repo, days, token)
}
export { aggregateAnalyses } from "./github"
export type { RepoAnalysis, DORAMetrics, DeveloperStats } from "./github"
