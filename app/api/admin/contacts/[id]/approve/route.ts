import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import nodemailer from "nodemailer";
import { isCurrentAdminAuthenticated } from "@/lib/admin-auth";
import { buildHtmlEmail } from "@/lib/email-auto-responder";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await isCurrentAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { subject, message } = body || {};

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    const contact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      return NextResponse.json({ error: "Contact submission not found" }, { status: 404 });
    }

    const emailSubject = subject || contact.replySubject || `Re: ${contact.subject}`;
    const htmlContent = buildHtmlEmail(message, {
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
    });

    // Send email to the visitor
    await transporter.sendMail({
      from: `"Aashish Jaini" <${process.env.EMAIL_USER}>`,
      to: contact.email,
      replyTo: process.env.EMAIL_USER,
      subject: emailSubject,
      text: message,
      html: htmlContent,
    });

    // Update DB record
    const updated = await prisma.contact.update({
      where: { id },
      data: {
        status: "SENT",
        repliedAt: new Date(),
        sentContent: message,
        replySubject: emailSubject,
        replyDraft: message,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Reply sent successfully to ${contact.email}`,
      contact: updated,
    });
  } catch (err: any) {
    console.error("Error approving and sending contact reply:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
