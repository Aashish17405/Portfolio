"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  LogOut,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  RefreshCw,
  Search,
  Send,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  Eye,
  Edit3,
  Activity,
  Server,
  Key,
  X,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { buildHtmlEmail } from "@/lib/email-auto-responder";

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: "PENDING" | "SENT" | "DISMISSED";
  replySubject: string | null;
  replyDraft: string | null;
  repliedAt: string | null;
  sentContent: string | null;
}

interface Counts {
  total: number;
  pending: number;
  sent: number;
  dismissed: number;
}

interface HealthStatus {
  allHealthy: boolean;
  services: {
    database: { status: string; message: string };
    ai: { status: string; message: string; model: string };
    smtp: { status: string; message: string; user: string };
    timestamp: string;
  };
}

export default function AdminContactsClient() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [counts, setCounts] = useState<Counts>({ total: 0, pending: 0, sent: 0, dismissed: 0 });
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "SENT" | "DISMISSED">("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [isLoading, setIsLoading] = useState(true);

  // Per-card action loading states
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"approve" | "regenerate" | "dismiss" | null>(null);

  // Per-card error diagnostics
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

  // Global banner notification
  const [bannerMessage, setBannerMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Editable draft states keyed by contact id
  const [draftEdits, setDraftEdits] = useState<Record<string, { subject: string; message: string }>>({});

  // Card view mode per contact: "edit" vs "preview"
  const [previewMode, setPreviewMode] = useState<Record<string, "edit" | "preview">>({});

  // Expanded card tracking
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  // Copy-to-clipboard state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // System Health Drawer
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [healthData, setHealthData] = useState<HealthStatus | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);

  async function checkHealth() {
    setHealthLoading(true);
    try {
      const res = await fetch("/api/admin/health");
      if (res.ok) {
        const data = await res.json();
        setHealthData(data);
      }
    } catch {
      // Ignore
    } finally {
      setHealthLoading(false);
    }
  }

  async function fetchContacts() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/contacts");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (data.contacts) {
        setContacts(data.contacts);
        setCounts(data.counts || { total: 0, pending: 0, sent: 0, dismissed: 0 });

        // Initialize draft edits
        const edits: Record<string, { subject: string; message: string }> = {};
        data.contacts.forEach((c: Contact) => {
          edits[c.id] = {
            subject: c.replySubject || `Re: ${c.subject}`,
            message: c.replyDraft || "",
          };
        });
        setDraftEdits(edits);
      }
    } catch (err: any) {
      console.error("Failed to load contacts:", err);
      setBannerMessage({ text: "Database connection failed. Check your database status.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchContacts();
    checkHealth();
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  }

  function handleCopyEmail(email: string, id: string) {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handleApproveAndSend(contactId: string) {
    const edit = draftEdits[contactId];
    if (!edit || !edit.message.trim()) {
      setCardErrors((prev) => ({ ...prev, [contactId]: "Reply message cannot be empty." }));
      return;
    }

    setActionLoadingId(contactId);
    setActionType("approve");
    setCardErrors((prev) => {
      const copy = { ...prev };
      delete copy[contactId];
      return copy;
    });

    try {
      const res = await fetch(`/api/admin/contacts/${contactId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: edit.subject,
          message: edit.message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send email. Check your SMTP credentials in .env.");
      }

      setBannerMessage({
        text: `Email successfully approved and sent to ${data.contact?.email || "recipient"}!`,
        type: "success",
      });

      // Update local state
      setContacts((prev) =>
        prev.map((c) =>
          c.id === contactId
            ? {
                ...c,
                status: "SENT",
                repliedAt: new Date().toISOString(),
                sentContent: edit.message,
                replySubject: edit.subject,
              }
            : c
        )
      );
      setCounts((prev) => ({
        ...prev,
        pending: Math.max(0, prev.pending - 1),
        sent: prev.sent + 1,
      }));
    } catch (err: any) {
      const errMsg = err?.message || "Failed to approve and dispatch email.";
      setCardErrors((prev) => ({ ...prev, [contactId]: errMsg }));
      setBannerMessage({ text: `Delivery failed: ${errMsg}`, type: "error" });
    } finally {
      setActionLoadingId(null);
      setActionType(null);
    }
  }

  async function handleRegenerateDraft(contactId: string) {
    setActionLoadingId(contactId);
    setActionType("regenerate");
    setCardErrors((prev) => {
      const copy = { ...prev };
      delete copy[contactId];
      return copy;
    });

    try {
      const res = await fetch(`/api/admin/contacts/${contactId}/regenerate`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to regenerate draft.");
      }

      setDraftEdits((prev) => ({
        ...prev,
        [contactId]: {
          subject: data.subject,
          message: data.draft,
        },
      }));

      setBannerMessage({ text: "Fresh draft generated with gpt-6-luna!", type: "success" });
    } catch (err: any) {
      const errMsg = err?.message || "Failed to generate draft.";
      setCardErrors((prev) => ({ ...prev, [contactId]: errMsg }));
    } finally {
      setActionLoadingId(null);
      setActionType(null);
    }
  }

  async function handleDismiss(contactId: string) {
    if (!confirm("Are you sure you want to dismiss this inquiry without sending an email?")) return;

    setActionLoadingId(contactId);
    setActionType("dismiss");

    try {
      const res = await fetch(`/api/admin/contacts/${contactId}/dismiss`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to dismiss.");
      }

      setContacts((prev) =>
        prev.map((c) => (c.id === contactId ? { ...c, status: "DISMISSED" } : c))
      );
      setCounts((prev) => ({
        ...prev,
        pending: Math.max(0, prev.pending - 1),
        dismissed: prev.dismissed + 1,
      }));
      setBannerMessage({ text: "Submission marked as dismissed.", type: "success" });
    } catch (err: any) {
      setCardErrors((prev) => ({ ...prev, [contactId]: err?.message || "Failed to dismiss." }));
    } finally {
      setActionLoadingId(null);
      setActionType(null);
    }
  }

  const filteredContacts = useMemo(() => {
    let result = contacts.filter((c) => {
      // Tab filter
      if (activeTab !== "ALL" && c.status !== activeTab) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.subject.toLowerCase().includes(q) ||
          c.message.toLowerCase().includes(q)
        );
      }
      return true;
    });

    if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [contacts, activeTab, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900 tracking-tight">Aashish Jaini</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                Approval Portal
              </span>
            </div>
            <p className="text-xs text-slate-500">Contact Review &amp; Dispatch Engine</p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Health Status Pill */}
          <button
            onClick={() => {
              checkHealth();
              setShowHealthModal(true);
            }}
            className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
              healthData?.allHealthy
                ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100/60"
                : healthData?.services.database.status === "unreachable"
                ? "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100/60"
                : "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100/60"
            }`}
            title="Inspect Database, AI, and SMTP status"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                healthData?.allHealthy
                  ? "bg-emerald-500"
                  : healthData?.services.database.status === "unreachable"
                  ? "bg-rose-500 animate-pulse"
                  : "bg-amber-500"
              }`}
            />
            <span className="hidden sm:inline">
              {healthData?.allHealthy ? "All Systems Operational" : "Service Status"}
            </span>
            <Activity className="w-3.5 h-3.5 opacity-70" />
          </button>

          <button
            onClick={() => {
              fetchContacts();
              checkHealth();
            }}
            disabled={isLoading}
            className="text-xs text-slate-600 hover:text-slate-900 p-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-all"
            title="Refresh submissions"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-blue-600" : ""}`} />
          </button>

          <button
            onClick={handleLogout}
            className="text-xs text-rose-600 hover:text-rose-700 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-100/60 transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        {/* Banner Alert Notification */}
        {bannerMessage && (
          <div
            className={`mb-6 p-4 rounded-xl text-xs sm:text-sm flex items-center justify-between border shadow-sm transition-all ${
              bannerMessage.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {bannerMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              )}
              <span>{bannerMessage.text}</span>
            </div>
            <button
              onClick={() => setBannerMessage(null)}
              className="text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Product Metric KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div
            onClick={() => setActiveTab("PENDING")}
            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
              activeTab === "PENDING"
                ? "bg-amber-50/80 border-amber-300 shadow-sm ring-2 ring-amber-400/20"
                : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                Pending Approval
              </span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              {counts.pending}
              {counts.pending > 0 && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 animate-pulse">
                  Action
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Requires human review</p>
          </div>

          <div
            onClick={() => setActiveTab("SENT")}
            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
              activeTab === "SENT"
                ? "bg-emerald-50/80 border-emerald-300 shadow-sm ring-2 ring-emerald-400/20"
                : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                Approved &amp; Sent
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{counts.sent}</div>
            <p className="text-[11px] text-slate-500 mt-1">Dispatched to visitors</p>
          </div>

          <div
            onClick={() => setActiveTab("DISMISSED")}
            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
              activeTab === "DISMISSED"
                ? "bg-slate-100 border-slate-300 shadow-sm ring-2 ring-slate-300/40"
                : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Dismissed
              </span>
              <XCircle className="w-4 h-4 text-slate-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{counts.dismissed}</div>
            <p className="text-[11px] text-slate-500 mt-1">Archived without reply</p>
          </div>

          <div
            onClick={() => setActiveTab("ALL")}
            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
              activeTab === "ALL"
                ? "bg-blue-50/80 border-blue-300 shadow-sm ring-2 ring-blue-400/20"
                : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                Total Received
              </span>
              <Mail className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{counts.total}</div>
            <p className="text-[11px] text-slate-500 mt-1">All time inquiries</p>
          </div>
        </div>

        {/* Toolbar: Filter Tabs + Search & Sorting */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {(["PENDING", "SENT", "DISMISSED", "ALL"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {tab === "PENDING"
                  ? `Pending (${counts.pending})`
                  : tab === "SENT"
                  ? `Sent (${counts.sent})`
                  : tab === "DISMISSED"
                  ? `Dismissed (${counts.dismissed})`
                  : `All (${counts.total})`}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search sender, message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        {/* Contact Inquiries Feed */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
            <p className="text-sm font-medium">Loading approval inbox...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-dashed border-slate-300 bg-white p-8">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">No submissions found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No results matching "${searchQuery}". Clear your search query to see all.`
                : activeTab === "PENDING"
                ? "You're all caught up! No messages are awaiting your approval right now."
                : "No inquiries found under this category."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredContacts.map((contact) => {
              const edit = draftEdits[contact.id] || {
                subject: contact.replySubject || `Re: ${contact.subject}`,
                message: contact.replyDraft || "",
              };
              const isCardExpanded = expandedCards[contact.id] ?? true;
              const isProcessing = actionLoadingId === contact.id;
              const cardError = cardErrors[contact.id];
              const mode = previewMode[contact.id] || "edit";

              return (
                <div
                  key={contact.id}
                  className={`bg-white rounded-2xl border transition-all shadow-xs ${
                    contact.status === "PENDING"
                      ? "border-slate-300 hover:border-slate-400 shadow-sm"
                      : contact.status === "SENT"
                      ? "border-emerald-200/90 bg-emerald-50/10"
                      : "border-slate-200 opacity-75"
                  }`}
                >
                  {/* Card Header Strip */}
                  <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 rounded-t-2xl">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm sm:text-base font-bold text-slate-900">
                            {contact.name}
                          </h3>

                          {/* Email Pill with Copy Button */}
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-mono border border-slate-200">
                            <a href={`mailto:${contact.email}`} className="hover:underline">
                              {contact.email}
                            </a>
                            <button
                              onClick={() => handleCopyEmail(contact.email, contact.id)}
                              className="text-slate-400 hover:text-slate-700 p-0.5"
                              title="Copy email to clipboard"
                            >
                              {copiedId === contact.id ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>

                          {/* Status Badge */}
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                              contact.status === "PENDING"
                                ? "bg-amber-100 text-amber-800 border-amber-300"
                                : contact.status === "SENT"
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                : "bg-slate-200 text-slate-600 border-slate-300"
                            }`}
                          >
                            {contact.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{new Date(contact.createdAt).toLocaleString()}</span>
                        </p>
                      </div>
                    </div>

                    {/* Expand / Collapse Control */}
                    <button
                      onClick={() =>
                        setExpandedCards((prev) => ({
                          ...prev,
                          [contact.id]: !isCardExpanded,
                        }))
                      }
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 self-end sm:self-auto px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-all"
                    >
                      <span>{isCardExpanded ? "Hide Details" : "Inspect & Reply"}</span>
                      {isCardExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Card Body Container */}
                  {isCardExpanded && (
                    <div className="p-5 sm:p-6 space-y-6">
                      {/* Error Diagnostic Callout if failed */}
                      {cardError && (
                        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                          <div className="flex items-start gap-2.5">
                            <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <span className="font-semibold block mb-0.5">Operation Failed</span>
                              <p className="font-mono text-[11px] bg-rose-100/60 p-2 rounded-lg border border-rose-200/80 mb-2">
                                {cardError}
                              </p>
                              <p className="text-rose-700">
                                <strong>Troubleshooting suggestion:</strong> If this is an SMTP error, verify that your Gmail 16-character App Password is set in <code>EMAIL_PASSWORD</code>. If this is a database error, ensure your PostgreSQL server is active.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Side-by-Side or Stacked Message Thread */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column: Original Visitor Message */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-blue-600" />
                              Incoming Inquiry
                            </span>
                          </div>

                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm leading-relaxed text-slate-800">
                            <div className="text-xs font-semibold text-slate-900 mb-2 pb-2 border-b border-slate-200/80">
                              Subject: &quot;{contact.subject}&quot;
                            </div>
                            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                              {contact.message}
                            </div>
                          </div>
                        </div>

                        {/* Right Column: AI Draft & Approval Station */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                                Response Workspace
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                gpt-6-luna
                              </span>
                            </div>

                            {/* View Switcher: Edit vs Live Email Preview */}
                            <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
                              <button
                                onClick={() => setPreviewMode((prev) => ({ ...prev, [contact.id]: "edit" }))}
                                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                                  mode === "edit" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                                }`}
                              >
                                Editor
                              </button>
                              <button
                                onClick={() => setPreviewMode((prev) => ({ ...prev, [contact.id]: "preview" }))}
                                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                                  mode === "preview" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                                }`}
                              >
                                Email Preview
                              </button>
                            </div>
                          </div>

                          {/* If inquiry is already SENT */}
                          {contact.status === "SENT" ? (
                            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs leading-relaxed text-slate-800 space-y-2">
                              <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-xs pb-2 border-b border-emerald-200">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>Dispatched on {contact.repliedAt ? new Date(contact.repliedAt).toLocaleString() : "recently"}</span>
                              </div>
                              <p className="text-slate-500 font-medium">
                                Subject: {contact.replySubject || `Re: ${contact.subject}`}
                              </p>
                              <div className="whitespace-pre-wrap text-slate-800 bg-white p-3 rounded-lg border border-emerald-200/80">
                                {contact.sentContent || contact.replyDraft}
                              </div>
                            </div>
                          ) : contact.status === "DISMISSED" ? (
                            <div className="p-6 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 text-center">
                              <p>This message was dismissed. No reply was sent.</p>
                            </div>
                          ) : mode === "preview" ? (
                            /* Live Rendered HTML Email Preview */
                            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-100">
                              <div className="bg-slate-200/80 px-3 py-1.5 text-[11px] text-slate-600 border-b border-slate-300 font-mono flex items-center justify-between">
                                <span>Preview: Exactly what {contact.name} sees</span>
                                <span>To: {contact.email}</span>
                              </div>
                              <div className="p-3 bg-slate-100 max-h-72 overflow-y-auto">
                                <div
                                  className="bg-white p-4 rounded-lg shadow-xs text-xs"
                                  dangerouslySetInnerHTML={{
                                    __html: buildHtmlEmail(edit.message, {
                                      name: contact.name,
                                      email: contact.email,
                                      subject: contact.subject,
                                      message: contact.message,
                                    }),
                                  }}
                                />
                              </div>
                            </div>
                          ) : (
                            /* Raw Draft Editor */
                            <div className="space-y-3">
                              <div>
                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                  Subject Line
                                </label>
                                <input
                                  type="text"
                                  value={edit.subject}
                                  onChange={(e) =>
                                    setDraftEdits((prev) => ({
                                      ...prev,
                                      [contact.id]: { ...prev[contact.id], subject: e.target.value },
                                    }))
                                  }
                                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white"
                                />
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <label className="block text-[11px] font-semibold text-slate-600">
                                    Message Body
                                  </label>
                                  <span className="text-[10px] text-slate-400">
                                    {edit.message.length} characters
                                  </span>
                                </div>
                                <textarea
                                  rows={7}
                                  value={edit.message}
                                  onChange={(e) =>
                                    setDraftEdits((prev) => ({
                                      ...prev,
                                      [contact.id]: { ...prev[contact.id], message: e.target.value },
                                    }))
                                  }
                                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white"
                                  placeholder="Type or customize your reply message here..."
                                />
                              </div>

                              {/* Interactive Actions Strip */}
                              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                  <button
                                    onClick={() => handleRegenerateDraft(contact.id)}
                                    disabled={isProcessing}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                                    title="Regenerate draft with gpt-6-luna"
                                  >
                                    <RefreshCw
                                      className={`w-3 h-3 text-blue-600 ${
                                        isProcessing && actionType === "regenerate" ? "animate-spin" : ""
                                      }`}
                                    />
                                    <span>Regenerate</span>
                                  </button>

                                  <button
                                    onClick={() => handleDismiss(contact.id)}
                                    disabled={isProcessing}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-rose-200 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-medium flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                                    title="Dismiss without replying"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Dismiss</span>
                                  </button>
                                </div>

                                <button
                                  onClick={() => handleApproveAndSend(contact.id)}
                                  disabled={isProcessing || !edit.message.trim()}
                                  className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:shadow-md active:scale-[0.99]"
                                >
                                  {isProcessing && actionType === "approve" ? (
                                    <>
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      <span>Dispatching Email...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Send className="w-3.5 h-3.5" />
                                      <span>Approve &amp; Send</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* System Health Diagnostic Modal */}
        {showHealthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">System Diagnostics</h3>
                    <p className="text-xs text-slate-500">Live operational status of backing services</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHealthModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-4 space-y-3.5">
                {/* Database Health Card */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                      <Server className="w-4 h-4 text-slate-600" />
                      <span>PostgreSQL Database (Neon / Prisma)</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        healthData?.services.database.status === "healthy"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {healthData?.services.database.status || "Checking..."}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-mono text-[11px]">
                    {healthData?.services.database.message || "Running query check..."}
                  </p>
                </div>

                {/* AI Model Health Card */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>AI Model Engine ({healthData?.services.ai.model || "gpt-6-luna"})</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        healthData?.services.ai.status === "healthy"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {healthData?.services.ai.status || "Checking..."}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {healthData?.services.ai.message || "Verifying API key..."}
                  </p>
                </div>

                {/* Nodemailer SMTP Health Card */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                      <Mail className="w-4 h-4 text-indigo-600" />
                      <span>Nodemailer SMTP (Gmail)</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        healthData?.services.smtp.status === "healthy"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {healthData?.services.smtp.status || "Checking..."}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {healthData?.services.smtp.message || "Checking transporter credentials..."}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={checkHealth}
                  disabled={healthLoading}
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium"
                >
                  <RefreshCw className={`w-3 h-3 ${healthLoading ? "animate-spin" : ""}`} />
                  <span>Re-test Connections</span>
                </button>
                <button
                  onClick={() => setShowHealthModal(false)}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
