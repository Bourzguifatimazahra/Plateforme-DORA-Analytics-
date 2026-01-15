// Azure DevOps API types and utilities for DORA metrics calculation

export interface AzureCommit {
  commitId: string
  author: {
    name: string
    email: string
    date: string
  }
  committer: {
    name: string
    email: string
    date: string
  }
  comment: string
  changeCounts: {
    Add: number
    Edit: number
    Delete: number
  }
}

export interface AzurePullRequest {
  pullRequestId: number
  status: string
  creationDate: string
  closedDate: string | null
  title: string
  description: string
  createdBy: {
    id: string
    displayName: string
    uniqueName: string
    imageUrl: string
  }
  sourceRefName: string
  targetRefName: string
  mergeStatus: string
  isDraft: boolean
}

export interface AzureRepository {
  id: string
  name: string
  defaultBranch: string
  url: string
}

export interface AzureProject {
  id: string
  name: string
}

const AZURE_DEVOPS_API = "https://dev.azure.com"

async function fetchAzure<T>(
  organization: string,
  project: string,
  endpoint: string,
  token?: string,
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (token) {
    // Base64 encode the token for Azure DevOps Basic Auth
    // Using Buffer in Node.js environment (Next.js API routes)
    const auth = typeof Buffer !== "undefined" 
      ? Buffer.from(`:${token}`).toString("base64")
      : btoa(`:${token}`)
    headers["Authorization"] = `Basic ${auth}`
  }

  const url = `${AZURE_DEVOPS_API}/${organization}/${project}/_apis${endpoint}`
  const response = await fetch(url, {
    headers,
    next: { revalidate: 300 }, // Cache for 5 minutes
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Repository or project not found. Please check the URL.")
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error("Authentication failed. Please check your Azure DevOps token.")
    }
    throw new Error(`Azure DevOps API error: ${response.status}`)
  }

  return response.json()
}

export async function getAzureRepository(
  organization: string,
  project: string,
  repository: string,
  token?: string,
): Promise<AzureRepository> {
  const result = await fetchAzure<{ value: AzureRepository[] }>(
    organization,
    project,
    `/git/repositories/${repository}?api-version=7.1`,
    token,
  )
  return result.value?.[0] || result
}

export async function getAzureCommits(
  organization: string,
  project: string,
  repository: string,
  since: string,
  token?: string,
): Promise<AzureCommit[]> {
  const commits: AzureCommit[] = []
  let continuationToken: string | undefined

  do {
    const endpoint = `/git/repositories/${repository}/commits?searchCriteria.fromDate=${since}&$top=100&api-version=7.1${
      continuationToken ? `&continuationToken=${continuationToken}` : ""
    }`
    const result = await fetchAzure<{ value: AzureCommit[]; continuationToken?: string }>(
      organization,
      project,
      endpoint,
      token,
    )

    if (result.value) {
      commits.push(...result.value)
      continuationToken = result.continuationToken
    } else {
      break
    }

    // Limit to 500 commits
    if (commits.length >= 500) break
  } while (continuationToken)

  return commits
}

export async function getAzurePullRequests(
  organization: string,
  project: string,
  repository: string,
  token?: string,
): Promise<AzurePullRequest[]> {
  const prs: AzurePullRequest[] = []
  let continuationToken: string | undefined

  do {
    const endpoint = `/git/repositories/${repository}/pullrequests?$top=100&api-version=7.1${
      continuationToken ? `&continuationToken=${continuationToken}` : ""
    }`
    const result = await fetchAzure<{ value: AzurePullRequest[]; continuationToken?: string }>(
      organization,
      project,
      endpoint,
      token,
    )

    if (result.value) {
      prs.push(...result.value)
      continuationToken = result.continuationToken
    } else {
      break
    }

    // Limit to 500 PRs
    if (prs.length >= 500) break
  } while (continuationToken)

  return prs
}
