import { portfolioProfile } from "./portfolio-data";

export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface AutoReplyContent {
  subject: string;
  text: string;
  html: string;
}

const SYSTEM_PROMPT = `You are ghostwriting a direct, personal email reply from Aashish Jaini (Full-Stack & DevOps Engineer) to someone who contacted him through his website.

IMPORTANT CONTEXT:
Aashish will personally review, edit if desired, and send this email from his admin dashboard. This is his ACTUAL email reply to the sender - NOT an automated receipt, NOT a support ticket auto-responder.

Tone & Style Rules:
1. Simple, short, and clean: 2 to 4 sentences maximum in total. Keep it punchy, light, and easy to read.
2. Humane & Conversational: Sound like a genuine, friendly engineer/peer, not a corporate robot or customer service agent.
3. Networking vibe: Open, warm, and inviting. Match the sender's energy:
   - If they sent a casual compliment, salute, or greeting: reciprocate warmly with high energy, thank them genuinely, and invite them to connect on LinkedIn or ask what they're building.
   - If they are a recruiter or discussing a job: express genuine gratitude for thinking of him, and invite them to share the JD or brief role details.
   - If they have a project or collaboration: show enthusiasm for building things, and ask a light question about their vision or timeline.
4. STRICT FORBIDDEN PHRASES (Never use any of these):
   - NEVER say "I will get back to you within 24-48 hours" or any turnaround time.
   - NEVER say "I personally review all messages" or "your message was safely received".
   - NEVER say "Thank you for reaching out through my contact form".
   - NEVER sound like an automated ticketing or acknowledgment system.
5. GUARDRAILS:
   - Do NOT commit to specific rates, start dates, or contract terms.
   - Do NOT invent details not mentioned in their message.
6. PUNCTUATION & STYLE (CRITICAL):
   - NEVER use em dashes ("—") or en dashes ("–"). Always use a standard hyphen ("-") or simple commas/periods.
7. FORMAT:
   - Plain text only.
   - NO markdown formatting (no asterisks, bold markers, bullet points).
   - Paragraph breaks between greeting, body, and sign-off.
   - Sign off cleanly as:

Best regards,
Aashish Jaini`;

/**
 * Generates an empathetic fallback message in case the AI service is unavailable.
 */
function getFallbackReply(submission: ContactSubmission): { text: string; subject: string } {
  const firstName = submission.name.trim().split(/\s+/)[0] || "there";
  const lowerMsg = `${submission.subject} ${submission.message}`.toLowerCase();
  const subject = submission.subject.toLowerCase().startsWith("re:")
    ? submission.subject
    : `Re: ${submission.subject}`;

  let body = "";

  if (
    lowerMsg.includes("hire") ||
    lowerMsg.includes("job") ||
    lowerMsg.includes("role") ||
    lowerMsg.includes("interview") ||
    lowerMsg.includes("opportunity") ||
    lowerMsg.includes("recruiter")
  ) {
    body = `Thanks for reaching out! I appreciate you thinking of me for this opportunity.\n\nCould you share a bit more context or the job description? Happy to take a look and connect.`;
  } else if (
    lowerMsg.includes("project") ||
    lowerMsg.includes("freelance") ||
    lowerMsg.includes("build") ||
    lowerMsg.includes("client") ||
    lowerMsg.includes("app")
  ) {
    body = `Thanks for sharing the details about your project! It sounds interesting.\n\nCould you share a little more about the scope or timeline you have in mind? Let's connect soon.`;
  } else if (
    lowerMsg.includes("salute") ||
    lowerMsg.includes("achievement") ||
    lowerMsg.includes("congrat") ||
    lowerMsg.includes("kudos") ||
    lowerMsg.includes("great work") ||
    lowerMsg.includes("awesome")
  ) {
    body = `Thank you so much for the kind words and the shout-out! Really appreciate it.\n\nAlways happy to connect with fellow folks in tech - feel free to connect on LinkedIn or let me know what you're working on.`;
  } else {
    body = `Thanks for reaching out and connecting!\n\nAlways great meeting fellow builders and enthusiasts in tech. Feel free to connect on LinkedIn or let me know what you've been working on lately.`;
  }

  const text = `Hi ${firstName},

${body}

Best regards,
Aashish Jaini`;

  return { text, subject };
}

