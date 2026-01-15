"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n"
import type { LucideIcon } from "lucide-react"

interface AnimatedKPICardProps {
  title: string
  value: number | string
  unit?: string
  rating: "elite" | "high" | "medium" | "low"
  icon: LucideIcon
  description?: string
  delay?: number
}

const ratingConfig = {
  elite: {
    bg: "from-emerald-500/20 to-emerald-600/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-400",
  },
  high: {
    bg: "from-blue-500/20 to-blue-600/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    badge: "bg-blue-500/20 text-blue-400",
  },
  medium: {
    bg: "from-amber-500/20 to-amber-600/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    badge: "bg-amber-500/20 text-amber-400",
  },
  low: {
    bg: "from-red-500/20 to-red-600/10",
    border: "border-red-500/30",
    text: "text-red-400",
    badge: "bg-red-500/20 text-red-400",
  },
}

export function AnimatedKPICard({
  title,
  value,
  unit,
  rating,
  icon: Icon,
  description,
  delay = 0,
}: AnimatedKPICardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const { t } = useI18n()
  const config = ratingConfig[rating] || ratingConfig.medium

  const ratingLabels = {
    elite: t("rating.elite"),
    high: t("rating.high"),
    medium: t("rating.medium"),
    low: t("rating.low"),
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.5, delay }}
      className="perspective-1000"
    >
      <motion.div
        className="relative w-full h-full cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <Card
          className={cn(
            "relative overflow-hidden border bg-gradient-to-br",
            config.bg,
            config.border,
            "backface-hidden",
          )}
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className={cn("p-2 rounded-lg", config.badge)}
              >
                <Icon className="h-5 w-5" />
              </motion.div>
              <span className={cn("text-xs font-medium px-2 py-1 rounded-full", config.badge)}>
                {ratingLabels[rating]}
              </span>
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground mt-2">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.3, type: "spring" }}
              className="flex items-baseline gap-1"
            >
              <span className={cn("text-3xl font-bold", config.text)}>{value}</span>
              {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
            </motion.div>
            <p className="text-xs text-muted-foreground mt-2">Click to see details</p>
          </CardContent>
        </Card>

        {/* Back */}
        <Card
          className={cn(
            "absolute inset-0 overflow-hidden border bg-gradient-to-br",
            config.bg,
            config.border,
            "backface-hidden",
          )}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <CardContent className="h-full flex flex-col justify-center p-4">
            <h4 className="font-semibold text-foreground mb-2">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
            <div className="mt-4">
              <span className={cn("text-xs font-medium px-2 py-1 rounded-full", config.badge)}>
                DORA Rating: {ratingLabels[rating]}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
