"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Loader2, Github, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { useI18n } from "@/lib/i18n"
import { LoadingOverlay } from "@/components/loading-overlay"

type Platform = "github" | "gitlab" | "azure"

const platforms: { id: Platform; name: string; icon: React.ReactNode; color: string; available: boolean }[] = [
  {
    id: "github",
    name: "GitHub",
    icon: <Github className="h-8 w-8" />,
    color: "from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white",
    available: true,
  },
  {
    id: "gitlab",
    name: "GitLab",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z" />
      </svg>
    ),
    color: "from-orange-500 to-orange-600",
    available: true,
  },
  {
    id: "azure",
    name: "Azure DevOps",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 8.877L2.247 5.91l8.405-3.416V.022l7.37 5.393L2.966 8.338v8.225L0 15.707zm24-4.45v14.651l-5.753 4.9-9.303-3.057v3.056l-5.978-7.416 15.057 1.798V5.415z" />
      </svg>
    ),
    color: "from-blue-500 to-blue-600",
    available: true,
  },
]

export default function AnalyzePage() {
  const { t } = useI18n()
  const router = useRouter()
  const [projectName, setProjectName] = useState("")
  const [repoUrl, setRepoUrl] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("github")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState("")

  const parseRepoUrl = (url: string, platform: Platform): string | null => {
    if (platform === "github") {
      const patterns = [/(?:https?:\/\/)?github\.com\/([^/]+)\/([^/]+)\/?/, /^([^/]+)\/([^/]+)$/]
      for (const pattern of patterns) {
        const match = url.trim().match(pattern)
        if (match) {
          return `${match[1]}/${match[2].replace(/\.git$/, "")}`
        }
      }
    } else if (platform === "gitlab") {
      const patterns = [
        /(?:https?:\/\/)?(?:www\.)?gitlab\.com\/([^/]+(?:\/[^/]+)*)\/?/,
        /^([^/]+(?:\/[^/]+)*)$/,
      ]
      for (const pattern of patterns) {
        const match = url.trim().match(pattern)
        if (match) {
          return match[1].replace(/\.git$/, "")
        }
      }
    } else if (platform === "azure") {
      // Azure format: https://dev.azure.com/{organization}/{project}/_git/{repository}
      const azurePattern = /(?:https?:\/\/)?dev\.azure\.com\/([^/]+)\/([^/]+)\/_git\/([^/]+)\/?/
      const match = url.trim().match(azurePattern)
      if (match) {
        return `${match[1]}/${match[2]}/${match[3]}`
      }
      // Also support: org/project/repo format
      const simplePattern = /^([^/]+)\/([^/]+)\/([^/]+)$/
      const simpleMatch = url.trim().match(simplePattern)
      if (simpleMatch) {
        return url.trim()
      }
    }
    return null
  }

  const handleAnalyze = async () => {
    setError(null)

    if (!projectName.trim()) {
      setError(t("analyze.projectName") + " is required")
      return
    }

    if (!repoUrl.trim()) {
      setError(t("analyze.repoUrl") + " is required")
      return
    }

    const parsed = parseRepoUrl(repoUrl, selectedPlatform)
    if (!parsed) {
      let errorMsg = "Please enter a valid repository URL"
      if (selectedPlatform === "github") {
        errorMsg = "Please enter a valid GitHub repository URL (e.g., owner/repo or https://github.com/owner/repo)"
      } else if (selectedPlatform === "gitlab") {
        errorMsg = "Please enter a valid GitLab repository URL (e.g., owner/repo or https://gitlab.com/owner/repo)"
      } else if (selectedPlatform === "azure") {
        errorMsg = "Please enter a valid Azure DevOps repository URL (e.g., org/project/repo or https://dev.azure.com/org/project/_git/repo)"
      }
      setError(errorMsg)
      return
    }

    setIsLoading(true)
    const params = new URLSearchParams({
      repos: parsed,
      project: projectName,
      platform: selectedPlatform,
    })
    if (token.trim()) {
      params.set("token", token.trim())
    }
    router.push(`/dashboard?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AnimatePresence>
        {isLoading && <LoadingOverlay message="Analyzing your repository and generating insights..." />}
      </AnimatePresence>

      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 group">
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            {t("nav.home")}
          </Link>

          {/* Main Card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="text-center pb-2">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mx-auto mb-4 p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20"
              >
                <Github className="h-10 w-10 text-primary" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-card-foreground">{t("analyze.title")}</CardTitle>
              <CardDescription className="text-muted-foreground">{t("analyze.subtitle")}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-4">
              {/* Project Name */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="projectName" className="text-foreground">
                  {t("analyze.projectName")}
                </Label>
                <Input
                  id="projectName"
                  placeholder={t("analyze.projectPlaceholder")}
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="bg-input border-border"
                />
              </motion.div>

              {/* Platform Selection */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
              >
                <Label className="text-foreground">{t("analyze.platform")}</Label>
                <div className="grid grid-cols-3 gap-3">
                  {platforms.map((platform) => (
                    <motion.button
                      key={platform.id}
                      whileHover={{ scale: platform.available ? 1.02 : 1 }}
                      whileTap={{ scale: platform.available ? 0.98 : 1 }}
                      onClick={() => platform.available && setSelectedPlatform(platform.id)}
                      disabled={!platform.available}
                      className={`
                        relative p-4 rounded-xl border-2 transition-all
                        ${
                          selectedPlatform === platform.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-border/80 bg-card"
                        }
                        ${!platform.available ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                      `}
                    >
                      {selectedPlatform === platform.id && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2">
                          <Check className="h-4 w-4 text-primary" />
                        </motion.div>
                      )}
                      <div className="flex flex-col items-center gap-2">
                        <div className={`text-foreground ${!platform.available ? "opacity-50" : ""}`}>
                          {platform.icon}
                        </div>
                        <span className="text-sm font-medium text-card-foreground">{platform.name}</span>
                        {!platform.available && <span className="text-xs text-muted-foreground">Coming Soon</span>}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Repository URL */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <Label htmlFor="repoUrl" className="text-foreground">
                  {t("analyze.repoUrl")}
                </Label>
                <Input
                  id="repoUrl"
                  placeholder={
                    selectedPlatform === "github"
                      ? "owner/repo or https://github.com/owner/repo"
                      : selectedPlatform === "gitlab"
                        ? "owner/repo or https://gitlab.com/owner/repo"
                        : "org/project/repo or https://dev.azure.com/org/project/_git/repo"
                  }
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="bg-input border-border"
                />
              </motion.div>

              {/* Token (optional for private repos) */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 }}
                className="space-y-2"
              >
                <Label htmlFor="token" className="text-foreground">
                  Access Token (Optional - for private repositories)
                </Label>
                <Input
                  id="token"
                  type="password"
                  placeholder={
                    selectedPlatform === "github"
                      ? "GitHub Personal Access Token"
                      : selectedPlatform === "gitlab"
                        ? "GitLab Personal Access Token"
                        : "Azure DevOps Personal Access Token"
                  }
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="bg-input border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Required for private repositories. Leave empty for public repos.
                  {selectedPlatform === "github" && (
                    <span> Create a token at: <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-primary underline">GitHub Settings</a></span>
                  )}
                  {selectedPlatform === "gitlab" && (
                    <span> Create a token at: <a href="https://gitlab.com/-/user_settings/personal_access_tokens" target="_blank" rel="noopener noreferrer" className="text-primary underline">GitLab Settings</a></span>
                  )}
                  {selectedPlatform === "azure" && (
                    <span> Create a token at: <a href="https://dev.azure.com/_usersSettings/tokens" target="_blank" rel="noopener noreferrer" className="text-primary underline">Azure DevOps</a></span>
                  )}
                </p>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-destructive"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <Button
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white py-6 text-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      {t("analyze.analyzing")}
                    </>
                  ) : (
                    <>
                      {t("analyze.startAnalysis")}
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>

            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