/**
 * Wraps plaintext email content in an elegant, modern, and human-styled HTML email template.
 */
export function buildHtmlEmail(content: string, submission: ContactSubmission): string {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const formattedParagraphs = paragraphs
    .map((p) => `<p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.65; color: #334155;">${p.replace(/\n/g, "<br/>")}</p>`)
    .join("\n");

  const linkedinUrl = portfolioProfile.socialLinks.linkedin;
  const githubUrl = portfolioProfile.socialLinks.github;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank you for reaching out</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); overflow: hidden;">
          
          <!-- Top Accent Border -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #3b82f6, #06b6d4);"></td>
          </tr>

          <!-- Email Content Body -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;">
              ${formattedParagraphs}
            </td>
          </tr>

          <!-- Footer & Social Links -->
          <tr>
            <td style="padding: 24px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #1e293b;">
                      Aashish Jaini
                    </p>
                    <p style="margin: 0 0 14px 0; font-size: 12px; color: #64748b;">
                      Full-Stack & DevOps Engineer &middot; Hyderabad, India
                    </p>
                    <div style="font-size: 12px; color: #3b82f6;">
                      <a href="${linkedinUrl}" style="color: #2563eb; text-decoration: none; margin-right: 14px; font-weight: 500;" target="_blank">LinkedIn</a>
                      <a href="${githubUrl}" style="color: #2563eb; text-decoration: none; margin-right: 14px; font-weight: 500;" target="_blank">GitHub</a>
                      <a href="https://aashishjaini.me/" style="color: #2563eb; text-decoration: none; font-weight: 500;" target="_blank">Portfolio</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 16px;">
                    <p style="margin: 0; font-size: 11px; color: #94a3b8; line-height: 1.4;">
                      Sent directly from Aashish Jaini &middot; Feel free to reply directly to continue the conversation.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Attempts to generate a contextual, humane reply using OpenAI's latest gpt-6-luna model.
 */
async function callOpenAiForReply(submission: ContactSubmission): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  // Default to gpt-6-luna as requested, configurable via env
  const preferredModel = process.env.OPENAI_CONTACT_MODEL || "gpt-6-luna";

  const userPrompt = `A visitor reached out to me through my website:
Visitor Name: ${submission.name}
Subject: ${submission.subject}
Message:
"""
${submission.message}
"""

Please draft a short, clean, human, and networking-friendly reply back to them adhering to the guidelines.`;

  // First try the preferred model (gpt-6-luna)
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: preferredModel,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.6,
        max_completion_tokens: 350,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content && typeof content === "string" && content.trim().length > 30) {
        return content.trim();
      }
    } else {
      console.warn(`[Auto-responder] ${preferredModel} returned status ${res.status}. Trying fallback model...`);
    }
  } catch (err) {
    console.warn(`[Auto-responder] Error calling ${preferredModel}:`, err);
  }

  // If gpt-6-luna wasn't accessible or errored, try gpt-4o-mini as an intelligent fallback
  if (preferredModel !== "gpt-4o-mini") {
    try {
      const fallbackRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.6,
          max_tokens: 350,
        }),
      });

      if (fallbackRes.ok) {
        const data = await fallbackRes.json();
        const content = data?.choices?.[0]?.message?.content;
        if (content && typeof content === "string" && content.trim().length > 30) {
          return content.trim();
        }
      }
    } catch (err) {
      console.warn("[Auto-responder] Fallback model error:", err);
    }
  }

  return null;
}

/**
 * Normalizes em dashes (—) and en dashes (–) to standard hyphens (-).
 */
function normalizeDashes(text: string): string {
  return text
    .replace(/[\u2014\u2013]/g, " - ")
    .replace(/[ ]{2,}/g, " ")
    .trim();
}

/**
 * Public method to generate the complete auto-reply package (subject, text, and html).
 */
export async function generateHumaneReply(submission: ContactSubmission): Promise<AutoReplyContent> {
  const fallback = getFallbackReply(submission);

  let textContent = await callOpenAiForReply(submission);
  if (!textContent) {
    textContent = fallback.text;
  }

  textContent = normalizeDashes(textContent);
  const subject = normalizeDashes(fallback.subject);
  const html = buildHtmlEmail(textContent, submission);

  return {
    subject,
    text: textContent,
    html,
  };
}
