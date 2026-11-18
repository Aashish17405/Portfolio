import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { isCurrentAdminAuthenticated } from "@/lib/admin-auth";

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

    const updated = await prisma.contact.update({
      where: { id },
      data: {
        status: "DISMISSED",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Submission dismissed",
      contact: updated,
    });
  } catch (err: any) {
    console.error("Error dismissing contact submission:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to dismiss contact" },
      { status: 500 }
    );
  }
}
