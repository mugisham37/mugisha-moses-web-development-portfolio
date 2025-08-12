import { db } from "./db";

export interface AnalyticsDateRange {
  startDate: Date;
  endDate: Date;
}

export function getDateRange(range: string): AnalyticsDateRange {
  const now = new Date();
  const startDate = new Date();

  switch (range) {
    case "1h":
      startDate.setHours(now.getHours() - 1);
      break;
    case "24h":
      startDate.setHours(now.getHours() - 24);
      break;
    case "7d":
      startDate.setDate(now.getDate() - 7);
      break;
    case "30d":
      startDate.setDate(now.getDate() - 30);
      break;
    case "90d":
      startDate.setDate(now.getDate() - 90);
      break;
    case "1y":
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate.setDate(now.getDate() - 7);
  }

  return { startDate, endDate: now };
}

export async function getPageViewStats(dateRange: AnalyticsDateRange) {
  const [totalViews, uniqueVisitors, topPages] = await Promise.all([
    // Total page views
    db.pageView.count({
      where: {
        createdAt: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
      },
    }),

    // Unique visitors (unique session IDs)
    db.pageView
      .groupBy({
        by: ["sessionId"],
        where: {
          createdAt: {
            gte: dateRange.startDate,
            lte: dateRange.endDate,
          },
        },
        _count: {
          sessionId: true,
        },
      })
      .then((result: Array<{ sessionId: string; _count: { sessionId: number } }>) => result.length),

    // Top pages
    db.pageView.groupBy({
      by: ["path"],
      where: {
        createdAt: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
      },
      _count: {
        path: true,
      },
      _avg: {
        timeOnPage: true,
        scrollDepth: true,
      },
      orderBy: {
        _count: {
          path: "desc",
        },
      },
      take: 10,
    }),
  ]);

  return {
    totalViews,
    uniqueVisitors,
    topPages: topPages.map((page: {
      path: string;
      _count: { path: number };
      _avg: { timeOnPage: number | null; scrollDepth: number | null };
    }) => ({
      path: page.path,
      views: page._count.path,
      avgTimeOnPage: Math.round(page._avg.timeOnPage || 0),
      avgScrollDepth: Math.round(page._avg.scrollDepth || 0),
    })),
  };
}

