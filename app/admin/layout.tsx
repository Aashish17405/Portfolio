import React from "react";

export const metadata = {
  title: "Admin Approval Portal | Aashish Jaini",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-portal min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
      {children}
    </div>
  );
}
