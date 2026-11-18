import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { isCurrentAdminAuthenticated } from "@/lib/admin-auth";
import { generateHumaneReply } from "@/lib/email-auto-responder";

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

    const contact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      return NextResponse.json({ error: "Contact submission not found" }, { status: 404 });
    }

    const autoReply = await generateHumaneReply({
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
    });

    const updated = await prisma.contact.update({
      where: { id },
      data: {
        replyDraft: autoReply.text,
        replySubject: autoReply.subject,
      },
    });

    return NextResponse.json({
      success: true,
      draft: autoReply.text,
      subject: autoReply.subject,
      contact: updated,
    });
  } catch (err: any) {
    console.error("Error regenerating AI draft:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to regenerate draft" },
      { status: 500 }
    );
  }
}
