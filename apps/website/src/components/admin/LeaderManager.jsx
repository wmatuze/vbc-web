import { useState, useEffect, useCallback, useRef } from "react";
import {
  createLeader,
  updateLeader,
  deleteLeader,
} from "../../services/api/leaders";
import { getAuthToken } from "../../services/api/core";
import { useLeadersQuery } from "../../hooks/useLeadersQuery";
import useErrorHandler from "../../hooks/useErrorHandler";
import { useDarkMode } from "../../contexts/DarkModeContext";
import MediaSelector from "../common/MediaSelector";
import { validateLeader, leaderValidationRules } from "../../utils/leaderValidation";
import { validateField } from "../../utils/validationUtils";
import placeholderImage from "../../assets/placeholders/default-image.svg";
import {
  PlusIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ArrowPathIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EnvelopeIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import { useLeaderFilters } from "../../hooks/useLeaderFilters";
import LeaderCard from "./LeaderCard";
import LeaderForm from "./LeaderForm";
import config from "../../config";

const API_URL = config.API_URL;
const ITEMS_PER_PAGE = 9;

const EMPTY_LEADER = {
  name: "", title: "", imageUrl: "", image: null,
  bio: "", email: "", phone: "", department: "",
  order: 0, status: "active", startDate: "",
  ministryFocus: [],
  socialMedia: { facebook: "", twitter: "", instagram: "", linkedin: "" },
};

const LeaderManager = () => {
  const { darkMode } = useDarkMode();
  const { error, errorMessage, handleError, clearError, withErrorHandling } =
    useErrorHandler("LeaderManager");

  const {
    data: leaders = [],
    isLoading,
    error: queryError,
    refetch: refetchLeaders,
  } = useLeadersQuery();

  const [successMessage, setSuccessMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [currentLeader, setCurrentLeader] = useState(EMPTY_LEADER);
  const [formErrors, setFormErrors] = useState({});
  const fileInputRef = useRef(null);

  const {
    searchTerm, setSearchTerm,
    filterDepartment, setFilterDepartment,
    sortBy, setSortBy,
    sortOrder, setSortOrder,
    departmentList, filteredLeaders,
  } = useLeaderFilters(leaders);

  const totalPages = Math.ceil(filteredLeaders.length / ITEMS_PER_PAGE);
  const paginatedLeaders = viewMode === "grid"
    ? filteredLeaders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : filteredLeaders;

  useEffect(() => {
    if (queryError) handleError(queryError, "Failed to load leaders");
  }, [queryError, handleError]);

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const resetForm = () => {
    setCurrentLeader(EMPTY_LEADER);
    setFormErrors({});
    setFormMode("add");
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormErrors((prev) => ({ ...prev, [name]: "" }));

    if (name.startsWith("social-")) {
      const platform = name.replace("social-", "");
      setCurrentLeader((prev) => ({
        ...prev,
        socialMedia: { ...prev.socialMedia, [platform]: value },
      }));
    } else if (name === "ministryFocus") {
      const items = value.split(",").map((s) => s.trim()).filter(Boolean);
      setCurrentLeader((prev) => ({ ...prev, ministryFocus: items }));
    } else {
      setCurrentLeader((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleImageUpload = withErrorHandling(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      handleError(new Error("Please upload a JPEG, PNG, or GIF"), "File Validation");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      handleError(new Error("Image must be less than 5MB"), "File Validation");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name.split(".")[0] || "Leader image");
    formData.append("category", "leadership");

    const token = getAuthToken();
    const res = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) throw new Error(`Upload failed: ${res.status} ${res.statusText}`);
    const data = await res.json();
    setCurrentLeader((prev) => ({
      ...prev,
      imageUrl: data.path,
      image: data.id || data._id || null,
    }));
    showSuccess("Image uploaded successfully!");
  }, { context: "Image Upload" });

  const handleMediaSelection = (item) => {
    if (item) {
      const path = item.path || `/uploads/${item.filename}`;
      setCurrentLeader((prev) => ({
        ...prev,
        imageUrl: path,
        image: item.id || item._id || null,
      }));
    }
    setIsMediaSelectorOpen(false);
  };

  const handleSubmit = withErrorHandling(async (e) => {
    e.preventDefault();
    const { isValid, errors } = validateLeader(currentLeader);
    if (!isValid) {
      setFormErrors(errors);
      handleError(new Error("Please fix the form errors before submitting"), "Validation");
      return;
    }

    setIsSubmitting(true);
    try {
      if (formMode === "add") {
        await createLeader({ ...currentLeader, order: leaders.length });
        showSuccess("Leader added successfully!");
      } else {
        await updateLeader(currentLeader.id || currentLeader._id, currentLeader);
        showSuccess("Leader updated successfully!");
      }
      await refetchLeaders();
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  }, { context: "Leader Form Submission" });

  const handleDelete = withErrorHandling(async (id) => {
    if (!window.confirm("Delete this leader? This cannot be undone.")) return;
    await deleteLeader(id);
    showSuccess("Leader deleted successfully!");
    await refetchLeaders();
  }, { context: "Leader Deletion" });

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(leaders, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leaders-export.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getImageUrl = useCallback((url) => {
    if (!url) return null;
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    return `${API_URL}${url}`;
  }, []);

  const inp = (hasError) =>
    `w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
      hasError ? "border-red-500" :
      darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
               : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
    }`;

  const sel = `w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
  }`;

  return (
    <div className="relative">

      {/* ── Alerts ── */}
      {error && (
        <div className={`flex items-start gap-3 p-4 rounded-lg mb-5 border ${darkMode ? "bg-red-900/20 border-red-800 text-red-300" : "bg-red-50 border-red-200 text-red-700"}`}>
          <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span className="flex-1 text-sm">{errorMessage}</span>
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search leaders…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${inp(false)} pl-9`}
            />
          </div>
          <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className={sel} style={{width:"auto"}}>
            <option value="all">All Depts</option>
            {departmentList.filter((d) => d !== "all").map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort */}
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={`${sel} w-auto`}>
            <option value="order">By Order</option>
            <option value="name">By Name</option>
          </select>
          <button onClick={() => setSortOrder((p) => p === "asc" ? "desc" : "asc")}
            className={`p-2 rounded-lg transition-colors ${darkMode ? "text-gray-400 hover:bg-gray-700" : "text-gray-400 hover:bg-gray-100"}`}
            title={`Sort ${sortOrder === "asc" ? "ascending" : "descending"}`}>
            {sortOrder === "asc" ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
          </button>

          {/* View toggle */}
          <div className={`flex rounded-lg border overflow-hidden ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
            <button onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${viewMode === "grid" ? "bg-blue-600 text-white" : darkMode ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
              <Squares2X2Icon className="h-4 w-4" />
            </button>
            <button onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${viewMode === "list" ? "bg-blue-600 text-white" : darkMode ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
              <ListBulletIcon className="h-4 w-4" />
            </button>
          </div>

          <button onClick={handleExport} title="Export JSON"
            className={`p-2 rounded-lg transition-colors ${darkMode ? "text-gray-400 hover:bg-gray-700" : "text-gray-400 hover:bg-gray-100"}`}>
            <DocumentArrowDownIcon className="h-4 w-4" />
          </button>
          <button onClick={() => refetchLeaders()} title="Refresh"
            className={`p-2 rounded-lg transition-colors ${darkMode ? "text-gray-400 hover:bg-gray-700" : "text-gray-400 hover:bg-gray-100"}`}>
            <ArrowPathIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">
            <PlusIcon className="h-4 w-4" />
            Add Leader
          </button>
        </div>
      </div>

      {/* ── Count ── */}
      <p className={`text-xs mb-4 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
        {filteredLeaders.length} leader{filteredLeaders.length !== 1 ? "s" : ""}
      </p>

      {/* ── Content ── */}
      {isLoading && leaders.length === 0 ? (
        <div className={`grid gap-5 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`rounded-xl border animate-pulse overflow-hidden ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-100"}`}>
              <div className={`h-44 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
              <div className="p-4 space-y-2">
                <div className={`h-4 rounded w-2/3 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                <div className={`h-3 rounded w-1/2 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
              </div>
            </div>
          ))}
        </div>
      ) : filteredLeaders.length === 0 ? (
        <div className={`text-center py-16 rounded-xl border ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
          <UserIcon className={`mx-auto h-10 w-10 mb-3 ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {searchTerm || filterDepartment !== "all" ? "No leaders match your filters" : "No leaders yet"}
          </p>
          {!searchTerm && filterDepartment === "all" && (
            <button onClick={() => { resetForm(); setShowForm(true); }} className="mt-3 text-sm text-blue-500 hover:underline">
              Add your first leader →
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedLeaders.map((leader) => (
              <LeaderCard
                key={leader.id || leader._id}
                leader={leader}
                getImageUrl={getImageUrl}
                onEdit={() => {
                  setCurrentLeader(leader);
                  setFormMode("edit");
                  setShowForm(true);
                }}
                onDelete={() => handleDelete(leader.id || leader._id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-1">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors disabled:opacity-40 ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => setCurrentPage(n)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium border transition-colors ${
                    currentPage === n
                      ? "bg-blue-600 text-white border-blue-600"
                      : darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}>
                  {n}
                </button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors disabled:opacity-40 ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        // List view
        <div className={`rounded-xl border overflow-hidden ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
          <table className="min-w-full">
            <thead className={`text-xs uppercase tracking-wider ${darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-50 text-gray-500"}`}>
              <tr>
                <th className="px-5 py-3 text-left font-medium">Leader</th>
                <th className="px-5 py-3 text-left font-medium">Contact</th>
                <th className="px-5 py-3 text-left font-medium">Department</th>
                <th className="px-5 py-3 text-left font-medium">Ministry Focus</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-100"}`}>
              {paginatedLeaders.map((leader) => (
                <tr key={leader.id || leader._id} className={`transition-colors ${darkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-50"}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                        {getImageUrl(leader.imageUrl)
                          ? <img src={getImageUrl(leader.imageUrl)} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display="none"; }} />
                          : <UserIcon className={`w-full h-full p-2 ${darkMode ? "text-gray-500" : "text-gray-300"}`} />}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{leader.name}</p>
                        <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{leader.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className={`px-5 py-3 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {leader.email && <div className="flex items-center gap-1"><EnvelopeIcon className="h-3.5 w-3.5" />{leader.email}</div>}
                    {leader.phone && <div className="flex items-center gap-1 mt-0.5">{leader.phone}</div>}
                  </td>
                  <td className="px-5 py-3">
                    {leader.department && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${darkMode ? "bg-blue-900/40 text-blue-300" : "bg-blue-50 text-blue-700"}`}>
                        {leader.department}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {leader.ministryFocus?.slice(0, 3).map((f) => (
                        <span key={f} className={`px-1.5 py-0.5 rounded text-xs ${darkMode ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"}`}>{f}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setCurrentLeader(leader); setFormMode("edit"); setShowForm(true); }}
                        className={`p-1.5 rounded-lg transition-colors ${darkMode ? "text-blue-400 hover:bg-blue-900/30" : "text-blue-500 hover:bg-blue-50"}`} title="Edit">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(leader.id || leader._id)}
                        className={`p-1.5 rounded-lg transition-colors ${darkMode ? "text-red-400 hover:bg-red-900/30" : "text-red-400 hover:bg-red-50"}`} title="Delete">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Slide-over form ── */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={resetForm} />
          <div className={`fixed top-0 right-0 h-full w-full max-w-xl z-50 flex flex-col shadow-2xl ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
            <LeaderForm
              currentLeader={currentLeader}
              formMode={formMode}
              isSubmitting={isSubmitting}
              formErrors={formErrors}
              darkMode={darkMode}
              onSubmit={handleSubmit}
              onChange={handleInputChange}
              onCancel={resetForm}
              onImageUpload={handleImageUpload}
              onMediaBrowse={() => setIsMediaSelectorOpen(true)}
              fileInputRef={fileInputRef}
              getImageUrl={getImageUrl}
            />
          </div>
        </>
      )}

      {/* ── Hidden file input ── */}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

      <MediaSelector
        isOpen={isMediaSelectorOpen}
        onClose={() => setIsMediaSelectorOpen(false)}
        onSelect={handleMediaSelection}
      />
    </div>
  );
};

export default LeaderManager;
