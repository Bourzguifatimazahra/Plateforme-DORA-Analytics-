"use client"

import { motion } from "framer-motion"
import { Loader2, Activity, TrendingUp, Zap } from "lucide-react"

interface LoadingOverlayProps {
  message?: string
}

export function LoadingOverlay({ message = "Analyzing your repository..." }: LoadingOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/98 backdrop-blur-md"
    >
      <div className="relative w-full max-w-md px-6">
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            backgroundSize: "200% 200%",
          }}
        />

        {/* Main Content Card */}
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative bg-card/95 backdrop-blur-md border border-border/50 rounded-3xl p-8 shadow-2xl"
        >
          {/* Animated Icons */}
          <div className="flex justify-center items-center gap-4 mb-6">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20"
            >
              <Activity className="h-8 w-8 text-primary" />
            </motion.div>
            <motion.div
              animate={{
                rotate: [0, -360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 2.5, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 },
              }}
              className="p-3 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20"
            >
              <TrendingUp className="h-8 w-8 text-accent" />
            </motion.div>
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
              }}
              className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20"
            >
              <Zap className="h-8 w-8 text-primary" />
            </motion.div>
          </div>

          {/* Spinner */}
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="h-12 w-12 text-primary" />
            </motion.div>
          </div>

          {/* Message */}
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-semibold text-center text-foreground mb-2"
          >
            {message}
          </motion.h3>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-center text-muted-foreground"
          >
            This may take a few moments...
          </motion.p>

          {/* Progress Bar */}
          <div className="mt-6 h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-accent to-primary"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                backgroundSize: "200% 100%",
              }}
            />
          </div>

          {/* Animated Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-primary"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
