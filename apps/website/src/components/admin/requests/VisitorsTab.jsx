import React, { useState } from "react";
import {
  PhoneIcon,
  EnvelopeIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  UserIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

const STATUS_STYLES = {
  new:           "bg-blue-100   text-blue-800   dark:bg-blue-900/30   dark:text-blue-300",
  contacted:     "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "followed-up": "bg-green-100  text-green-800  dark:bg-green-900/30  dark:text-green-300",
};

const STATUS_LABELS = {
  new:           "New",
  contacted:     "Contacted",
  "followed-up": "Followed Up",
};

const formatDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch { return "—"; }
};

// ─── Detail label/value pair ──────────────────────────────────────────────────
const Detail = ({ label, value }) => (
  <div>
    <p className="text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider mb-0.5">{label}</p>
    <p className="text-gray-700 dark:text-gray-300 text-xs font-medium">{value || "—"}</p>
  </div>
);

// ─── Mobile card ──────────────────────────────────────────────────────────────
const VisitorCard = ({ visitor, onStatusChange, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const displayName = [visitor.title, visitor.fullName].filter(Boolean).join(" ");

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-4 space-y-3">

      {/* Top row — name + status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
            <UserIcon className="h-4 w-4 text-gray-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{displayName}</p>
            <p className="text-xs text-gray-400">{visitor.ageGroup || "—"}</p>
          </div>
        </div>
        <select
          value={visitor.status || "new"}
          onChange={(e) => onStatusChange(visitor._id, e.target.value)}
          className={`text-xs px-2 py-1 rounded font-medium border-0 cursor-pointer focus:outline-none flex-shrink-0 ${STATUS_STYLES[visitor.status] || STATUS_STYLES.new}`}
        >
          {Object.entries(STATUS_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {/* Contact details */}
      <div className="space-y-1">
        {visitor.email && (
          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
            <EnvelopeIcon className="h-3 w-3 text-gray-400 flex-shrink-0" />
            <a href={`mailto:${visitor.email}`} className="truncate hover:text-red-600">{visitor.email}</a>
          </div>
        )}
        {visitor.phone && (
          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
            <PhoneIcon className="h-3 w-3 text-gray-400 flex-shrink-0" />
            {visitor.phone}
          </div>
        )}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <CalendarDaysIcon className="h-3 w-3 text-gray-400 flex-shrink-0" />
          {formatDate(visitor.visitDate)}
        </div>
      </div>

      {/* Bottom row — follow-up badge + expand + delete */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-50 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded font-medium ${
            visitor.requestContact
              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
              : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
          }`}>
            {visitor.requestContact ? "Follow up" : "No contact"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {expanded ? "Less" : "More"}
            {expanded ? <ChevronUpIcon className="h-3 w-3" /> : <ChevronDownIcon className="h-3 w-3" />}
          </button>
          <button
            onClick={() => onDelete(visitor._id, displayName)}
            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
            title="Delete"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-50 dark:border-gray-700">
          <Detail label="Marital Status"  value={visitor.maritalStatus} />
          <Detail label="Birthday"        value={visitor.birthday} />
          <Detail label="Address"         value={visitor.address} />
          <Detail label="Children"        value={
            visitor.hasChildren
              ? visitor.children?.length > 0 ? visitor.children.join(", ") : "Yes"
              : "No"
          } />
          <Detail label="Accepted Jesus"  value={
            visitor.acceptedJesus === true  ? "Yes"
            : visitor.acceptedJesus === false ? "No" : "—"
          } />
          {visitor.acceptedJesus === false && (
            <Detail label="Decision Today" value={
              visitor.wantToAccept === "yes"        ? "Yes"
              : visitor.wantToAccept === "not-today" ? "Not Today" : "—"
            } />
          )}
        </div>
      )}
    </div>
  );
};

// ─── Desktop table row ────────────────────────────────────────────────────────
const VisitorRow = ({ visitor, onStatusChange, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const displayName = [visitor.title, visitor.fullName].filter(Boolean).join(" ");

  return (
    <>
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setExpanded((e) => !e)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0">
              {expanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                <UserIcon className="h-3.5 w-3.5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{displayName}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{visitor.ageGroup || "—"}</p>
              </div>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="space-y-1">
            {visitor.email && (
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                <EnvelopeIcon className="h-3 w-3 text-gray-400 flex-shrink-0" />
                <a href={`mailto:${visitor.email}`} className="hover:text-red-600 dark:hover:text-red-400 truncate max-w-[160px]">
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
        <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {formatDate(visitor.visitDate)}
        </td>
        <td className="px-4 py-3">
          <span className={`text-xs px-2 py-0.5 rounded font-medium ${
            visitor.requestContact
              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
              : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
          }`}>
            {visitor.requestContact ? "Follow up" : "No"}
          </span>
        </td>
        <td className="px-4 py-3">
          <select
            value={visitor.status || "new"}
            onChange={(e) => onStatusChange(visitor._id, e.target.value)}
            className={`text-xs px-2 py-1 rounded font-medium border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-red-600 ${STATUS_STYLES[visitor.status] || STATUS_STYLES.new}`}
          >
            {Object.entries(STATUS_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </td>
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

      {expanded && (
        <tr className="bg-gray-50 dark:bg-gray-800/50">
          <td colSpan={6} className="px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Detail label="Marital Status"  value={visitor.maritalStatus} />
              <Detail label="Birthday"        value={visitor.birthday} />
              <Detail label="Address"         value={visitor.address} />
              <Detail label="Children"        value={
                visitor.hasChildren
                  ? visitor.children?.length > 0 ? visitor.children.join(", ") : "Yes"
                  : "No"
              } />
              <Detail label="Accepted Jesus"  value={
                visitor.acceptedJesus === true  ? "Yes"
                : visitor.acceptedJesus === false ? "No" : "—"
              } />
              {visitor.acceptedJesus === false && (
                <Detail label="Decision Today" value={
                  visitor.wantToAccept === "yes"        ? "Yes"
                  : visitor.wantToAccept === "not-today" ? "Not Today" : "—"
                } />
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
  const [search,        setSearch]        = useState("");
  const [filterStatus,  setFilterStatus]  = useState("all");
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

  const newCount      = visitors.filter((v) => v.status === "new").length;
  const followUpCount = visitors.filter((v) => v.requestContact).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-16 text-sm text-red-500 dark:text-red-400">{error}</div>;
  }

  return (
    <div>
      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-px bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
        {[
          { label: "Total",       value: visitors.length },
          { label: "Uncontacted", value: newCount        },
          { label: "Follow-up",   value: followUpCount   },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white dark:bg-gray-800 px-4 py-4 text-center">
            <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5 truncate">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 px-4 sm:px-6 py-3 border-b border-gray-100 dark:border-gray-700">
        <input
          type="text"
          placeholder="Search name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[160px] px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-600"
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
          <option value="all">All</option>
          <option value="yes">Follow-up needed</option>
          <option value="no">No follow-up</option>
        </select>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            {visitors.length === 0 ? "No first-timer cards submitted yet." : "No results match your filters."}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile — card list (hidden on md+) */}
          <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700 p-4 space-y-3">
            {filtered.map((visitor) => (
              <VisitorCard
                key={visitor._id}
                visitor={visitor}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
              />
            ))}
          </div>

          {/* Desktop — table (hidden below md) */}
          <div className="hidden md:block overflow-x-auto">
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
        </>
      )}
    </div>
  );
};

export default VisitorsTab;
