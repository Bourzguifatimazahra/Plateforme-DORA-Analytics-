import { Card, CardContent } from "@/components/ui/card"
import { GitCommit, GitPullRequest, GitMerge, Calendar } from "lucide-react"

interface StatsOverviewProps {
  totalCommits: number
  totalPRs: number
  mergedPRs: number
  period: { start: string; end: string }
}

export function StatsOverview({ totalCommits, totalPRs, mergedPRs, period }: StatsOverviewProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Calendar className="h-4 w-4" />
          <span>
            {formatDate(period.start)} - {formatDate(period.end)}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-1/10">
              <GitCommit className="h-5 w-5 text-chart-1" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{totalCommits}</p>
              <p className="text-xs text-muted-foreground">Commits</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-2/10">
              <GitPullRequest className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{totalPRs}</p>
              <p className="text-xs text-muted-foreground">Pull Requests</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <GitMerge className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{mergedPRs}</p>
              <p className="text-xs text-muted-foreground">Merged PRs</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
