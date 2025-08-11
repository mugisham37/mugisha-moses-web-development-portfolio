import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "7d";

    // Calculate date range
    const now = new Date();
    let startDate = new Date();

    switch (range) {
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
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Mock analytics data - in a real app, this would come from your analytics service
    const analyticsData = {
      overview: {
        totalViews: Math.floor(Math.random() * 10000) + 5000,
        uniqueVisitors: Math.floor(Math.random() * 5000) + 2000,
        avgSessionDuration: Math.floor(Math.random() * 300) + 120,
        bounceRate: Math.floor(Math.random() * 30) + 20,
        conversionRate: Math.floor(Math.random() * 10) + 2,
      },
      trends: {
        viewsChange: Math.floor(Math.random() * 40) - 20,
        visitorsChange: Math.floor(Math.random() * 30) - 15,
        durationChange: Math.floor(Math.random() * 20) - 10,
        bounceChange: Math.floor(Math.random() * 15) - 7,
      },
      topPages: [
        { path: "/", views: 2500, uniqueViews: 1800, avgDuration: 180 },
        { path: "/projects", views: 1200, uniqueViews: 900, avgDuration: 240 },
        { path: "/blog", views: 800, uniqueViews: 600, avgDuration: 300 },
        { path: "/about", views: 600, uniqueViews: 450, avgDuration: 150 },
        { path: "/contact", views: 400, uniqueViews: 320, avgDuration: 120 },
      ],
      topProjects: [
        {
          id: "1",
          title: "E-commerce Platform",
          views: 450,
          likes: 23,
          conversionRate: 8.5,
        },
        {
          id: "2",
          title: "Task Management App",
          views: 380,
          likes: 19,
          conversionRate: 6.2,
        },
        {
          id: "3",
          title: "Portfolio Website",
          views: 320,
          likes: 15,
          conversionRate: 4.8,
        },
        {
          id: "4",
          title: "Mobile Game",
          views: 280,
          likes: 12,
          conversionRate: 3.9,
        },
        {
          id: "5",
          title: "API Service",
          views: 220,
          likes: 8,
          conversionRate: 2.1,
        },
      ],
      deviceStats: {
        desktop: 65,
        mobile: 28,
        tablet: 7,
      },
      trafficSources: [
        { source: "Direct", visitors: 1200, percentage: 45 },
        { source: "Google", visitors: 800, percentage: 30 },
        { source: "GitHub", visitors: 400, percentage: 15 },
        { source: "LinkedIn", visitors: 200, percentage: 7 },
        { source: "Twitter", visitors: 80, percentage: 3 },
      ],
      geographicData: [
        { country: "United States", visitors: 1500, percentage: 35 },
        { country: "United Kingdom", visitors: 800, percentage: 18 },
        { country: "Germany", visitors: 600, percentage: 14 },
        { country: "Canada", visitors: 400, percentage: 9 },
        { country: "Australia", visitors: 300, percentage: 7 },
        { country: "Others", visitors: 700, percentage: 17 },
      ],
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
