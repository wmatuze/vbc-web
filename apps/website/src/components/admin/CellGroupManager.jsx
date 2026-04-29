import { useState, useRef } from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { useCellGroupsQuery } from "../../hooks/useCellGroupsQuery";
import { useZonesQuery } from "../../hooks/useZonesQuery";
import useErrorHandler from "../../hooks/useErrorHandler";
import MediaSelector from "../common/MediaSelector";
import { processMediaItem } from "../../utils/imageUtils";
import { getAuthToken } from "../../services/api/core";
import {
  createCellGroup, updateCellGroup, deleteCellGroup,
} from "../../services/api/cell-groups";
import {
  createZone, updateZone, deleteZone,
} from "../../services/api/zones";
import {
  PlusIcon, PencilIcon, TrashIcon, XMarkIcon,
  MagnifyingGlassIcon, MapPinIcon, UserIcon,
  UsersIcon, PhotoIcon, ArrowUpTrayIcon,
  CheckCircleIcon, ExclamationCircleIcon,
  ChevronDownIcon, ChevronRightIcon,
  ClockIcon, EnvelopeIcon, BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import config from "../../config";

const API_URL = config.API_URL;

const MEETING_DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const EMPTY_GROUP = {
  name: "", zone: "", location: "", leader: "", contact: "",
  meetingDay: "", meetingTime: "", capacity: "", description: "",
  tags: [], imageUrl: "", image: null,
};

const EMPTY_ZONE = {
  name: "", location: "", description: "",
  elder: { name: "", title: "Zone Elder", contact: "", phone: "" },
};

// ── Small helpers ────────────────────────────────────────────────────────────
const Section = ({ title, children, darkMode }) => (
  <div>
    <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 pb-2 border-b ${darkMode ? "text-gray-400 border-gray-700" : "text-gray-400 border-gray-100"}`}>
      {title}
    </h4>
    <div className="space-y-4">{children}</div>
  </div>
);

const Field = ({ label, required, error, hint, children, darkMode }) => (
  <div>
    <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    {!error && hint && <p className={`mt-1 text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{hint}</p>}
  </div>
);

const resolveUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  return `${API_URL}${url}`;
};

