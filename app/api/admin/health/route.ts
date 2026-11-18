import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import nodemailer from "nodemailer";
import { isCurrentAdminAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  try {
    const isAuth = await isCurrentAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results = {
      database: { status: "unknown", message: "" },
      ai: { status: "unknown", message: "", model: process.env.OPENAI_CONTACT_MODEL || "gpt-6-luna" },
      smtp: { status: "unknown", message: "", user: process.env.EMAIL_USER || "Not configured" },
      timestamp: new Date().toISOString(),
    };

    // 1. Check Database
    try {
      await prisma.$queryRaw`SELECT 1`;
      results.database = {
        status: "healthy",
        message: "Connected to PostgreSQL database successfully.",
      };
    } catch (dbErr: any) {
      results.database = {
        status: "unreachable",
        message: dbErr?.message || "Failed to query database.",
      };
    }

    // 2. Check OpenAI API Key
    if (process.env.OPENAI_API_KEY) {
      results.ai = {
        status: "healthy",
        message: `OpenAI API key configured. Using ${results.ai.model} with fallback support.`,
        model: results.ai.model,
      };
    } else {
      results.ai = {
        status: "warning",
        message: "OPENAI_API_KEY is not set. System is using curated empathetic templates as fallback.",
        model: "Curated Templates",
      };
    }

    // 3. Check Nodemailer SMTP
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });
        await transporter.verify();
        results.smtp = {
          status: "healthy",
          message: `Gmail SMTP verified for ${process.env.EMAIL_USER}. Ready to dispatch replies.`,
          user: process.env.EMAIL_USER,
        };
      } catch (smtpErr: any) {
        results.smtp = {
          status: "unreachable",
          message: `SMTP verification failed: ${smtpErr?.message || "Check email credentials or App Password."}`,
          user: process.env.EMAIL_USER,
        };
      }
    } else {
      results.smtp = {
        status: "warning",
        message: "EMAIL_USER or EMAIL_PASSWORD missing in .env.",
        user: "None",
      };
    }

    const allHealthy = results.database.status === "healthy" && results.smtp.status === "healthy";

    return NextResponse.json({
      allHealthy,
      services: results,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}
