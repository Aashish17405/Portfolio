import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/utils/prisma";
import nodemailer from "nodemailer";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { generateHumaneReply } from "@/lib/email-auto-responder";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

let ratelimit: Ratelimit | null = null;

function getRateLimiter() {
  if (ratelimit) return ratelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn("⚠️ Upstash Redis env vars missing. Contact rate limiting is disabled.");
    return null;
  }

  const redis = new Redis({ url, token });
  ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(
      Number(process.env.CONTACT_RATE_LIMIT_REQUESTS || 3),
      (process.env.CONTACT_RATE_LIMIT_DURATION || "1 h") as any
    ),
    analytics: true,
    prefix: "@upstash/ratelimit/contact",
  });

  return ratelimit;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const limiter = getRateLimiter();

    if (limiter) {
      const { success, limit, reset, remaining } = await limiter.limit(ip);

      if (!success) {
        return NextResponse.json(
          { error: "Too many contact form submissions. Please try again later." },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            },
          }
        );
      }
    }

    const body = await req.json();
    const parsedData = contactSchema.parse(body);
    const { name, email, subject, message } = parsedData;

    // Generate AI draft reply with gpt-6-luna (or fallback) for human approval
    let autoReply: { subject: string; text: string; html: string } | null = null;
    try {
      autoReply = await generateHumaneReply({ name, email, subject, message });
    } catch (e) {
      console.warn("Failed to generate AI draft reply:", e);
    }

    const newMessage = {
      name,
      email,
      subject,
      message,
      status: "PENDING",
      replySubject: autoReply?.subject || `Re: ${subject}`,
      replyDraft: autoReply?.text || null,
    };

    // Save to database
    await prisma.contact.create({
      data: newMessage,
    });

    const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/contacts`;

    // Send email notification to Aashish
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `📬 Action Needed: New Inquiry from ${name} [Approval Pending]`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background-color: white; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #3b82f6; padding-bottom: 12px; margin-bottom: 20px;">
              <h2 style="color: #1e293b; margin: 0; font-size: 20px;">
                📬 New Contact Form Submission
              </h2>
              <span style="background-color: #fef3c7; color: #b45309; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: bold;">
                PENDING APPROVAL
              </span>
            </div>
            
            <div style="margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-weight: bold; width: 30%; color: #475569;">
                    Sender Name:
                  </td>
                  <td style="padding: 10px; background-color: white; border: 1px solid #e2e8f0; color: #1e293b;">
                    ${name}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-weight: bold; color: #475569;">
                    Email:
                  </td>
                  <td style="padding: 10px; background-color: white; border: 1px solid #e2e8f0;">
                    <a href="mailto:${email}" style="color: #2563eb; text-decoration: none; font-weight: 500;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-weight: bold; color: #475569;">
                    Subject:
                  </td>
                  <td style="padding: 10px; background-color: white; border: 1px solid #e2e8f0; color: #1e293b;">
                    ${subject}
                  </td>
                </tr>
              </table>
            </div>
            
            <div style="margin-bottom: 24px;">
              <h3 style="color: #1e293b; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Message:</h3>
              <div style="background-color: #f8fafc; padding: 16px; border-left: 4px solid #3b82f6; border-radius: 6px;">
                <p style="margin: 0; line-height: 1.6; color: #334155; white-space: pre-wrap; font-size: 14px;">${message}</p>
              </div>
            </div>

            ${
              autoReply?.text
                ? `
            <div style="margin-bottom: 24px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <h3 style="color: #1e293b; margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">AI-Generated Draft (gpt-6-luna):</h3>
              </div>
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 6px;">
                <p style="margin: 0; line-height: 1.6; color: #166534; white-space: pre-wrap; font-size: 13px;">${autoReply.text}</p>
              </div>
            </div>
            `
                : ""
            }

            <div style="margin: 30px 0; text-align: center;">
              <a href="${portalUrl}" style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block; box-shadow: 0 4px 10px rgba(37,99,235,0.2);">
                Review, Edit & Send in Admin Portal &rarr;
              </a>
            </div>
            
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px;">
              <p style="margin: 0 0 4px 0;">Portfolio Inquiries &middot; Human-in-the-Loop Approval</p>
              <p style="margin: 0;">Received at: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission (Pending Your Approval)

From: ${name} (${email})
Subject: ${subject}

Message:
${message}

AI Draft Reply (gpt-6-luna):
${autoReply?.text || "No draft generated"}

Review and approve in Admin Portal: ${portalUrl}
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
