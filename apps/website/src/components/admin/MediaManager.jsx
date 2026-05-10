import React, { useState, useEffect, useCallback, useRef } from "react";
import { uploadFile } from "../../services/api/media";
import { getAuthToken } from "../../services/api/core";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { validateMedia, mediaValidationRules } from "../../utils/mediaValidation";
import { validateField } from "../../utils/validationUtils";
import {
  Squares2X2Icon as ViewGridIcon,
  ListBulletIcon as ViewListIcon,
  ArrowUpTrayIcon as UploadIcon,
  TrashIcon,
  DocumentDuplicateIcon as DuplicateIcon,
  EyeIcon,
  ArrowPathIcon as RefreshIcon,
  XMarkIcon as XIcon,
  MagnifyingGlassIcon as SearchIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import config from "../../config";
import placeholderImage from "../../assets/placeholders/default-image.svg";

const API_URL = config.API_URL;

const CATEGORIES = [
  { value: "general",    label: "General" },
  { value: "sermon",     label: "Sermons" },
  { value: "event",      label: "Events" },
  { value: "leadership", label: "Leadership" },
  { value: "cell-group", label: "Cell Groups" },
  { value: "banner",     label: "Banners" },
  { value: "gallery",    label: "Gallery" },
];

const formatBytes = (bytes) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const MediaManager = () => {
  const { data: mediaData = [], isLoading, error: fetchError, refetch } = useMediaQuery();

  const [searchTerm,       setSearchTerm]       = useState("");
  const [filterCategory,   setFilterCategory]   = useState("all");
  const [viewMode,         setViewMode]         = useState("grid");
  const [deleteConfirmId,  setDeleteConfirmId]  = useState(null);
  const [deleteError,      setDeleteError]      = useState(null);
  const [isDeleting,       setIsDeleting]       = useState(false);
  const [selectedMedia,    setSelectedMedia]    = useState(null);
  const [showUploadModal,  setShowUploadModal]  = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Usage map: { [mediaId]: [{type, name}] }
  const [usageMap, setUsageMap] = useState({});

  // Upload queue: [{ id, file, title, category, status, progress, error, previewUrl }]
  const [uploadQueue, setUploadQueue] = useState([]);
  const [uploadError,  setUploadError]  = useState(null);
  const [isDragging,   setIsDragging]   = useState(false);

  const fileInputRef = useRef(null);

  // ── Derived values ─────────────────────────────────────────────────────────
  const validMedia = Array.isArray(mediaData)
    ? mediaData.filter(item => item && item.id && (item.path || item.filename))
    : [];

  const filteredMedia = validMedia.filter(item => {
    if (filterCategory !== "all" && item.category !== filterCategory) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      return item.title?.toLowerCase().includes(s)
          || item.filename?.toLowerCase().includes(s)
          || item.category?.toLowerCase().includes(s);
    }
    return true;
  });

  const totalStorage  = validMedia.reduce((sum, item) => sum + (item.size || 0), 0);
  const usedCount     = validMedia.filter(item => (usageMap[item.id] || []).length > 0).length;
  const orphanCount   = validMedia.length - usedCount;

  const isUploading   = uploadQueue.some(i => i.status === "uploading");
  const pendingCount  = uploadQueue.filter(i => i.status === "pending").length;
  const allDone       = uploadQueue.length > 0 && uploadQueue.every(i => i.status === "done" || i.status === "error");

  // ── Fetch usage map ────────────────────────────────────────────────────────
  const fetchUsage = useCallback(async () => {
    try {
      const token = getAuthToken();
      const res = await fetch("/api/media/usage", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setUsageMap(json.data || {});
      }
    } catch (err) {
      console.warn("Could not fetch media usage:", err);
    }
  }, []);

  useEffect(() => { fetchUsage(); }, [fetchUsage]);

  // ── Media URL helper ───────────────────────────────────────────────────────
  const getMediaUrl = useCallback((item) => {
    if (!item) return "";
    if (item.localUrl) return item.localUrl;
    if (item.fileUrl?.startsWith("http")) return item.fileUrl;
    if (item.path) return item.path.startsWith("http") ? item.path : `${API_URL}${item.path}`;
    if (item.filename) return `${API_URL}/uploads/${item.filename}`;
    return "";
  }, []);

  // ── Drag and drop ──────────────────────────────────────────────────────────
  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop      = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) addFilesToQueue(e.dataTransfer.files);
  };

  // ── Queue management ───────────────────────────────────────────────────────
  const addFilesToQueue = (fileList) => {
    const items = Array.from(fileList).map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      title: file.name.split(".").slice(0, -1).join(".") || file.name,
      category: "general",
      status: "pending",
      progress: 0,
      error: null,
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
    }));
    setUploadQueue(prev => [...prev, ...items]);
    setUploadError(null);
  };

  const removeFromQueue = (id) => {
    setUploadQueue(prev => {
      const item = prev.find(i => i.id === id);
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      return prev.filter(i => i.id !== id);
    });
  };

  const updateQueueItem = (id, updates) =>
    setUploadQueue(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));

  // ── Upload ─────────────────────────────────────────────────────────────────
  const handleUploadAll = async () => {
    const pending = uploadQueue.filter(i => i.status === "pending");
    if (!pending.length) return;
    setUploadError(null);

    for (const item of pending) {
      // Validate
      const { isValid, errors } = validateMedia({ file: item.file, title: item.title, category: item.category });
      if (!isValid) {
        updateQueueItem(item.id, { status: "error", error: Object.values(errors)[0] });
        continue;
      }

      updateQueueItem(item.id, { status: "uploading", progress: 0 });
      try {
        await uploadFile(item.file, item.title, item.category, (progress) => {
          const pct = typeof progress?.percent === "number"
            ? progress.percent
            : progress?.total ? Math.round((progress.loaded / progress.total) * 100) : 0;
          updateQueueItem(item.id, { progress: pct });
        });
        updateQueueItem(item.id, { status: "done", progress: 100 });
      } catch (err) {
        updateQueueItem(item.id, { status: "error", error: err.message });
      }
    }

    refetch();
    fetchUsage();
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setDeleteConfirmId(null);
    setDeleteError(null);
    setIsDeleting(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`/api/media/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      if (selectedMedia?.id === id) setShowPreviewModal(false);
      refetch();
      fetchUsage();
    } catch (err) {
      setDeleteError(`Failed to delete: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Copy URL ───────────────────────────────────────────────────────────────
  const copyUrl = (url) => {
    navigator.clipboard.writeText(url).catch(console.error);
    const el = document.createElement("div");
    el.className = "fixed bottom-4 right-4 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg z-[60] pointer-events-none";
    el.textContent = "URL copied to clipboard";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    uploadQueue.forEach(i => { if (i.previewUrl) URL.revokeObjectURL(i.previewUrl); });
    setUploadQueue([]);
    setUploadError(null);
    setIsDragging(false);
  };

  // ── Usage badge helper ─────────────────────────────────────────────────────
  const UsageBadge = ({ id }) => {
    const refs = usageMap[id] || [];
    if (!refs.length) return null;
    return (
      <span className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
        <LinkIcon className="h-3 w-3" />
        {refs.length}
      </span>
    );
  };

  // ── Delete confirmation overlay (grid card) ────────────────────────────────
  const DeleteOverlay = ({ item }) => {
    const refs = usageMap[item.id] || [];
    return (
      <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2 p-3">
        {refs.length > 0 && (
          <>
            <ExclamationCircleIcon className="h-5 w-5 text-amber-400" />
            <p className="text-amber-300 text-xs font-semibold text-center">
              Used in {refs.length} place{refs.length > 1 ? "s" : ""}
            </p>
            <p className="text-gray-300 text-xs text-center leading-tight">
              {refs.slice(0, 2).map(r => r.name).join(", ")}
              {refs.length > 2 ? ` +${refs.length - 2} more` : ""}
            </p>
            <p className="text-white text-xs text-center">Deleting may break pages.</p>
          </>
        )}
        {refs.length === 0 && <p className="text-white text-xs font-medium">Delete this image?</p>}
        <div className="flex gap-2 mt-1">
          <button onClick={() => handleDelete(item.id)} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md font-medium transition-colors">Delete</button>
          <button onClick={() => setDeleteConfirmId(null)} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded-md transition-colors">Cancel</button>
        </div>
      </div>
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Media Library</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => { refetch(); fetchUsage(); }}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-md transition-colors" title="Refresh">
            <RefreshIcon className="h-5 w-5" />
          </button>
          <button onClick={() => setViewMode(v => v === "grid" ? "list" : "grid")}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-md transition-colors" title="Toggle view">
            {viewMode === "grid" ? <ViewListIcon className="h-5 w-5" /> : <ViewGridIcon className="h-5 w-5" />}
          </button>
          <button onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            <UploadIcon className="h-4 w-4" /> Upload Media
          </button>
        </div>
      </div>

      {/* Storage stats bar */}
      {validMedia.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Files",    value: validMedia.length },
            { label: "Storage Used",   value: formatBytes(totalStorage) },
            { label: "In Use",         value: usedCount,    note: "linked to content" },
            { label: "Orphaned",       value: orphanCount,  note: "not used anywhere",
              warn: orphanCount > 0 },
          ].map(({ label, value, note, warn }) => (
            <div key={label} className={`bg-white dark:bg-gray-800 rounded-lg border p-4 ${warn && orphanCount > 0 ? "border-amber-200 dark:border-amber-800" : "border-gray-200 dark:border-gray-700"}`}>
              <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
              <p className={`text-xl font-bold mt-0.5 ${warn && orphanCount > 0 ? "text-amber-600 dark:text-amber-400" : "text-gray-900 dark:text-white"}`}>
                {value}
              </p>
              {note && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{note}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Error banner */}
      {(fetchError || deleteError) && (
        <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <ExclamationCircleIcon className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-300 flex-1">
            {deleteError || fetchError?.message || "Failed to load media"}
          </p>
          <button onClick={() => setDeleteError(null)} className="text-red-400 hover:text-red-600 shrink-0">
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Search + filter */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[180px] relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Search media…" value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {filteredMedia.length} {filteredMedia.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600" />
        </div>

      ) : filteredMedia.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 gap-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">No media items found</p>
          {(searchTerm || filterCategory !== "all")
            ? <button onClick={() => { setSearchTerm(""); setFilterCategory("all"); }} className="text-sm text-red-600 hover:underline">Clear filters</button>
            : <button onClick={() => setShowUploadModal(true)} className="text-sm text-red-600 hover:underline">Upload your first file</button>}
        </div>

      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredMedia.map(item => {
            const refs = usageMap[item.id] || [];
            return (
              <div key={item.id} className="relative group rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow">
                <div className="relative pb-[75%] bg-gray-200 dark:bg-gray-600">
                  <img src={getMediaUrl(item)} alt={item.title || item.filename}
                    className="absolute inset-0 w-full h-full object-cover" loading="lazy"
                    onError={e => { e.target.src = placeholderImage; }} />
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{item.title || item.filename}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{item.category || "general"}</p>
                </div>

                {/* Usage indicator */}
                <UsageBadge id={item.id} />

                {/* Overlay */}
                {deleteConfirmId === item.id
                  ? <DeleteOverlay item={item} />
                  : (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setSelectedMedia(item); setShowPreviewModal(true); }} className="p-1 bg-black/60 hover:bg-black/80 rounded text-white" title="Preview"><EyeIcon className="h-4 w-4" /></button>
                      <button onClick={() => copyUrl(getMediaUrl(item))} className="p-1 bg-black/60 hover:bg-black/80 rounded text-white" title="Copy URL"><DuplicateIcon className="h-4 w-4" /></button>
                      <button onClick={() => setDeleteConfirmId(item.id)}
                        className={`p-1 rounded text-white ${refs.length ? "bg-amber-500/80 hover:bg-amber-600" : "bg-black/60 hover:bg-red-600"}`}
                        title={refs.length ? `In use (${refs.length} places)` : "Delete"}>
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )
                }
              </div>
            );
          })}
        </div>

      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/40">
                <tr>
                  {["Preview", "Title", "Category", "Size", "Used in", "Actions"].map(h => (
                    <th key={h} className={`px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMedia.map(item => {
                  const refs = usageMap[item.id] || [];
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="h-12 w-12 rounded overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
                          <img src={getMediaUrl(item)} alt="" className="h-full w-full object-cover" loading="lazy" onError={e => { e.target.src = placeholderImage; }} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white max-w-[160px]">
                        <p className="truncate">{item.title || item.filename}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize">{item.category || "general"}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatBytes(item.size)}</td>
                      <td className="px-4 py-3">
                        {refs.length > 0 ? (
                          <span className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400" title={refs.map(r => `${r.type}: ${r.name}`).join(", ")}>
                            <LinkIcon className="h-3.5 w-3.5 text-green-500" />{refs.length} place{refs.length > 1 ? "s" : ""}
                          </span>
                        ) : (
                          <span className="text-xs text-amber-500">Unused</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {deleteConfirmId === item.id ? (
                          <span className="inline-flex items-center gap-2">
                            {refs.length > 0 && <span className="text-xs text-amber-600 dark:text-amber-400">In use — still delete?</span>}
                            {refs.length === 0 && <span className="text-xs text-gray-600 dark:text-gray-400">Delete?</span>}
                            <button onClick={() => handleDelete(item.id)} className="px-2 py-1 bg-red-600 text-white text-xs rounded font-medium">Yes</button>
                            <button onClick={() => setDeleteConfirmId(null)} className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded">No</button>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-3">
                            <button onClick={() => { setSelectedMedia(item); setShowPreviewModal(true); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"><EyeIcon className="h-5 w-5" /></button>
                            <button onClick={() => copyUrl(getMediaUrl(item))} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"><DuplicateIcon className="h-5 w-5" /></button>
                            <button onClick={() => setDeleteConfirmId(item.id)}
                              className={`transition-colors ${refs.length ? "text-amber-500 hover:text-red-600" : "text-gray-400 hover:text-red-600"}`}
                              title={refs.length ? `Used in ${refs.length} place${refs.length > 1 ? "s" : ""}` : "Delete"}>
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Upload Modal ── */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">

            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 shrink-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Media</h3>
              <button onClick={closeUploadModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><XIcon className="h-5 w-5" /></button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1">

              {/* Drop zone — always visible so they can add more */}
              <div
                onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragging ? "border-red-500 bg-red-50 dark:bg-red-900/10" : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"}`}>
                <UploadIcon className="mx-auto h-8 w-8 text-gray-400 mb-1" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-red-600 font-medium">Click to select</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Select multiple files — PNG, JPG, GIF up to 5MB each</p>
                <input ref={fileInputRef} type="file" className="sr-only" accept="image/*" multiple
                  onChange={e => { if (e.target.files?.length) { addFilesToQueue(e.target.files); e.target.value = ""; } }} />
              </div>

              {uploadError && <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>}

              {/* Upload queue */}
              {uploadQueue.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">{uploadQueue.length} file{uploadQueue.length > 1 ? "s" : ""} queued</p>
                    {uploadQueue.some(i => i.status === "pending") && (
                      <button onClick={() => setUploadQueue([])} className="text-xs text-gray-400 hover:text-red-500 transition-colors">Clear all</button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                    {uploadQueue.map(item => (
                      <div key={item.id} className={`flex items-center gap-3 p-2 rounded-lg border ${
                        item.status === "done"     ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" :
                        item.status === "error"    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" :
                        item.status === "uploading"? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" :
                        "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"}`}>

                        {/* Thumbnail */}
                        <div className="h-10 w-10 rounded overflow-hidden bg-gray-200 dark:bg-gray-600 shrink-0">
                          {item.previewUrl
                            ? <img src={item.previewUrl} alt="" className="h-full w-full object-cover" />
                            : <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">file</div>}
                        </div>

                        {/* Title + category */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <input
                            value={item.title}
                            onChange={e => updateQueueItem(item.id, { title: e.target.value })}
                            disabled={item.status !== "pending"}
                            className="w-full text-xs px-2 py-1 border border-gray-300 dark:border-gray-500 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
                            placeholder="Title"
                          />
                          <select
                            value={item.category}
                            onChange={e => updateQueueItem(item.id, { category: e.target.value })}
                            disabled={item.status !== "pending"}
                            className="w-full text-xs px-2 py-1 border border-gray-300 dark:border-gray-500 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
                          >
                            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                          </select>
                        </div>

                        {/* Status */}
                        <div className="shrink-0 w-16 text-right">
                          {item.status === "done"      && <CheckCircleIcon className="h-5 w-5 text-green-500 ml-auto" />}
                          {item.status === "error"     && <span className="text-xs text-red-500" title={item.error}>Failed</span>}
                          {item.status === "uploading" && (
                            <div className="space-y-1">
                              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                                <div className="bg-red-600 h-1 rounded-full transition-all" style={{ width: `${item.progress}%` }} />
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{item.progress}%</span>
                            </div>
                          )}
                          {item.status === "pending" && (
                            <button onClick={() => removeFromQueue(item.id)} className="text-gray-400 hover:text-red-500 ml-auto block transition-colors">
                              <XIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {allDone && (
                    <p className="text-sm text-center text-green-600 dark:text-green-400 font-medium">
                      {uploadQueue.filter(i => i.status === "done").length} uploaded
                      {uploadQueue.some(i => i.status === "error") && `, ${uploadQueue.filter(i => i.status === "error").length} failed`}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
              <button onClick={closeUploadModal} className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                {allDone ? "Close" : "Cancel"}
              </button>
              {!allDone && (
                <button onClick={handleUploadAll} disabled={isUploading || pendingCount === 0}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-md font-medium transition-colors">
                  {isUploading
                    ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /><span>Uploading…</span></>
                    : <><UploadIcon className="h-4 w-4" /><span>Upload {pendingCount > 0 ? `${pendingCount} file${pendingCount > 1 ? "s" : ""}` : ""}</span></>}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Preview Modal ── */}
      {showPreviewModal && selectedMedia && (() => {
        const refs = usageMap[selectedMedia.id] || [];
        return (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={() => { setShowPreviewModal(false); setDeleteConfirmId(null); }}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full overflow-hidden"
              onClick={e => e.stopPropagation()}>

              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate pr-4">{selectedMedia.title || selectedMedia.filename}</h3>
                <button onClick={() => { setShowPreviewModal(false); setDeleteConfirmId(null); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shrink-0"><XIcon className="h-5 w-5" /></button>
              </div>

              <img src={getMediaUrl(selectedMedia)} alt={selectedMedia.title}
                className="w-full max-h-80 object-contain bg-gray-100 dark:bg-gray-900"
                onError={e => { e.target.src = placeholderImage; }} />

              <div className="px-5 py-4 space-y-3">
                <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="capitalize bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{selectedMedia.category || "general"}</span>
                  {selectedMedia.size && <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{formatBytes(selectedMedia.size)}</span>}
                </div>

                {/* Usage context */}
                {refs.length > 0 ? (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2">
                    <p className="text-xs font-medium text-green-800 dark:text-green-300 mb-1 flex items-center gap-1">
                      <LinkIcon className="h-3.5 w-3.5" /> Used in {refs.length} place{refs.length > 1 ? "s" : ""}
                    </p>
                    <ul className="space-y-0.5">
                      {refs.map((r, i) => (
                        <li key={i} className="text-xs text-green-700 dark:text-green-400">
                          <span className="font-medium">{r.type}:</span> {r.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
                    <p className="text-xs text-amber-700 dark:text-amber-400">This image is not linked to any content and can be safely deleted.</p>
                  </div>
                )}

                <p className="text-xs font-mono text-gray-400 dark:text-gray-500 truncate">{getMediaUrl(selectedMedia)}</p>

                <div className="flex items-center justify-between pt-1">
                  <button onClick={() => copyUrl(getMediaUrl(selectedMedia))}
                    className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md transition-colors">
                    <DuplicateIcon className="h-3.5 w-3.5" /> Copy URL
                  </button>
                  {isDeleting ? (
                    <span className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                      Deleting…
                    </span>
                  ) : deleteConfirmId === selectedMedia.id ? (
                    <span className="inline-flex items-center gap-2">
                      {refs.length > 0 && <span className="text-xs text-amber-600 dark:text-amber-400">Still delete?</span>}
                      {refs.length === 0 && <span className="text-xs text-gray-600 dark:text-gray-400">Confirm delete?</span>}
                      <button onClick={() => handleDelete(selectedMedia.id)} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md font-medium transition-colors">Yes, delete</button>
                      <button onClick={() => setDeleteConfirmId(null)} className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-xs rounded-md transition-colors">Cancel</button>
                    </span>
                  ) : (
                    <button onClick={() => setDeleteConfirmId(selectedMedia.id)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 border rounded-md transition-colors ${
                        refs.length > 0
                          ? "text-amber-600 border-amber-300 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                          : "text-red-600 border-red-200 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"}`}>
                      <TrashIcon className="h-3.5 w-3.5" />
                      {refs.length > 0 ? "Delete (in use)" : "Delete"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};

export default MediaManager;
