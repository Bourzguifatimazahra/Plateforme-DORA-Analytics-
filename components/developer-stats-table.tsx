"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ChevronDown, ChevronUp, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useI18n } from "@/lib/i18n"
import type { DeveloperStats } from "@/lib/github"

interface DeveloperStatsTableProps {
  developers: DeveloperStats[]
  totalCommits: number
}

type SortKey = "commits" | "pullRequests" | "avgReviewTime" | "contributionPercent"

export function DeveloperStatsTable({ developers, totalCommits }: DeveloperStatsTableProps) {
  const { t } = useI18n()
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("commits")
  const [sortAsc, setSortAsc] = useState(false)
  const [expandedDev, setExpandedDev] = useState<string | null>(null)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortKey(key)
      setSortAsc(false)
    }
  }

  const filteredDevelopers = developers
    .filter((dev) => dev.login.toLowerCase().includes(search.toLowerCase()))
    .map((dev) => ({
      ...dev,
      contributionPercent: totalCommits > 0 ? (dev.commits / totalCommits) * 100 : 0,
    }))
    .sort((a, b) => {
      const aVal = a[sortKey] ?? 0
      const bVal = b[sortKey] ?? 0
      return sortAsc ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1
    })

  const SortIcon = ({ active, ascending }: { active: boolean; ascending: boolean }) => (
    <span className={`ml-1 inline-block transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}>
      {ascending ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
    </span>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg font-semibold text-card-foreground">{t("dashboard.team")}</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("dev.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-input border-border"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {/* Header */}
              <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-medium text-muted-foreground border-b border-border">
                <div className="col-span-3">Developer</div>
                <button
                  className="col-span-2 flex items-center cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort("commits")}
                >
                  {t("dev.commits")}
                  <SortIcon active={sortKey === "commits"} ascending={sortAsc} />
                </button>
                <button
                  className="col-span-2 flex items-center cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort("pullRequests")}
                >
                  PRs
                  <SortIcon active={sortKey === "pullRequests"} ascending={sortAsc} />
                </button>
                <button
                  className="col-span-2 flex items-center cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort("avgReviewTime")}
                >
                  {t("dev.avgReviewTime")}
                  <SortIcon active={sortKey === "avgReviewTime"} ascending={sortAsc} />
                </button>
                <button
                  className="col-span-3 flex items-center cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort("contributionPercent")}
                >
                  {t("dev.contribution")}
                  <SortIcon active={sortKey === "contributionPercent"} ascending={sortAsc} />
                </button>
              </div>

              {/* Rows */}
              <AnimatePresence>
                {filteredDevelopers.map((dev, index) => (
                  <motion.div
                    key={dev.login}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                  >
                    <div
                      className={`
                        rounded-lg border border-transparent hover:border-border/50 hover:bg-secondary/30 
                        transition-all cursor-pointer
                        ${expandedDev === dev.login ? "bg-secondary/30 border-border/50" : ""}
                      `}
                      onClick={() => setExpandedDev(expandedDev === dev.login ? null : dev.login)}
                    >
                      <div className="grid grid-cols-12 gap-2 px-4 py-3 items-center">
                        <div className="col-span-3 flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={dev.avatar_url || "/placeholder.svg"} alt={dev.login} />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-foreground truncate">{dev.login}</span>
                        </div>
                        <div className="col-span-2 text-sm text-foreground">{dev.commits}</div>
                        <div className="col-span-2 text-sm text-foreground">{dev.pullRequests}</div>
                        <div className="col-span-2 text-sm text-foreground">{dev.avgReviewTime.toFixed(1)}h</div>
                        <div className="col-span-3 flex items-center gap-2">
                          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${dev.contributionPercent}%` }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-12">
                            {dev.contributionPercent?.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {/* Expanded: Tasks Realized */}
                      <AnimatePresence>
                        {expandedDev === dev.login && dev.commitTitles && dev.commitTitles.length > 0 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4">
                              <p className="text-xs font-medium text-muted-foreground mb-2">
                                {t("dev.tasksRealized")} ({dev.commitTitles.length})
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {dev.commitTitles.slice(0, 10).map((title, i) => (
                                  <Badge
                                    key={i}
                                    variant="secondary"
                                    className="text-xs font-normal max-w-[200px] truncate"
                                  >
                                    {title}
                                  </Badge>
                                ))}
                                {dev.commitTitles.length > 10 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{dev.commitTitles.length - 10} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredDevelopers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No developers found</div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  )
}