// ── Main component ───────────────────────────────────────────────────────────
const CellGroupManager = () => {
  const { darkMode } = useDarkMode();

  const { data: cellGroups = [], isLoading: cgLoading, refetch: refetchGroups } = useCellGroupsQuery();
  const { data: zones = [], isLoading: zonesLoading, refetch: refetchZones } = useZonesQuery();
  const { error, errorMessage, handleError, clearError, withErrorHandling } = useErrorHandler("CellGroupManager");

  const [searchTerm, setSearchTerm]           = useState("");
  const [expandedZones, setExpandedZones]     = useState({});
  const [successMessage, setSuccessMessage]   = useState("");

  // ── Cell group form ──
  const [showGroupPanel, setShowGroupPanel]   = useState(false);
  const [groupMode, setGroupMode]             = useState("add");
  const [currentGroup, setCurrentGroup]       = useState(EMPTY_GROUP);
  const [groupErrors, setGroupErrors]         = useState({});
  const [groupSubmitting, setGroupSubmitting] = useState(false);
  const [imageUploading, setImageUploading]   = useState(false);
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const fileInputRef = useRef(null);

  // ── Zone form ──
  const [showZonePanel, setShowZonePanel]     = useState(false);
  const [zoneMode, setZoneMode]               = useState("add");
  const [currentZone, setCurrentZone]         = useState(EMPTY_ZONE);
  const [zoneErrors, setZoneErrors]           = useState({});
  const [zoneSubmitting, setZoneSubmitting]   = useState(false);

  const flash = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 3500);
  };

  const toggleZone = (id) =>
    setExpandedZones((prev) => ({ ...prev, [id]: !prev[id] }));

  // ── Group helpers ────────────────────────────────────────────────────────
  const openAddGroup = (presetZoneId = "") => {
    setCurrentGroup({ ...EMPTY_GROUP, zone: presetZoneId });
    setGroupErrors({});
    setGroupMode("add");
    setShowGroupPanel(true);
  };

  const openEditGroup = (group) => {
    const zoneId = group.zone?._id || group.zone?.id || group.zone || "";
    setCurrentGroup({
      ...group,
      id: group._id || group.id,
      zone: zoneId.toString(),
      tags: Array.isArray(group.tags) ? group.tags : [],
      imageUrl: group.imageUrl || group.image?.path || "",
      image: group.image?._id || group.image?.id || group.image || null,
    });
    setGroupErrors({});
    setGroupMode("edit");
    setShowGroupPanel(true);
  };

  const handleGroupChange = (e) => {
    const { name, value } = e.target;
    setCurrentGroup((prev) => ({ ...prev, [name]: value }));
    if (groupErrors[name]) setGroupErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleTagsChange = (e) => {
    setCurrentGroup((prev) => ({
      ...prev,
      tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
    }));
  };

  const handleImageUpload = withErrorHandling(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      handleError(new Error("Image must be less than 10 MB"), "Upload");
      return;
    }
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", file.name.replace(/\.[^.]+$/, "") || "Cell group image");
      formData.append("category", "cell-groups");
      const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        body: formData,
      });
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      const data = await res.json();
      setCurrentGroup((prev) => ({ ...prev, imageUrl: data.path, image: data.id || data._id || null }));
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, { context: "Image Upload" });

  const handleMediaSelection = (item) => {
    if (item) {
      const p = processMediaItem(item);
      setCurrentGroup((prev) => ({ ...prev, imageUrl: p.path, image: p.id || null }));
    }
  };

  const validateGroup = () => {
    const errs = {};
    if (!currentGroup.name?.trim()) errs.name = "Group name is required";
    if (!currentGroup.zone) errs.zone = "Please assign this group to a zone";
    if (!currentGroup.location?.trim()) errs.location = "Location is required";
    if (!currentGroup.leader?.trim()) errs.leader = "Leader name is required";
    if (!currentGroup.meetingDay) errs.meetingDay = "Meeting day is required";
    if (!currentGroup.description?.trim()) errs.description = "Description is required";
    return errs;
  };

  const handleGroupSubmit = withErrorHandling(async (e) => {
    e.preventDefault();
    const errs = validateGroup();
    if (Object.keys(errs).length) { setGroupErrors(errs); return; }
    setGroupSubmitting(true);
    try {
      const payload = {
        name: currentGroup.name,
        zone: currentGroup.zone,
        location: currentGroup.location,
        leader: currentGroup.leader,
        contact: currentGroup.contact,
        meetingDay: currentGroup.meetingDay,
        meetingTime: currentGroup.meetingTime,
        capacity: currentGroup.capacity,
        description: currentGroup.description,
        tags: currentGroup.tags,
        imageUrl: currentGroup.imageUrl,
        image: currentGroup.image || undefined,
      };
      if (groupMode === "add") {
        await createCellGroup(payload);
        flash("Cell group created successfully!");
      } else {
        await updateCellGroup(currentGroup.id, payload);
        flash("Cell group updated successfully!");
      }
      await refetchGroups();
      setShowGroupPanel(false);
    } finally {
      setGroupSubmitting(false);
    }
  }, { context: "Cell Group Form" });

  const handleDeleteGroup = withErrorHandling(async (group) => {
    if (!window.confirm(`Delete "${group.name}"? This cannot be undone.`)) return;
    await deleteCellGroup(group._id || group.id);
    await refetchGroups();
    flash("Cell group deleted.");
  }, { context: "Cell Group Deletion" });

  // ── Zone helpers ─────────────────────────────────────────────────────────
  const openAddZone = () => {
    setCurrentZone(EMPTY_ZONE);
    setZoneErrors({});
    setZoneMode("add");
    setShowZonePanel(true);
  };

  const openEditZone = (zone) => {
    setCurrentZone({
      ...zone,
      id: zone._id || zone.id,
      elder: {
        name: zone.elder?.name || "",
        title: zone.elder?.title || "Zone Elder",
        contact: zone.elder?.contact || "",
        phone: zone.elder?.phone || "",
      },
    });
    setZoneErrors({});
    setZoneMode("edit");
    setShowZonePanel(true);
  };

  const handleZoneChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("elder.")) {
      const key = name.split(".")[1];
      setCurrentZone((prev) => ({ ...prev, elder: { ...prev.elder, [key]: value } }));
    } else {
      setCurrentZone((prev) => ({ ...prev, [name]: value }));
    }
    if (zoneErrors[name]) setZoneErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateZone = () => {
    const errs = {};
    if (!currentZone.name?.trim()) errs.name = "Zone name is required";
    if (!currentZone.location?.trim()) errs.location = "Location is required";
    if (!currentZone.elder?.name?.trim()) errs["elder.name"] = "Elder name is required";
    return errs;
  };

  const handleZoneSubmit = withErrorHandling(async (e) => {
    e.preventDefault();
    const errs = validateZone();
    if (Object.keys(errs).length) { setZoneErrors(errs); return; }
    setZoneSubmitting(true);
    try {
      if (zoneMode === "add") {
        await createZone(currentZone);
        flash("Zone created successfully!");
      } else {
        await updateZone(currentZone.id, currentZone);
        flash("Zone updated successfully!");
      }
      await refetchZones();
      setShowZonePanel(false);
    } finally {
      setZoneSubmitting(false);
    }
  }, { context: "Zone Form" });

  const handleDeleteZone = withErrorHandling(async (zone) => {
    const zoneId = zone._id || zone.id;
    const inZone = cellGroups.filter((g) => {
      const gZone = g.zone?._id || g.zone?.id || g.zone;
      return String(gZone) === String(zoneId);
    });
    if (inZone.length > 0) {
      handleError(
        new Error(`This zone has ${inZone.length} cell group${inZone.length > 1 ? "s" : ""}. Reassign or delete them first.`),
        "Zone Deletion"
      );
      return;
    }
    if (!window.confirm(`Delete zone "${zone.name}"? This cannot be undone.`)) return;
    await deleteZone(zoneId);
    await refetchZones();
    flash("Zone deleted.");
  }, { context: "Zone Deletion" });

  // ── Derived data ─────────────────────────────────────────────────────────
  const s = searchTerm.toLowerCase();
  const filteredGroups = s
    ? cellGroups.filter((g) =>
        g.name?.toLowerCase().includes(s) ||
        g.leader?.toLowerCase().includes(s) ||
        g.location?.toLowerCase().includes(s)
      )
    : cellGroups;

  const groupsByZone = (zoneId) =>
    filteredGroups.filter((g) => {
      const gZone = g.zone?._id || g.zone?.id || g.zone;
      return String(gZone) === String(zoneId);
    });

  const ungrouped = filteredGroups.filter((g) => !g.zone);

  // ── Shared input classes ─────────────────────────────────────────────────
  const inp = (err) =>
    `w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
      err ? "border-red-500" :
      darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
    }`;

  const sel = `w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
  }`;

  const btnOutline = `flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
    darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"
  }`;

  const isLoading = (cgLoading && cellGroups.length === 0) || (zonesLoading && zones.length === 0);

  return (
    <div className="relative">

      {/* ── Alerts ── */}
      {error && (
        <div className={`flex items-start gap-3 p-4 rounded-lg mb-5 border ${darkMode ? "bg-red-900/20 border-red-800 text-red-300" : "bg-red-50 border-red-200 text-red-700"}`}>
          <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">{errorMessage}</div>
          <button onClick={clearError} className="text-xs underline opacity-70 hover:opacity-100">Dismiss</button>
        </div>
      )}
      {successMessage && (
        <div className={`flex items-center gap-2 p-4 rounded-lg mb-5 border ${darkMode ? "bg-green-900/20 border-green-800 text-green-300" : "bg-green-50 border-green-200 text-green-700"}`}>
          <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm">{successMessage}</span>
        </div>
      )}

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search groups or leaders…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${inp(false)} pl-9`}
          />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => openAddGroup()} className={btnOutline}>
            <PlusIcon className="h-4 w-4" />
            Add Cell Group
          </button>
          <button onClick={openAddZone}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">
            <PlusIcon className="h-4 w-4" />
            Add Zone
          </button>
        </div>
      </div>

      {/* ── Loading skeleton ── */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className={`rounded-xl border p-4 animate-pulse ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-100 bg-gray-50"}`}>
              <div className={`h-5 w-48 rounded mb-3 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className={`h-28 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : zones.length === 0 ? (
        /* ── Empty state ── */
        <div className={`text-center py-20 rounded-xl border ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
          <BuildingOfficeIcon className={`mx-auto h-12 w-12 mb-4 ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
          <p className={`text-base font-semibold mb-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>No zones yet</p>
          <p className={`text-sm mb-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Create your first zone, then add cell groups to it.</p>
          <button onClick={openAddZone}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            <PlusIcon className="h-4 w-4" />
            Create First Zone
          </button>
        </div>
      ) : (
        /* ── Zone sections ── */
        <div className="space-y-4">
          {zones.map((zone) => {
            const zoneId = zone._id || zone.id;
            const groups = groupsByZone(zoneId);
            const isOpen = expandedZones[zoneId] !== false; // open by default

            return (
              <div key={zoneId} className={`rounded-xl border overflow-hidden ${darkMode ? "border-gray-700" : "border-gray-200"}`}>

                {/* Zone header */}
                <div className={`flex items-center gap-3 px-5 py-4 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                  <button onClick={() => toggleZone(zoneId)} className={`flex-shrink-0 p-1 rounded transition-colors ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
                    {isOpen
                      ? <ChevronDownIcon className={`h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                      : <ChevronRightIcon className={`h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className={`text-base font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {zone.name}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${darkMode ? "bg-blue-900/40 text-blue-300" : "bg-blue-100 text-blue-700"}`}>
                        {groups.length} {groups.length === 1 ? "group" : "groups"}
                      </span>
                    </div>
                    <div className={`flex items-center gap-4 mt-1 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {zone.location && (
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="h-3.5 w-3.5" />{zone.location}
                        </span>
                      )}
                      {zone.elder?.name && (
                        <span className="flex items-center gap-1">
                          <UserIcon className="h-3.5 w-3.5" />Elder: {zone.elder.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => openAddGroup(zoneId.toString())}
                      title="Add cell group to this zone"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${darkMode ? "bg-blue-900/30 text-blue-300 hover:bg-blue-900/50" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}>
                      <PlusIcon className="h-3.5 w-3.5" />
                      Add Group
                    </button>
                    <button onClick={() => openEditZone(zone)} title="Edit zone"
                      className={`p-2 rounded-lg transition-colors ${darkMode ? "text-gray-400 hover:bg-gray-700" : "text-gray-400 hover:bg-gray-200"}`}>
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDeleteZone(zone)} title="Delete zone"
                      className={`p-2 rounded-lg transition-colors ${darkMode ? "text-red-400 hover:bg-red-900/30" : "text-red-400 hover:bg-red-50"}`}>
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Cell groups grid */}
                {isOpen && (
                  <div className={`p-4 ${darkMode ? "bg-gray-900/50" : "bg-white"}`}>
                    {groups.length === 0 ? (
                      <div className={`text-center py-8 rounded-lg border border-dashed ${darkMode ? "border-gray-700 text-gray-500" : "border-gray-200 text-gray-400"}`}>
                        <UsersIcon className="mx-auto h-8 w-8 mb-2 opacity-40" />
                        <p className="text-sm">No cell groups in this zone yet.</p>
                        <button onClick={() => openAddGroup(zoneId.toString())}
                          className="mt-2 text-sm text-blue-500 hover:underline inline-flex items-center gap-1">
                          <PlusIcon className="h-3.5 w-3.5" />Add one
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groups.map((group) => (
                          <CellGroupCard
                            key={group._id || group.id}
                            group={group}
                            darkMode={darkMode}
                            onEdit={() => openEditGroup(group)}
                            onDelete={() => handleDeleteGroup(group)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Ungrouped cell groups */}
          {ungrouped.length > 0 && (
            <div className={`rounded-xl border overflow-hidden ${darkMode ? "border-yellow-800/40" : "border-yellow-200"}`}>
              <div className={`flex items-center justify-between px-5 py-3 ${darkMode ? "bg-yellow-900/20" : "bg-yellow-50"}`}>
                <div>
                  <span className={`text-sm font-semibold ${darkMode ? "text-yellow-300" : "text-yellow-700"}`}>Ungrouped Cell Groups</span>
                  <p className={`text-xs mt-0.5 ${darkMode ? "text-yellow-400/70" : "text-yellow-600/70"}`}>These groups are not assigned to any zone.</p>
                </div>
              </div>
              <div className={`p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${darkMode ? "bg-gray-900/50" : "bg-white"}`}>
                {ungrouped.map((group) => (
                  <CellGroupCard
                    key={group._id || group.id}
                    group={group}
                    darkMode={darkMode}
                    onEdit={() => openEditGroup(group)}
                    onDelete={() => handleDeleteGroup(group)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Cell Group slide-over ── */}
      {showGroupPanel && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowGroupPanel(false)} />
          <div className={`fixed top-0 right-0 h-full w-full max-w-xl z-50 flex flex-col shadow-2xl ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>

            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b flex-shrink-0 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              <div>
                <h3 className={`text-base font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {groupMode === "add" ? "Add Cell Group" : "Edit Cell Group"}
                </h3>
                <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Fill in the details below</p>
              </div>
              <button onClick={() => setShowGroupPanel(false)} className={`p-1.5 rounded-lg transition-colors ${darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-400"}`}>
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleGroupSubmit} className="flex-1 overflow-y-auto">
              <div className="px-6 py-5 space-y-7">

                {/* Image */}
                <Section title="Group Photo" darkMode={darkMode}>
                  <div className="flex items-start gap-5">
                    <div className={`flex-shrink-0 w-40 h-28 rounded-xl overflow-hidden border-2 ${darkMode ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-gray-100"}`}>
                      {currentGroup.imageUrl ? (
                        <img src={resolveUrl(currentGroup.imageUrl)} alt="Preview" className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = "none"; }} />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center ${darkMode ? "text-gray-600" : "text-gray-300"}`}>
                          <PhotoIcon className="h-10 w-10" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 pt-1">
                      <button type="button" onClick={() => fileInputRef.current?.click()} disabled={imageUploading}
                        className={`${btnOutline} disabled:opacity-50`}>
                        {imageUploading
                          ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                          : <ArrowUpTrayIcon className="h-4 w-4" />}
                        {imageUploading ? "Uploading…" : "Upload Photo"}
                      </button>
                      <button type="button" onClick={() => setIsMediaSelectorOpen(true)} className={btnOutline}>
                        <PhotoIcon className="h-4 w-4" />
                        Browse Library
                      </button>
                      {currentGroup.imageUrl && (
                        <button type="button"
                          onClick={() => setCurrentGroup((p) => ({ ...p, imageUrl: "", image: null }))}
                          className="text-xs text-red-400 hover:text-red-600 text-left transition-colors">
                          Remove photo
                        </button>
                      )}
                      <p className={`text-xs leading-relaxed ${darkMode ? "text-gray-500" : "text-gray-400"}`}>JPG, PNG, WebP<br/>Max 10 MB</p>
                    </div>
                  </div>
                </Section>

                {/* Basic Info */}
                <Section title="Basic Info" darkMode={darkMode}>
                  <Field label="Group Name" required error={groupErrors.name} darkMode={darkMode}>
                    <input name="name" type="text" value={currentGroup.name} onChange={handleGroupChange}
                      placeholder="e.g. Riverside Cell" className={inp(groupErrors.name)} />
                  </Field>

                  <Field label="Zone" required error={groupErrors.zone} darkMode={darkMode}>
                    <select name="zone" value={currentGroup.zone} onChange={handleGroupChange}
                      className={groupErrors.zone ? inp(true) : sel}>
                      <option value="">Select a zone…</option>
                      {zones.map((z) => (
                        <option key={z._id || z.id} value={z._id || z.id}>{z.name}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Location" required error={groupErrors.location} darkMode={darkMode}>
                    <input name="location" type="text" value={currentGroup.location} onChange={handleGroupChange}
                      placeholder="Neighbourhood or address" className={inp(groupErrors.location)} />
                  </Field>

                  <Field label="Description" required error={groupErrors.description} darkMode={darkMode}>
                    <textarea name="description" value={currentGroup.description} onChange={handleGroupChange}
                      rows={3} placeholder="What does this group focus on?" className={inp(groupErrors.description)} />
                  </Field>
                </Section>

                {/* Leader */}
                <Section title="Cell Group Leader" darkMode={darkMode}>
                  <Field label="Leader Name" required error={groupErrors.leader} darkMode={darkMode}>
                    <input name="leader" type="text" value={currentGroup.leader} onChange={handleGroupChange}
                      placeholder="Full name" className={inp(groupErrors.leader)} />
                  </Field>
                  <Field label="Contact Email" error={groupErrors.contact} darkMode={darkMode}>
                    <input name="contact" type="email" value={currentGroup.contact} onChange={handleGroupChange}
                      placeholder="leader@church.org" className={inp(groupErrors.contact)} />
                  </Field>
                </Section>

                {/* Schedule */}
                <Section title="Meeting Schedule" darkMode={darkMode}>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Day" required error={groupErrors.meetingDay} darkMode={darkMode}>
                      <select name="meetingDay" value={currentGroup.meetingDay} onChange={handleGroupChange}
                        className={groupErrors.meetingDay ? inp(true) : sel}>
                        <option value="">Select day…</option>
                        {MEETING_DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </Field>
                    <Field label="Time" hint="e.g. 6:30 PM" darkMode={darkMode}>
                      <input name="meetingTime" type="text" value={currentGroup.meetingTime} onChange={handleGroupChange}
                        placeholder="6:30 PM" className={inp(false)} />
                    </Field>
                  </div>
                  <Field label="Capacity" hint="e.g. 15–20 people" darkMode={darkMode}>
                    <input name="capacity" type="text" value={currentGroup.capacity} onChange={handleGroupChange}
                      placeholder="Max members" className={inp(false)} />
                  </Field>
                </Section>

                {/* Tags */}
                <Section title="Tags" darkMode={darkMode}>
                  <Field label="Tags" hint="Comma-separated — e.g. Young Adults, Prayer, Bible Study" darkMode={darkMode}>
                    <input type="text" value={currentGroup.tags?.join(", ") || ""}
                      onChange={handleTagsChange} placeholder="Young Adults, Prayer…" className={inp(false)} />
                  </Field>
                </Section>

              </div>

              {/* Footer */}
              <div className={`flex justify-end gap-3 px-6 py-4 border-t flex-shrink-0 sticky bottom-0 ${darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"}`}>
                <button type="button" onClick={() => setShowGroupPanel(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                  Cancel
                </button>
                <button type="submit" disabled={groupSubmitting}
                  className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors inline-flex items-center gap-2">
                  {groupSubmitting && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                  {groupSubmitting ? "Saving…" : groupMode === "add" ? "Create Group" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* ── Zone slide-over ── */}
      {showZonePanel && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowZonePanel(false)} />
          <div className={`fixed top-0 right-0 h-full w-full max-w-lg z-50 flex flex-col shadow-2xl ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>

            <div className={`flex items-center justify-between px-6 py-4 border-b flex-shrink-0 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              <div>
                <h3 className={`text-base font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {zoneMode === "add" ? "Create Zone" : "Edit Zone"}
                </h3>
                <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Zones group related cell groups together</p>
              </div>
              <button onClick={() => setShowZonePanel(false)} className={`p-1.5 rounded-lg transition-colors ${darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-400"}`}>
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleZoneSubmit} className="flex-1 overflow-y-auto">
              <div className="px-6 py-5 space-y-7">

                <Section title="Zone Details" darkMode={darkMode}>
                  <Field label="Zone Name" required error={zoneErrors.name} darkMode={darkMode}>
                    <input name="name" type="text" value={currentZone.name} onChange={handleZoneChange}
                      placeholder="e.g. North Zone" className={inp(zoneErrors.name)} />
                  </Field>
                  <Field label="Location / Area" required error={zoneErrors.location} darkMode={darkMode}>
                    <input name="location" type="text" value={currentZone.location} onChange={handleZoneChange}
                      placeholder="e.g. Northmead, Lusaka" className={inp(zoneErrors.location)} />
                  </Field>
                  <Field label="Description" darkMode={darkMode}>
                    <textarea name="description" value={currentZone.description} onChange={handleZoneChange}
                      rows={3} placeholder="Brief description of this zone…" className={inp(false)} />
                  </Field>
                </Section>

                <Section title="Zone Elder" darkMode={darkMode}>
                  <Field label="Elder's Name" required error={zoneErrors["elder.name"]} darkMode={darkMode}>
                    <input name="elder.name" type="text" value={currentZone.elder.name} onChange={handleZoneChange}
                      placeholder="Full name" className={inp(zoneErrors["elder.name"])} />
                  </Field>
                  <Field label="Title" darkMode={darkMode}>
                    <input name="elder.title" type="text" value={currentZone.elder.title} onChange={handleZoneChange}
                      placeholder="Zone Elder" className={inp(false)} />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Email" darkMode={darkMode}>
                      <input name="elder.contact" type="email" value={currentZone.elder.contact} onChange={handleZoneChange}
                        placeholder="elder@church.org" className={inp(false)} />
                    </Field>
                    <Field label="Phone" darkMode={darkMode}>
                      <input name="elder.phone" type="text" value={currentZone.elder.phone} onChange={handleZoneChange}
                        placeholder="+260 97…" className={inp(false)} />
                    </Field>
                  </div>
                </Section>

              </div>

              <div className={`flex justify-end gap-3 px-6 py-4 border-t flex-shrink-0 sticky bottom-0 ${darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"}`}>
                <button type="button" onClick={() => setShowZonePanel(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                  Cancel
                </button>
                <button type="submit" disabled={zoneSubmitting}
                  className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors inline-flex items-center gap-2">
                  {zoneSubmitting && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                  {zoneSubmitting ? "Saving…" : zoneMode === "add" ? "Create Zone" : "Save Zone"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Hidden file input + MediaSelector */}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
      <MediaSelector
        isOpen={isMediaSelectorOpen}
        onClose={() => setIsMediaSelectorOpen(false)}
        onSelect={handleMediaSelection}
      />
    </div>
  );
};

// ── Cell Group Card ──────────────────────────────────────────────────────────
const CellGroupCard = ({ group, darkMode, onEdit, onDelete }) => {
  const thumb = group.imageUrl
    ? (group.imageUrl.startsWith("http") ? group.imageUrl : `${API_URL}${group.imageUrl}`)
    : (group.image?.path
        ? (group.image.path.startsWith("http") ? group.image.path : `${API_URL}${group.image.path}`)
        : null);

  return (
    <div className={`rounded-xl border overflow-hidden transition-shadow hover:shadow-md ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
      {/* Photo or colour bar */}
      <div className={`h-32 relative ${!thumb ? (darkMode ? "bg-gradient-to-br from-blue-900/40 to-indigo-900/40" : "bg-gradient-to-br from-blue-50 to-indigo-50") : ""}`}>
        {thumb ? (
          <img src={thumb} alt={group.name} className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = "none"; }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UsersIcon className={`h-10 w-10 ${darkMode ? "text-blue-700" : "text-blue-200"}`} />
          </div>
        )}
        {/* Action buttons overlay */}
        <div className="absolute top-2 right-2 flex gap-1">
          <button onClick={onEdit} title="Edit"
            className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors">
            <PencilIcon className="h-3.5 w-3.5" />
          </button>
          <button onClick={onDelete} title="Delete"
            className="p-1.5 rounded-lg bg-black/40 hover:bg-red-600/80 text-white backdrop-blur-sm transition-colors">
            <TrashIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <p className={`text-sm font-semibold leading-tight ${darkMode ? "text-white" : "text-gray-900"}`}>{group.name}</p>

        {group.leader && (
          <div className={`flex items-center gap-1.5 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            <UserIcon className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{group.leader}</span>
          </div>
        )}
        {group.location && (
          <div className={`flex items-center gap-1.5 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{group.location}</span>
          </div>
        )}
        {(group.meetingDay || group.meetingTime) && (
          <div className={`flex items-center gap-1.5 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            <ClockIcon className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{group.meetingDay}{group.meetingTime ? ` · ${group.meetingTime}` : ""}</span>
          </div>
        )}

        {group.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {group.tags.slice(0, 3).map((tag) => (
              <span key={tag} className={`px-1.5 py-0.5 rounded text-xs ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>{tag}</span>
            ))}
            {group.tags.length > 3 && (
              <span className={`px-1.5 py-0.5 rounded text-xs ${darkMode ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-400"}`}>+{group.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CellGroupManager;
