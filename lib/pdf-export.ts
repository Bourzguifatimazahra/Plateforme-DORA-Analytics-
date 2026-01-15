"use client"

import type { RepoAnalysis } from "./github"

// Single-page professional DORA PDF report (A4 portrait)
export async function generatePDFReport(analysis: RepoAnalysis, projectName: string): Promise<void> {
  const { jsPDF } = await import("jspdf")

  const doc = new jsPDF("p", "mm", "a4")
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  const colors = {
    cream: [246, 241, 231] as const,
    headerDark: [23, 37, 84] as const,
    headerBlue: [37, 99, 235] as const,
    text: [33, 37, 41] as const,
    textMuted: [102, 112, 133] as const,
    sectionTitle: [23, 37, 84] as const,
    cardBg: [255, 255, 255] as const,
    cardBorder: [229, 231, 235] as const,
    track: [229, 231, 235] as const,
    barGreen: [16, 185, 129] as const,
    barBlue: [59, 130, 246] as const,
    badgeElite: [16, 185, 129] as const,
    badgeHigh: [59, 130, 246] as const,
    badgeMedium: [245, 158, 11] as const,
    badgeLow: [239, 68, 68] as const,
  }

  const fonts = {
    h1: 20,
    h2: 12,
    body: 9,
    small: 8,
  }

  const marginX = 12
  const setTextColor = (c: readonly number[]) => doc.setTextColor(c[0], c[1], c[2])

  const sectionTitle = (title: string, top: number) => {
    setTextColor(colors.sectionTitle)
    doc.setFontSize(fonts.h2)
    doc.setFont("helvetica", "bold")
    doc.text(title, marginX, top)
  }

  const drawCard = (top: number, height: number) => {
    doc.setFillColor(...colors.cardBg)
    doc.setDrawColor(...colors.cardBorder)
    doc.setLineWidth(0.3)
    doc.roundedRect(marginX, top, pageWidth - marginX * 2, height, 3, 3, "FD")
  }

  const drawMetricBar = (x: number, yBar: number, width: number, rating: "elite" | "high" | "medium" | "low") => {
    const trackHeight = 4
    doc.setFillColor(...colors.track)
    doc.roundedRect(x, yBar, width, trackHeight, 2, 2, "F")

    let ratio = 0.4
    let color = colors.barBlue
    if (rating === "elite") {
      ratio = 0.95
      color = colors.barGreen
    } else if (rating === "high") {
      ratio = 0.8
    } else if (rating === "medium") {
      ratio = 0.6
    }

    const filledWidth = width * ratio
    doc.setFillColor(...color)
    doc.roundedRect(x, yBar, filledWidth, trackHeight, 2, 2, "F")
  }

  const drawBadge = (text: string, x: number, yBadge: number, rating: "elite" | "high" | "medium" | "low") => {
    const paddingX = 3
    const paddingY = 1.8
    const fontSize = fonts.small
    
    // Select badge color based on rating
    let color = colors.badgeHigh
    if (rating === "elite") color = colors.badgeElite
    else if (rating === "medium") color = colors.badgeMedium
    else if (rating === "low") color = colors.badgeLow

    doc.setFontSize(fontSize)
    doc.setFont("helvetica", "bold")

    const textWidth = doc.getTextWidth(text)
    const w = Math.min(textWidth + paddingX * 2, 15) // Fixed max width to prevent overflow
    const h = fontSize / 2 + paddingY * 2

    // Ensure badge doesn't overflow card boundaries
    const cardRightEdge = pageWidth - marginX - 2
    const badgeRightEdge = x + w
    if (badgeRightEdge > cardRightEdge) {
      x = cardRightEdge - w - 1
    }

    doc.setFillColor(...color)
    doc.roundedRect(x, yBadge - h + 1, w, h, 2, 2, "F")
    doc.setTextColor(255, 255, 255)
    doc.text(text, x + paddingX, yBadge)
  }

  // Background
  doc.setFillColor(...colors.cream)
  doc.rect(0, 0, pageWidth, pageHeight, "F")

  // Header
  doc.setFillColor(...colors.headerDark)
  doc.rect(0, 0, pageWidth, 28, "F")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(fonts.h1)
  doc.setTextColor(255, 255, 255)
  doc.text("DORA Metrics Report", marginX, 16)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(fonts.body)
  doc.setTextColor(226, 232, 240)
  doc.text(projectName, marginX, 22)

  const iconX = pageWidth - marginX - 10
  const iconY = 14
  doc.setDrawColor(...colors.headerBlue)
  doc.setLineWidth(0.6)
  doc.circle(iconX, iconY, 7, "S")
  doc.line(iconX - 2, iconY + 2, iconX + 2, iconY - 2)
  doc.line(iconX, iconY - 3, iconX + 2, iconY - 2)

  // Project Information
  let y = 34
  sectionTitle("Project Information", y)
  y += 4
  const projectCardTop = y + 2
  const projectCardHeight = 26
  drawCard(projectCardTop, projectCardHeight)

  const innerX = marginX + 6
  let innerY = projectCardTop + 8

  doc.setFontSize(fonts.body)
  doc.setFont("helvetica", "bold")
  setTextColor(colors.text)
  doc.text("Repository:", innerX, innerY)
  doc.setFont("helvetica", "normal")
  doc.text(analysis.repo, innerX + 28, innerY)

  innerY += 6
  doc.setFont("helvetica", "bold")
  doc.text("Analysis Period:", innerX, innerY)
  doc.setFont("helvetica", "normal")
  const startDate = new Date(analysis.analyzedPeriod.start).toLocaleDateString()
  const endDate = new Date(analysis.analyzedPeriod.end).toLocaleDateString()
  doc.text(`${startDate} – ${endDate}`, innerX + 32, innerY)

  innerY += 6
  doc.setFont("helvetica", "bold")
  doc.text("Summary:", innerX, innerY)
  doc.setFont("helvetica", "normal")
  setTextColor(colors.textMuted)
  doc.text(
    `Commits ${analysis.totalCommits.toLocaleString()}, PRs ${analysis.totalPRs.toLocaleString()}, Merged ${analysis.mergedPRs.toLocaleString()}`,
    innerX + 22,
    innerY
  )

  // DORA Metrics
  y = projectCardTop + projectCardHeight + 10
  sectionTitle("DORA Metrics", y)
  y += 4
  const doraCardTop = y + 2
  const doraCardHeight = 42
  drawCard(doraCardTop, doraCardHeight)

  const metrics = analysis.metrics
  const rows = [
    {
      label: "Deployment Frequency",
      value: `${metrics.deploymentFrequency.value.toFixed(1)} ${metrics.deploymentFrequency.unit}`,
      rating: metrics.deploymentFrequency.rating,
    },
    {
      label: "Lead Time for Changes",
      value: `${metrics.leadTime.value.toFixed(1)} ${metrics.leadTime.unit}`,
      rating: metrics.leadTime.rating,
    },
    {
      label: "Change Failure Rate",
      value: `${metrics.changeFailureRate.value.toFixed(1)}%`,
      rating: metrics.changeFailureRate.rating,
    },
    {
      label: "Mean Time to Restore",
      value: `${metrics.mttr.value.toFixed(2)} ${metrics.mttr.unit}`,
      rating: metrics.mttr.rating,
    },
  ] as const

  // Fixed column layout for PDF compatibility (no flexbox, gap, or auto widths)
  // Column widths: Label (48mm) | Bar (60mm) | Value (20mm) | Badge (15mm)
  // Total: ~171mm, fits within A4 card width (186mm) with margins
  const innerPadding = 6
  const colLabelStart = marginX + innerPadding
  const colLabelWidth = 48
  const colBarStart = colLabelStart + colLabelWidth + 4
  const colBarWidth = 60
  const colValueStart = colBarStart + colBarWidth + 4
  const colValueWidth = 20
  const colBadgeStart = colValueStart + colValueWidth + 2
  const colBadgeWidth = 15
  
  let rowY = doraCardTop + 9

  rows.forEach((row) => {
    setTextColor(colors.text)
    doc.setFontSize(fonts.body)
    doc.setFont("helvetica", "normal")
    
    // Label - fixed position, truncate if too long
    const labelText = row.label.length > 25 ? row.label.substring(0, 22) + "..." : row.label
    doc.text(labelText, colLabelStart, rowY)

    // Progress bar - fixed width
    drawMetricBar(colBarStart, rowY - 3, colBarWidth, row.rating)

    // Value - fixed position
    doc.text(row.value, colValueStart, rowY)

    // Badge - fixed position
    const badgeText = row.rating.toUpperCase()
    drawBadge(badgeText, colBadgeStart, rowY, row.rating)

    rowY += 9
  })

  // Team Performance
  y = doraCardTop + doraCardHeight + 10
  sectionTitle("Team Performance", y)
  y += 4
  const teamCardTop = y + 2
  const teamCardHeight = pageHeight - teamCardTop - 18
  drawCard(teamCardTop, teamCardHeight)

  const tableLeft = marginX + 4
  const colDeveloper = tableLeft
  const colCommits = tableLeft + 55
  const colPRs = colCommits + 30
  const colContrib = colPRs + 28

  let tableY = teamCardTop + 8
  // Header background with better contrast - darker gray for visibility
  // Increased header height from 7mm to 9mm for better text visibility
  const headerHeight = 9
  const headerTop = tableY - 6
  doc.setFillColor(229, 231, 235)
  doc.roundedRect(tableLeft - 2, headerTop, pageWidth - marginX * 2 - 4, headerHeight, 2, 2, "F")

  // Use dark text color for better contrast against light gray background
  // Center text vertically in the header
  setTextColor(colors.sectionTitle)
  doc.setFontSize(fonts.small)
  doc.setFont("helvetica", "bold")
  // Vertical centering: headerTop + half header height + small offset for baseline alignment
  const headerTextY = headerTop + headerHeight / 2 + 1.5
  doc.text("Developer", colDeveloper, headerTextY)
  doc.text("Commits", colCommits, headerTextY)
  doc.text("PRs", colPRs, headerTextY)
  doc.text("Contributions", colContrib, headerTextY)

  const developers = analysis.developers.slice(0, 5)
  const totalCommits = developers.reduce((sum, d) => sum + d.commits, 0) || 1
  const maxPRs = Math.max(...developers.map((d) => d.pullRequests || 1))

  // Adjust spacing after header to account for increased header height
  tableY = headerTop + headerHeight + 4

  developers.forEach((dev, index) => {
    const rowHeight = 7
    const rowTop = tableY + index * rowHeight

    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251)
      doc.rect(tableLeft - 2, rowTop - 4, pageWidth - marginX * 2 - 4, rowHeight, "F")
    }

    setTextColor(colors.text)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(fonts.small)

    doc.text(dev.login.substring(0, 18), colDeveloper, rowTop)

    const commitRatio = dev.commits / totalCommits
    doc.text(dev.commits.toString(), colCommits, rowTop)
    doc.setFillColor(...colors.barBlue)
    doc.rect(colCommits + 10, rowTop - 3, 18 * commitRatio, 2, "F")

    const prsRatio = dev.pullRequests / maxPRs
    doc.text(dev.pullRequests.toString(), colPRs, rowTop)
    doc.setFillColor(...colors.barGreen)
    doc.rect(colPRs + 8, rowTop - 3, 16 * prsRatio, 2, "F")

    const contribPercent = ((dev.commits / totalCommits) * 100).toFixed(1)
    doc.text(`${contribPercent}%`, colContrib, rowTop)
  })

  // Footer
  const footerY = pageHeight - 8
  setTextColor(colors.textMuted)
  doc.setFontSize(fonts.small)
  doc.setFont("helvetica", "normal")
  const dateStr = new Date().toLocaleDateString()
  doc.text(`Generated on ${dateStr}`, marginX, footerY)
  const pageLabel = "Page 1"
  const labelWidth = doc.getTextWidth(pageLabel)
  doc.text(pageLabel, pageWidth - marginX - labelWidth, footerY)

  doc.save(`${projectName.replace(/\s+/g, "-")}-dora-report.pdf`)
}
