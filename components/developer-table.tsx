"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { DeveloperStats } from "@/lib/github"
import { Users, GitCommit, GitPullRequest, Clock, ChevronUp, ChevronDown, Search } from "lucide-react"

interface DeveloperTableProps {
  developers: DeveloperStats[]
}

type SortKey = "commits" | "pullRequests" | "avgReviewTime" | "mergedPRs"
type SortDirection = "asc" | "desc"

export function DeveloperTable({ developers }: DeveloperTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("commits")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [searchQuery, setSearchQuery] = useState("")

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDirection("desc")
    }
  }

  const filteredDevelopers = developers.filter((dev) => dev.login.toLowerCase().includes(searchQuery.toLowerCase()))

  const sortedDevelopers = [...filteredDevelopers].sort((a, b) => {
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    const modifier = sortDirection === "asc" ? 1 : -1
    return (aVal - bVal) * modifier
  })

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return null
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  const formatReviewTime = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`
    if (hours < 24) return `${hours.toFixed(1)}h`
    return `${(hours / 24).toFixed(1)}d`
  }

  // Calculate team averages
  const avgCommits = developers.length > 0 ? developers.reduce((sum, d) => sum + d.commits, 0) / developers.length : 0
  const avgPRs = developers.length > 0 ? developers.reduce((sum, d) => sum + d.pullRequests, 0) / developers.length : 0
  const avgReviewTime =
    developers.filter((d) => d.avgReviewTime > 0).length > 0
      ? developers.filter((d) => d.avgReviewTime > 0).reduce((sum, d) => sum + d.avgReviewTime, 0) /
        developers.filter((d) => d.avgReviewTime > 0).length
      : 0

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-card-foreground">Team Performance</CardTitle>
            <span className="text-sm text-muted-foreground">({developers.length} developers)</span>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search developers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Team Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-secondary/50 rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-card-foreground">{avgCommits.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">Avg Commits/Dev</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-card-foreground">{avgPRs.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">Avg PRs/Dev</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-card-foreground">{formatReviewTime(avgReviewTime)}</p>
            <p className="text-xs text-muted-foreground">Avg Review Time</p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Developer</th>
                <th className="text-right py-3 px-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("commits")}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground gap-1"
                  >
                    <GitCommit className="h-4 w-4" />
                    Commits
                    <SortIcon column="commits" />
                  </Button>
                </th>
                <th className="text-right py-3 px-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("pullRequests")}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground gap-1"
                  >
                    <GitPullRequest className="h-4 w-4" />
                    PRs
                    <SortIcon column="pullRequests" />
                  </Button>
                </th>
                <th className="text-right py-3 px-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("mergedPRs")}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground gap-1"
                  >
                    Merged
                    <SortIcon column="mergedPRs" />
                  </Button>
                </th>
                <th className="text-right py-3 px-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("avgReviewTime")}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground gap-1"
                  >
                    <Clock className="h-4 w-4" />
                    Review Time
                    <SortIcon column="avgReviewTime" />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedDevelopers.map((dev, index) => (
                <tr
                  key={dev.login}
                  className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-6">{index + 1}</span>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={dev.avatar_url || "/placeholder.svg"} alt={dev.login} />
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                          {dev.login.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <a
                        href={`https://github.com/${dev.login}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-card-foreground hover:text-primary transition-colors"
                      >
                        {dev.login}
                      </a>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm text-card-foreground">{dev.commits}</span>
                      <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-chart-1 rounded-full"
                          style={{
                            width: `${Math.min((dev.commits / Math.max(...developers.map((d) => d.commits))) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-card-foreground">{dev.pullRequests}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-card-foreground">{dev.mergedPRs}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-card-foreground">
                      {dev.avgReviewTime > 0 ? formatReviewTime(dev.avgReviewTime) : "-"}
                    </span>
                  </td>
                </tr>
              ))}
              {sortedDevelopers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    {searchQuery ? "No developers found matching your search" : "No developer data available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
