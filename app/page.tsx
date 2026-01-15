"use client"

import type React from "react"

import { useEffect } from "react"
import Link from "next/link"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import {
  Activity,
  Zap,
  Clock,
  AlertTriangle,
  Users,
  MessageSquare,
  FileText,
  GitBranch,
  ArrowRight,
  Sparkles,
  BarChart3,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { useI18n } from "@/lib/i18n"

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
  gradient,
}: {
  icon: React.ElementType
  title: string
  description: string
  delay?: number
  gradient: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group"
    >
      <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm h-full">
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${gradient}`}
        />
        <CardContent className="relative p-6">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className={`inline-flex p-3 rounded-xl mb-4 ${gradient}`}
          >
            <Icon className="h-6 w-6 text-white" />
          </motion.div>
          <h3 className="text-lg font-semibold text-card-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function FloatingOrb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-20 ${className}`}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  )
}

export default function WelcomePage() {
  const { t } = useI18n()

  const features = [
    {
      icon: Zap,
      title: "See how fast you really ship",
      description: "Track deployment frequency and lead time from real Git activity, not slide decks.",
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "Understand team delivery patterns",
      description: "Spot who is overloaded, who is blocked, and how work actually flows through your pipelines.",
      gradient: "bg-gradient-to-br from-emerald-500 to-teal-500",
    },
    {
      icon: MessageSquare,
      title: "Ask questions in plain language",
      description: "Get explanations for weird spikes, fragile releases, and long review queues in simple terms.",
      gradient: "bg-gradient-to-br from-violet-500 to-purple-500",
    },
    {
      icon: FileText,
      title: "Walk into reviews prepared",
      description: "Export a concise report that shows how delivery is going without 40 slides of fluff.",
      gradient: "bg-gradient-to-br from-orange-500 to-amber-500",
    },
    {
      icon: GitBranch,
      title: "Look across repositories",
      description: "Compare delivery across teams, services, or branches instead of arguing from anecdotes.",
      gradient: "bg-gradient-to-br from-pink-500 to-rose-500",
    },
    {
      icon: BarChart3,
      title: "Stay in the metrics, not the tool",
      description: "A focused view on delivery and reliability – no noisy widget zoo, no fake dashboards.",
      gradient: "bg-gradient-to-br from-indigo-500 to-blue-500",
    },
  ]

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <FloatingOrb className="w-96 h-96 bg-primary top-1/4 -left-48" />
          <FloatingOrb className="w-80 h-80 bg-accent top-1/3 right-0" delay={2} />
          <FloatingOrb className="w-64 h-64 bg-chart-5 bottom-1/4 left-1/3" delay={4} />
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 mb-6 justify-center"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">DORA metrics from your repos – not a consulting deck</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-4 leading-tight max-w-3xl mx-auto"
            >
              <span className="text-foreground">Understand your delivery.</span>
              <br />
              <span className="text-primary">Stop guessing in</span>{" "}
              <span className="text-accent">meetings.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-base md:text-lg text-muted-foreground mb-6 max-w-xl mx-auto"
            >
              Most teams measure delivery too late – or not at all. We turn your Git history into a clear picture of how
              work moves from commit to production, so you can argue less and fix the real bottlenecks.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 md:gap-4 items-center justify-center"
            >
              <Link href="/analyze">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all text-white px-8 py-5 text-base md:text-lg group"
                >
                  See DORA metrics on a repo
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:bg-secondary/50 px-8 py-5 text-base md:text-lg bg-transparent"
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              >
                Why these metrics matter
              </Button>
              <Link href="/dashboard?demo=1">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border hover:bg-secondary/50 px-8 py-5 text-base md:text-lg bg-transparent"
                >
                  Voir la démo
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {[
              { label: "Deployments / week", value: "12", icon: Zap },
              { label: "Median lead time", value: "2.4d", icon: Clock },
              { label: "Change failure rate", value: "18%", icon: AlertTriangle },
              { label: "Median MTTR", value: "3.1h", icon: TrendingUp },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="glass rounded-xl p-4 text-center"
              >
                <stat.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                  <span className="block mt-1 text-[10px] opacity-70">Sample metrics from demo</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
          >
            <motion.div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What you actually get</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Not another generic dashboard. A focused view on the four DORA metrics and the behavior behind them.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
                gradient={feature.gradient}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About DORA Section */}
      <section id="about" className="py-24 relative bg-secondary/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">Why DORA metrics matter</h2>
                  <p className="text-muted-foreground mb-4">
                    Teams with healthy DORA metrics ship faster and break less. Teams without them spend meetings
                    debating feelings instead of looking at data.
                  </p>
                  <p className="text-muted-foreground mb-6">
                    Dora turns your Git and CI data into those four signals – deployment frequency, lead time,
                    change failure rate, and recovery time – so you can see where delivery is stuck and what is improving.
                  </p>
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-foreground mb-2">Built for</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• DevOps and platform engineers who own the pipelines</li>
                      <li>• Engineering managers who need an honest view of delivery</li>
                      <li>• Tech leads who want to de-risk deployments without slowing teams down</li>
                    </ul>
                  </div>
                  <Link href="/analyze">
                    <Button className="bg-gradient-to-r from-primary to-accent text-white">
                      Try it on a public GitHub repo <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: "Deployment Frequency", desc: "How often you deploy", rating: "Elite: On-demand" },
                    { name: "Lead Time", desc: "Commit to production", rating: "Elite: < 1 hour" },
                    { name: "Change Failure Rate", desc: "Failed deployments %", rating: "Elite: < 15%" },
                    { name: "MTTR", desc: "Time to recover", rating: "Elite: < 1 hour" },
                  ].map((metric, index) => (
                    <motion.div
                      key={metric.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="p-4 rounded-xl bg-card border border-border"
                    >
                      <h4 className="font-semibold text-card-foreground text-sm mb-1">{metric.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{metric.desc}</p>
                      <span className="text-xs text-accent font-medium">{metric.rating}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.08),_transparent_60%)]">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mb-8"
              >
                <Activity className="h-12 w-12 text-primary" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Ready to optimize your DevOps?</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Start analyzing your repositories today and get actionable insights powered by AI.
              </p>
              <Link href="/analyze">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white px-12 py-6 text-lg"
                >
                  {t("nav.analyze")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">DevMetrics Pro</span>
            </div>
            <p className="text-sm text-muted-foreground">Powered by GitHub API & AI</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
