// GitLab API types and utilities for DORA metrics calculation

export interface GitLabCommit {
  id: string
  short_id: string
  title: string
  author_name: string
  author_email: string
  authored_date: string
  committer_name: string
  committer_email: string
  committed_date: string
  message: string
  author: {
    id: number
    username: string
    name: string
    state: string
    avatar_url: string
  }
}

export interface GitLabMergeRequest {
  id: number
  iid: number
  title: string
  state: string
  created_at: string
  updated_at: string
  merged_at: string | null
  closed_at: string | null
  author: {
    id: number
    username: string
    name: string
    avatar_url: string
  }
  source_branch: string
  target_branch: string
  merged: boolean
}

export interface GitLabProject {
  id: number
  name: string
  path_with_namespace: string
  default_branch: string
}

const GITLAB_API = "https://gitlab.com/api/v4"

async function fetchGitLab<T>(endpoint: string, token?: string): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${GITLAB_API}${endpoint}`, {
    headers,
    next: { revalidate: 300 }, // Cache for 5 minutes
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Repository not found. Please check the URL and ensure it's accessible.")
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error("Authentication failed. Please check your GitLab token.")
    }
    throw new Error(`GitLab API error: ${response.status}`)
  }

  return response.json()
}

export async function getGitLabProject(projectPath: string, token?: string): Promise<GitLabProject> {
  const encodedPath = encodeURIComponent(projectPath)
  return fetchGitLab<GitLabProject>(`/projects/${encodedPath}`, token)
}

export async function getGitLabCommits(
  projectPath: string,
  since: string,
  token?: string,
  perPage = 100,
): Promise<GitLabCommit[]> {
  const encodedPath = encodeURIComponent(projectPath)
  const commits: GitLabCommit[] = []
  let page = 1
  const maxPages = 5 // Limit to 500 commits

  while (page <= maxPages) {
    const pageCommits = await fetchGitLab<GitLabCommit[]>(
      `/projects/${encodedPath}/repository/commits?since=${since}&per_page=${perPage}&page=${page}`,
      token,
    )

    if (pageCommits.length === 0) break
    commits.push(...pageCommits)
    if (pageCommits.length < perPage) break
    page++
  }

  return commits
}

export async function getGitLabMergeRequests(
  projectPath: string,
  state: "opened" | "closed" | "locked" | "merged" | "all" = "all",
  token?: string,
  perPage = 100,
): Promise<GitLabMergeRequest[]> {
  const encodedPath = encodeURIComponent(projectPath)
  const mrs: GitLabMergeRequest[] = []
  let page = 1
  const maxPages = 5 // Limit to 500 MRs

  while (page <= maxPages) {
    const pageMRs = await fetchGitLab<GitLabMergeRequest[]>(
      `/projects/${encodedPath}/merge_requests?state=${state}&per_page=${perPage}&page=${page}`,
      token,
    )

    if (pageMRs.length === 0) break
    mrs.push(...pageMRs)
    if (pageMRs.length < perPage) break
    page++
  }

  return mrs
}
