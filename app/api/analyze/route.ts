import { type NextRequest, NextResponse } from "next/server"
import {
  analyzeGitHubRepository,
  analyzeGitLabRepository,
  analyzeAzureRepository,
  aggregateAnalyses,
  type RepoAnalysis,
  type Platform,
} from "@/lib/sources"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const repos = searchParams.get("repos")
  const platform = (searchParams.get("platform") || "github") as Platform
  const days = parseInt(searchParams.get("days") || "90", 10)
  // Use token from query param, or fallback to environment variable for GitHub
  const token = searchParams.get("token") || (platform === "github" ? process.env.GITHUB_TOKEN || process.env.GITHUB_API_KEY : undefined) || undefined

  if (!repos) {
    return NextResponse.json({ error: "No repositories provided" }, { status: 400 })
  }

  const repoList = repos.split(",").map((r) => r.trim())

  try {
    const analyses: RepoAnalysis[] = []

    for (const repo of repoList) {
      let analysis: RepoAnalysis

      if (platform === "github") {
        const [owner, repoName] = repo.split("/")
        if (!owner || !repoName) {
          return NextResponse.json({ error: `Invalid GitHub repository format: ${repo}` }, { status: 400 })
        }
        analysis = await analyzeGitHubRepository(owner, repoName, days, token)
      } else if (platform === "gitlab") {
        // GitLab format: owner/repo or full path
        analysis = await analyzeGitLabRepository(repo, days, token)
      } else if (platform === "azure") {
        // Azure format: organization/project/repository
        const parts = repo.split("/")
        if (parts.length < 3) {
          return NextResponse.json({ error: `Invalid Azure repository format: ${repo}. Expected: org/project/repo` }, { status: 400 })
        }
        const [organization, project, ...repoParts] = parts
        const repository = repoParts.join("/")
        analysis = await analyzeAzureRepository(organization, project, repository, days, token)
      } else {
        return NextResponse.json({ error: `Unsupported platform: ${platform}` }, { status: 400 })
      }

      analyses.push(analysis)
    }

    // Return both individual and aggregated results
    const aggregated = aggregateAnalyses(analyses)

    return NextResponse.json({
      aggregated,
      individual: analyses,
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze repositories" },
      { status: 500 },
    )
  }
}
