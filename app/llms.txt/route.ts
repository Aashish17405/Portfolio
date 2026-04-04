import { allProjects, portfolioProfile } from "@/lib/portfolio-data";
import { getSiteUrl } from "@/lib/site-config";

export const revalidate = 3600;

export async function GET() {
  const siteUrl = getSiteUrl();

  const lines = [
    "# Aashish Jaini - Portfolio",
    "",
    "## Person",
    `Name: ${portfolioProfile.name}`,
    `Headline: ${portfolioProfile.headline}`,
    `Summary: ${portfolioProfile.summary}`,
    `Location: ${portfolioProfile.location}`,
    `Email: ${portfolioProfile.email}`,
    `Phone: ${portfolioProfile.phone}`,
    `GitHub: ${portfolioProfile.socialLinks.github}`,
    `LinkedIn: ${portfolioProfile.socialLinks.linkedin}`,
    `LeetCode: ${portfolioProfile.socialLinks.leetcode}`,
    "",
    "## Pages",
    `Home: ${siteUrl}/`,
    `Projects: ${siteUrl}/projects`,
    `Machine-readable profile JSON: ${siteUrl}/api/profile`,
    "",
    "## Skills",
    `Programming Languages: ${portfolioProfile.skills.programmingLanguages.join(", ")}`,
    `Frontend: ${portfolioProfile.skills.frontend.join(", ")}`,
    `Backend: ${portfolioProfile.skills.backend.join(", ")}`,
    `Tools and Technologies: ${portfolioProfile.skills.toolsAndTechnologies.join(", ")}`,
    "",
    "## Work Experience",
    ...portfolioProfile.workExperience.flatMap((work, index) => [
      `${index + 1}. ${work.title} at ${work.company} (${work.period})`,
      `   ${work.description}`,
      work.link ? `   Link: ${work.link}` : "",
    ]),
    "",
    "## Projects",
    ...allProjects.flatMap((project, index) => [
      `${index + 1}. ${project.title}`,
      `   Short Name: ${project.projectHeading}`,
      `   Description: ${project.description}`,
      `   Tech Stack: ${Object.keys(project.techstack).join(", ")}`,
      `   Features: ${project.features.join(" | ")}`,
      project.projectUrl ? `   Live/Project URL: ${project.projectUrl}` : "",
      `   GitHub URL: ${project.githubUrl}`,
    ]),
  ].filter(Boolean);

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
