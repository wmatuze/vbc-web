import React, { useState } from "react";
import {
  PhoneIcon,
  EnvelopeIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

const STATUS_STYLES = {
  new:          "bg-blue-100 text-blue-800   dark:bg-blue-900/30  dark:text-blue-300",
  contacted:    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "followed-up":"bg-green-100 text-green-800  dark:bg-green-900/30  dark:text-green-300",
};

const STATUS_LABELS = {
  new:          "New",
  contacted:    "Contacted",
  "followed-up":"Followed Up",
};

const formatDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch { return "—"; }
};

// ─── Expandable row ───────────────────────────────────────────────────────────

const VisitorRow = ({ visitor, onStatusChange, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const displayName = [visitor.title, visitor.fullName].filter(Boolean).join(" ");
  const statusStyle = STATUS_STYLES[visitor.status] || STATUS_STYLES.new;

  return (
    <>
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
        {/* Expand toggle + name */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setExpanded((e) => !e)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0">
              {expanded
                ? <ChevronUpIcon className="h-4 w-4" />
                : <ChevronDownIcon className="h-4 w-4" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                <UserIcon className="h-3.5 w-3.5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                  {displayName}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{visitor.ageGroup || "—"}</p>
              </div>
            </div>
          </div>
        </td>

        {/* Contact */}
        <td className="px-4 py-3">
          <div className="space-y-1">
            {visitor.email && (
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                <EnvelopeIcon className="h-3 w-3 text-gray-400 flex-shrink-0" />
                <a href={`mailto:${visitor.email}`} className="hover:text-blue-600 dark:hover:text-blue-400 truncate max-w-[160px]">
                  {visitor.email}
                </a>
              </div>
            )}
            {visitor.phone && (
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                <PhoneIcon className="h-3 w-3 text-gray-400 flex-shrink-0" />
                {visitor.phone}
              </div>
            )}
          </div>
        </td>

        {/* Visit date */}
        <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {formatDate(visitor.visitDate)}
        </td>

        {/* Wants contact */}
        <td className="px-4 py-3">
          <span className={`text-xs px-2 py-0.5 rounded font-medium ${
            visitor.requestContact
              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
              : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
          }`}>
            {visitor.requestContact ? "Follow up" : "No"}
          </span>
        </td>

        {/* Status */}
        <td className="px-4 py-3">
          <select
            value={visitor.status || "new"}
            onChange={(e) => onStatusChange(visitor._id, e.target.value)}
            className={`text-xs px-2 py-1 rounded font-medium border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-400 ${statusStyle}`}
          >
            {Object.entries(STATUS_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </td>

        {/* Delete */}
        <td className="px-4 py-3">
          <button
            onClick={() => onDelete(visitor._id, displayName)}
            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
            title="Delete"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </td>
      </tr>

      {/* Expanded details */}
      {expanded && (
        <tr className="bg-gray-50 dark:bg-gray-800/50">
          <td colSpan={6} className="px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="text-gray-400 uppercase tracking-wider mb-1">Marital Status</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">{visitor.maritalStatus || "—"}</p>
              </div>
              <div>
                <p className="text-gray-400 uppercase tracking-wider mb-1">Birthday</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">{visitor.birthday || "—"}</p>
              </div>
              <div>
                <p className="text-gray-400 uppercase tracking-wider mb-1">Address</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">{visitor.address || "—"}</p>
              </div>
              <div>
                <p className="text-gray-400 uppercase tracking-wider mb-1">Children</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {visitor.hasChildren
                    ? visitor.children?.length > 0
                      ? visitor.children.join(", ")
                      : "Yes"
                    : "No"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 uppercase tracking-wider mb-1">Accepted Jesus</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {visitor.acceptedJesus === true  ? "Yes"
                   : visitor.acceptedJesus === false ? "No"
                   : "—"}
                </p>
              </div>
              {visitor.acceptedJesus === false && (
                <div>
                  <p className="text-gray-400 uppercase tracking-wider mb-1">Decision Today</p>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    {visitor.wantToAccept === "yes"       ? "Yes"
                     : visitor.wantToAccept === "not-today" ? "Not Today"
                     : "—"}
                  </p>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

// ─── Main tab ─────────────────────────────────────────────────────────────────

const VisitorsTab = ({ visitors = [], loading, error, onStatusChange, onDelete }) => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterContact, setFilterContact] = useState("all");

  const filtered = visitors.filter((v) => {
    const name = [v.title, v.fullName].filter(Boolean).join(" ").toLowerCase();
    const matchSearch  = !search || name.includes(search.toLowerCase()) ||
                         v.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus  = filterStatus  === "all" || v.status === filterStatus;
    const matchContact = filterContact === "all" ||
                         (filterContact === "yes" && v.requestContact) ||
                         (filterContact === "no"  && !v.requestContact);
    return matchSearch && matchStatus && matchContact;
  });

  const newCount       = visitors.filter((v) => v.status === "new").length;
  const followUpCount  = visitors.filter((v) => v.requestContact).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-sm text-red-500 dark:text-red-400">{error}</div>
    );
  }

  return (
    <div>
      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-px bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
        {[
          { label: "Total Visitors",  value: visitors.length },
          { label: "New (uncontacted)", value: newCount       },
          { label: "Wants Follow-up",  value: followUpCount  },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white dark:bg-gray-800 px-6 py-4 text-center">
            <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none">
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="followed-up">Followed Up</option>
        </select>
        <select value={filterContact} onChange={(e) => setFilterContact(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none">
          <option value="all">All Visitors</option>
          <option value="yes">Wants Contact</option>
          <option value="no">No Contact Needed</option>
        </select>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            {visitors.length === 0 ? "No first-timer cards submitted yet." : "No results match your filters."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                {["Visitor", "Contact", "Visit Date", "Follow Up", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {filtered.map((visitor) => (
                <VisitorRow
                  key={visitor._id}
                  visitor={visitor}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VisitorsTab;
