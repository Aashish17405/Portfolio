import { redirect } from "next/navigation";
import { isCurrentAdminAuthenticated } from "@/lib/admin-auth";
import AdminContactsClient from "./admin-contacts-client";

export const metadata = {
  title: "Admin Approval Portal | Aashish Jaini",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminContactsPage() {
  const isAuthenticated = await isCurrentAdminAuthenticated();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  return <AdminContactsClient />;
}
