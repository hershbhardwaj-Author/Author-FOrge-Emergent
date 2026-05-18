import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API = `/api`;
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD;
const SESSION_KEY = "af_admin_authed";

function LoginGate({ onAuth }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const attempt = (e) => {
    e.preventDefault();
    if (input === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onAuth();
    } else {
      setError(true);
      setShake(true);
      setInput("");
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--ia-ivory)] flex items-center justify-center">
      <div className="w-full max-w-sm px-8">
        <div className="text-center mb-10">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--ia-bronze)] mb-3">Admin Access</p>
          <h1 className="font-display text-3xl italic text-[var(--ia-ink)]">The Author's Forge</h1>
          <div className="h-px w-16 bg-[var(--ia-bronze)] mx-auto mt-4" />
        </div>

        <form onSubmit={attempt} className={shake ? "animate-[wiggle_0.4s_ease-in-out]" : ""}>
          <label className="block text-[10px] tracking-[0.3em] uppercase text-[var(--ia-ink-mute)] mb-2">
            Password
          </label>
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            autoFocus
            className={`w-full border px-4 py-3 bg-transparent text-[var(--ia-ink)] outline-none text-sm transition-colors ${
              error ? "border-red-400" : "border-[var(--ia-rule)] focus:border-[var(--ia-ink)]"
            }`}
            placeholder="Enter password"
          />
          {error && (
            <p className="text-red-500 text-xs mt-2 tracking-wide">Incorrect password.</p>
          )}
          <button
            type="submit"
            className="w-full mt-5 bg-[var(--ia-forest)] text-[var(--ia-ivory)] py-3 text-[11px] tracking-[0.3em] uppercase hover:bg-[var(--ia-forest-deep)] transition-colors"
          >
            Enter
          </button>
        </form>

        <p className="text-center mt-8">
          <a href="/" className="text-[10px] tracking-widest uppercase text-[var(--ia-ink-mute)] hover:text-[var(--ia-ink)] transition-colors">
            ← Back to Site
          </a>
        </p>
      </div>

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}

const fmt = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const SOURCE_LABELS = {
  "curriculum-brief": "Curriculum Brief",
  "specimen-page": "Specimen Page",
  "quiet-list": "Quiet List",
};