export async function getSessionStats(dateRange: AnalyticsDateRange) {
  const sessions = await db.userSession.findMany({
    where: {
      startTime: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
    },
    select: {
      duration: true,
      pageViews: true,
      hasConverted: true,
      device: true,
      browser: true,
      os: true,
      country: true,
    },
  });

  const totalSessions = sessions.length;
  const avgDuration =
    sessions
      .filter((s: { duration: number | null }) => s.duration !== null)
      .reduce((sum: number, s: { duration: number | null }) => sum + (s.duration || 0), 0) / totalSessions;

  const bounceRate =
    (sessions.filter((s: { pageViews: number }) => s.pageViews <= 1).length / totalSessions) * 100;
  const conversionRate =
    (sessions.filter((s: { hasConverted: boolean }) => s.hasConverted).length / totalSessions) * 100;

  // Device breakdown
  const deviceStats = sessions.reduce(
    (acc: Record<string, number>, session: { device: string | null }) => {
      const device = session.device || "unknown";
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Browser breakdown
  const browserStats = sessions.reduce(
    (acc: Record<string, number>, session: { browser: string | null }) => {
      const browser = session.browser || "unknown";
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Geographic breakdown
  const geoStats = sessions.reduce(
    (acc: Record<string, number>, session: { country: string | null }) => {
      const country = session.country || "unknown";
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    totalSessions,
    avgDuration: Math.round(avgDuration),
    bounceRate: Math.round(bounceRate),
    conversionRate: Math.round(conversionRate * 100) / 100,
    deviceStats,
    browserStats,
    geoStats,
  };
}

export async function getConversionStats(dateRange: AnalyticsDateRange) {
  const conversions = await db.conversionEvent.findMany({
    where: {
      createdAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
    },
    select: {
      type: true,
      value: true,
      page: true,
      createdAt: true,
    },
  });

  // Group by conversion type
  const conversionsByType = conversions.reduce(
    (acc: Record<string, { count: number; totalValue: number; pages: Record<string, number> }>, 
     conversion: { type: string; value: number | null; page: string }) => {
      const type = conversion.type;
      if (!acc[type]) {
        acc[type] = {
          count: 0,
          totalValue: 0,
          pages: {} as Record<string, number>,
        };
      }
      acc[type].count++;
      acc[type].totalValue += conversion.value || 0;
      acc[type].pages[conversion.page] =
        (acc[type].pages[conversion.page] || 0) + 1;
      return acc;
    },
    {} as Record<
      string,
      { count: number; totalValue: number; pages: Record<string, number> }
    >
  );

  // Conversion funnel
  const funnelSteps = [
    "page_view",
    "project_view",
    "contact_form_view",
    "contact_form_submission",
  ];

  const funnelData = await Promise.all(
    funnelSteps.map(async (step) => {
      const count = await db.conversionEvent.count({
        where: {
          type: step,
          createdAt: {
            gte: dateRange.startDate,
            lte: dateRange.endDate,
          },
        },
      });
      return { step, count };
    })
  );

  return {
    totalConversions: conversions.length,
    totalValue: conversions.reduce((sum: number, c: { value: number | null }) => sum + (c.value || 0), 0),
    conversionsByType,
    funnelData,
  };
}

export async function getPerformanceStats(dateRange: AnalyticsDateRange) {
  const metrics = await db.performanceMetric.findMany({
    where: {
      createdAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
    },
    select: {
      lcp: true,
      fid: true,
      cls: true,
      fcp: true,
      ttfb: true,
      page: true,
      connectionType: true,
    },
  });

  if (metrics.length === 0) {
    return {
      avgLCP: 0,
      avgFID: 0,
      avgCLS: 0,
      avgFCP: 0,
      avgTTFB: 0,
      pagePerformance: [],
      connectionBreakdown: {},
    };
  }

  const avgLCP =
    metrics.reduce((sum: number, m: { lcp: number | null }) => sum + (m.lcp || 0), 0) / metrics.length;
  const avgFID =
    metrics.reduce((sum: number, m: { fid: number | null }) => sum + (m.fid || 0), 0) / metrics.length;
  const avgCLS =
    metrics.reduce((sum: number, m: { cls: number | null }) => sum + (m.cls || 0), 0) / metrics.length;
  const avgFCP =
    metrics.reduce((sum: number, m: { fcp: number | null }) => sum + (m.fcp || 0), 0) / metrics.length;
  const avgTTFB =
    metrics.reduce((sum: number, m: { ttfb: number | null }) => sum + (m.ttfb || 0), 0) / metrics.length;

  // Performance by page
  const pagePerformance = Object.entries(
    metrics.reduce(
      (acc, metric) => {
        const page = metric.page;
        if (!acc[page]) {
          acc[page] = { lcp: [], fid: [], cls: [], fcp: [], ttfb: [] };
        }
        if (metric.lcp) acc[page].lcp.push(metric.lcp);
        if (metric.fid) acc[page].fid.push(metric.fid);
        if (metric.cls) acc[page].cls.push(metric.cls);
        if (metric.fcp) acc[page].fcp.push(metric.fcp);
        if (metric.ttfb) acc[page].ttfb.push(metric.ttfb);
        return acc;
      },
      {} as Record<
        string,
        {
          lcp: number[];
          fid: number[];
          cls: number[];
          fcp: number[];
          ttfb: number[];
        }
      >
    )
  ).map(([page, data]) => ({
    page,
    avgLCP: data.lcp.reduce((sum, val) => sum + val, 0) / data.lcp.length || 0,
    avgFID: data.fid.reduce((sum, val) => sum + val, 0) / data.fid.length || 0,
    avgCLS: data.cls.reduce((sum, val) => sum + val, 0) / data.cls.length || 0,
    avgFCP: data.fcp.reduce((sum, val) => sum + val, 0) / data.fcp.length || 0,
    avgTTFB:
      data.ttfb.reduce((sum, val) => sum + val, 0) / data.ttfb.length || 0,
  }));

  // Connection type breakdown
  const connectionBreakdown = metrics.reduce(
    (acc, metric) => {
      const type = metric.connectionType || "unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    avgLCP: Math.round(avgLCP),
    avgFID: Math.round(avgFID),
    avgCLS: Math.round(avgCLS * 1000) / 1000, // Keep 3 decimal places
    avgFCP: Math.round(avgFCP),
    avgTTFB: Math.round(avgTTFB),
    pagePerformance,
    connectionBreakdown,
  };
}

export async function getABTestStats() {
  const experiments = await db.aBTestExperiment.findMany({
    where: {
      isActive: true,
    },
    include: {
      assignments: {
        select: {
          variant: true,
          hasConverted: true,
        },
      },
    },
  });

  return experiments.map((experiment) => {
    const controlAssignments = experiment.assignments.filter(
      (a) => a.variant === "control"
    );
    const variantAssignments = experiment.assignments.filter(
      (a) => a.variant === "variant"
    );

    const controlConversions = controlAssignments.filter(
      (a) => a.hasConverted
    ).length;
    const variantConversions = variantAssignments.filter(
      (a) => a.hasConverted
    ).length;

    const controlRate =
      controlAssignments.length > 0
        ? controlConversions / controlAssignments.length
        : 0;
    const variantRate =
      variantAssignments.length > 0
        ? variantConversions / variantAssignments.length
        : 0;

    const improvement =
      controlRate > 0 ? ((variantRate - controlRate) / controlRate) * 100 : 0;

    return {
      id: experiment.id,
      name: experiment.name,
      controlRate: Math.round(controlRate * 10000) / 100,
      variantRate: Math.round(variantRate * 10000) / 100,
      improvement: Math.round(improvement * 100) / 100,
      isSignificant: experiment.isSignificant,
      winner: experiment.winner,
      pValue: experiment.pValue,
    };
  });
}

export function calculateTrend(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}
