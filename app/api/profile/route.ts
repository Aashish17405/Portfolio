import { NextResponse } from "next/server";
import { allProjects, portfolioProfile } from "@/lib/portfolio-data";

export const revalidate = 3600;

export async function GET() {
  return NextResponse.json(
    {
      profile: portfolioProfile,
      projects: allProjects.map((project) => ({
        title: project.title,
        projectHeading: project.projectHeading,
        description: project.description,
        features: project.features,
        techstack: Object.keys(project.techstack),
        projectUrl: project.projectUrl,
        githubUrl: project.githubUrl,
      })),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
