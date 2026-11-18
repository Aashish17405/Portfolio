import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { isCurrentAdminAuthenticated } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  try {
    const isAuth = await isCurrentAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // "ALL", "PENDING", "SENT", "DISMISSED"

    const whereClause: any = {};
    if (status && status !== "ALL") {
      whereClause.status = status;
    }

    const contacts = await prisma.contact.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    // Count statistics
    const [total, pending, sent, dismissed] = await Promise.all([
      prisma.contact.count(),
      prisma.contact.count({ where: { status: "PENDING" } }),
      prisma.contact.count({ where: { status: "SENT" } }),
      prisma.contact.count({ where: { status: "DISMISSED" } }),
    ]);

    return NextResponse.json({
      contacts,
      counts: {
        total,
        pending,
        sent,
        dismissed,
      },
    });
  } catch (err: any) {
    console.error("Error fetching admin contacts:", err);
    return NextResponse.json({ error: err?.message || "Failed to fetch contacts" }, { status: 500 });
  }
}