const Badge = ({ source }) => {
  const colors = {
    "curriculum-brief": "bg-[var(--ia-forest)] text-[var(--ia-ivory)]",
    "specimen-page": "bg-[var(--ia-bronze)] text-[var(--ia-ivory)]",
    "quiet-list": "bg-[var(--ia-ink-soft)] text-[var(--ia-ivory)]",
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-[10px] tracking-widest uppercase font-semibold ${colors[source] || "bg-gray-200 text-gray-700"}`}>
      {SOURCE_LABELS[source] || source}
    </span>
  );
};

const StatCard = ({ label, value }) => (
  <div className="border border-[var(--ia-rule)] p-6">
    <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--ia-ink-mute)] mb-2">{label}</p>
    <p className="font-display text-4xl text-[var(--ia-ink)]">{value}</p>
  </div>
);

function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("leads");
  const [expandedApp, setExpandedApp] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [leadsRes, appsRes] = await Promise.all([
        axios.get(`${API}/leads`),
        axios.get(`${API}/applications`),
      ]);
      setLeads(leadsRes.data);
      setApplications(appsRes.data);
    } catch (e) {
      setError("Failed to load data. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const leadsBySource = leads.reduce((acc, l) => {
    acc[l.source] = (acc[l.source] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[var(--ia-ivory)] text-[var(--ia-ink)] font-body">
      {/* Header */}
      <header className="border-b border-[var(--ia-rule)] px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/" className="text-[10px] tracking-[0.3em] uppercase text-[var(--ia-ink-mute)] hover:text-[var(--ia-ink)] transition-colors">
            ← Back to Site
          </a>
          <span className="text-[var(--ia-rule)]">|</span>
          <span className="font-display text-lg italic text-[var(--ia-ink)]">The Author's Forge</span>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[var(--ia-bronze)]">Admin</span>
        </div>
        <button
          onClick={fetchAll}
          disabled={loading}
          className="text-[10px] tracking-[0.3em] uppercase border border-[var(--ia-rule)] px-4 py-2 hover:border-[var(--ia-ink)] transition-colors disabled:opacity-40"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-10">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-px border border-[var(--ia-rule)] mb-10 bg-[var(--ia-rule)]">
          <div className="bg-[var(--ia-ivory)]"><StatCard label="Total Leads" value={leads.length} /></div>
          <div className="bg-[var(--ia-ivory)]"><StatCard label="Applications" value={applications.length} /></div>
          <div className="bg-[var(--ia-ivory)]"><StatCard label="Curriculum" value={leadsBySource["curriculum-brief"] || 0} /></div>
          <div className="bg-[var(--ia-ivory)]"><StatCard label="Specimen Page" value={leadsBySource["specimen-page"] || 0} /></div>
          <div className="bg-[var(--ia-ivory)]"><StatCard label="Quiet List" value={leadsBySource["quiet-list"] || 0} /></div>
        </div>

        {/* Error state */}
        {error && (
          <div className="border border-red-300 bg-red-50 text-red-700 px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex gap-0 border-b border-[var(--ia-rule)] mb-6">
          {["leads", "applications"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 text-[11px] tracking-[0.25em] uppercase transition-colors border-b-2 -mb-px ${
                tab === t
                  ? "border-[var(--ia-forest)] text-[var(--ia-ink)] font-semibold"
                  : "border-transparent text-[var(--ia-ink-mute)] hover:text-[var(--ia-ink)]"
              }`}
            >
              {t === "leads" ? `Leads (${leads.length})` : `Applications (${applications.length})`}
            </button>
          ))}
        </div>

        {/* Leads table */}
        {tab === "leads" && (
          <div className="overflow-x-auto">
            {leads.length === 0 && !loading ? (
              <p className="text-[var(--ia-ink-mute)] text-sm py-10 text-center">No leads captured yet.</p>
            ) : (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--ia-rule)]">
                    {["Email", "Source", "Captured"].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-[10px] tracking-[0.25em] uppercase text-[var(--ia-ink-mute)] font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, i) => (
                    <tr
                      key={lead.id}
                      className={`border-b border-[var(--ia-rule-soft)] hover:bg-[var(--ia-ivory-deep)] transition-colors ${i % 2 === 0 ? "" : "bg-[var(--ia-ivory-warm)]"}`}
                    >
                      <td className="py-3 px-4 font-medium">{lead.email}</td>
                      <td className="py-3 px-4"><Badge source={lead.source} /></td>
                      <td className="py-3 px-4 text-[var(--ia-ink-mute)] text-xs">{fmt(lead.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Applications table */}
        {tab === "applications" && (
          <div className="overflow-x-auto">
            {applications.length === 0 && !loading ? (
              <p className="text-[var(--ia-ink-mute)] text-sm py-10 text-center">No applications received yet.</p>
            ) : (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--ia-rule)]">
                    {["Name", "Email", "Expertise", "Stage", "Submitted"].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-[10px] tracking-[0.25em] uppercase text-[var(--ia-ink-mute)] font-medium">
                        {h}
                      </th>
                    ))}
                    <th className="py-3 px-4" />
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app, i) => (
                    <React.Fragment key={app.id}>
                      <tr
                        className={`border-b border-[var(--ia-rule-soft)] hover:bg-[var(--ia-ivory-deep)] transition-colors cursor-pointer ${i % 2 === 0 ? "" : "bg-[var(--ia-ivory-warm)]"}`}
                        onClick={() => setExpandedApp(expandedApp === app.id ? null : app.id)}
                      >
                        <td className="py-3 px-4 font-medium">{app.name}</td>
                        <td className="py-3 px-4 text-[var(--ia-ink-soft)]">{app.email}</td>
                        <td className="py-3 px-4 text-[var(--ia-ink-soft)]">{app.expertise}</td>
                        <td className="py-3 px-4 text-[var(--ia-ink-mute)] text-xs">{app.stage || "—"}</td>
                        <td className="py-3 px-4 text-[var(--ia-ink-mute)] text-xs">{fmt(app.created_at)}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-[10px] tracking-widest uppercase text-[var(--ia-bronze)]">
                            {expandedApp === app.id ? "Close ▲" : "Read ▼"}
                          </span>
                        </td>
                      </tr>
                      {expandedApp === app.id && (
                        <tr className={`border-b border-[var(--ia-rule)] ${i % 2 === 0 ? "" : "bg-[var(--ia-ivory-warm)]"}`}>
                          <td colSpan={6} className="px-6 py-5">
                            <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--ia-ink-mute)] mb-2">Book Concept</p>
                            <p className="text-sm text-[var(--ia-ink-soft)] leading-relaxed max-w-3xl whitespace-pre-wrap">{app.concept}</p>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "1"
  );

  if (!authed) {
    return <LoginGate onAuth={() => setAuthed(true)} />;
  }

  return <Dashboard />;
}
