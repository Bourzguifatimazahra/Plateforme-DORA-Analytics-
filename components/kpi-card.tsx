import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  unit?: string
  rating?: "elite" | "high" | "medium" | "low"
  icon: LucideIcon
  description?: string
}

const ratingColors: Record<string, string> = {
  elite: "text-accent",
  high: "text-chart-1",
  medium: "text-chart-3",
  low: "text-chart-4",
}

const ratingBgColors: Record<string, string> = {
  elite: "bg-accent/10",
  high: "bg-chart-1/10",
  medium: "bg-chart-3/10",
  low: "bg-chart-4/10",
}

const ratingLabels: Record<string, string> = {
  elite: "Elite",
  high: "High",
  medium: "Medium",
  low: "Low",
}

export function KPICard({ title, value, unit, rating, icon: Icon, description }: KPICardProps) {
  const safeRating = rating && ratingLabels[rating] ? rating : "medium"

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("p-2 rounded-lg", ratingBgColors[safeRating])}>
              <Icon className={cn("h-5 w-5", ratingColors[safeRating])} />
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          </div>
          <span
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              ratingBgColors[safeRating],
              ratingColors[safeRating],
            )}
          >
            {ratingLabels[safeRating]}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-card-foreground">{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}
