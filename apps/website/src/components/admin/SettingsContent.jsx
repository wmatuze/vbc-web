import React, { useState, useEffect, useCallback } from "react";
import {
  BuildingOffice2Icon,
  KeyIcon,
  UserCircleIcon,
  Cog8ToothIcon,
  PlusIcon,
  TrashIcon,
  LockClosedIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ServerIcon,
  WifiIcon,
} from "@heroicons/react/24/outline";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { getCurrentUser } from "../../services/api/auth";
import {
  getUsers,
  createUser,
  deleteUser,
  changeUserPassword,
  updateProfile,
  changeOwnPassword,
  getChurchConfig,
  updateChurchConfig,
} from "../../services/api/users";
import config from "../../config";

const API_URL = config.API_URL;
const ROLE_LABELS = { admin: "Admin", editor: "Editor" };

const SettingsContent = () => {
  const { darkMode } = useDarkMode();
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "admin";
  const [activeSection, setActiveSection] = useState("church");

  // ── Toast ──────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Church config ──────────────────────────────────────────────────────────
  const [churchForm, setChurchForm] = useState({
    name: "", address: "", email: "", phone: "", website: "", siteTitle: "", metaDescription: "",
  });
  const [churchLoading, setChurchLoading] = useState(false);
  const [churchSaving, setChurchSaving] = useState(false);

  const loadChurchConfig = useCallback(async () => {
    setChurchLoading(true);
    try {
      const cfg = await getChurchConfig();
      setChurchForm({
        name:            cfg.name            || "",
        address:         cfg.address         || "",
        email:           cfg.email           || "",
        phone:           cfg.phone           || "",
        website:         cfg.website         || "",
        siteTitle:       cfg.siteTitle       || "",
        metaDescription: cfg.metaDescription || "",
      });
    } catch {
      showToast("Could not load church config", "error");
    } finally {
      setChurchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeSection === "church") loadChurchConfig();
  }, [activeSection, loadChurchConfig]);

  const handleChurchSave = async (e) => {
    e.preventDefault();
    setChurchSaving(true);
    try {
      await updateChurchConfig(churchForm);
      showToast("Church information saved");
    } catch (err) {
      showToast(err.message || "Failed to save", "error");
    } finally {
      setChurchSaving(false);
    }
  };

  // ── Account settings ───────────────────────────────────────────────────────
  const [acctName, setAcctName]           = useState(currentUser?.name || "");
  const [acctNameSaving, setAcctNameSaving] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);

  const handleNameSave = async (e) => {
    e.preventDefault();
    if (!acctName.trim()) return;
    setAcctNameSaving(true);
    try {
      await updateProfile(acctName.trim());
      showToast("Display name updated");
    } catch (err) {
      showToast(err.message || "Failed to update name", "error");
    } finally {
      setAcctNameSaving(false);
    }
  };

  const handlePwChange = async (e) => {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) {
      showToast("New passwords do not match", "error");
      return;
    }
    if (pwForm.next.length < 8) {
      showToast("Password must be at least 8 characters", "error");
      return;
    }
    setPwSaving(true);
    try {
      await changeOwnPassword(pwForm.current, pwForm.next);
      showToast("Password changed successfully");
      setPwForm({ current: "", next: "", confirm: "" });
    } catch (err) {
      showToast(err.message || "Failed to change password", "error");
    } finally {
      setPwSaving(false);
    }
  };

  // ── User management ────────────────────────────────────────────────────────
  const [users, setUsers]               = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError]     = useState("");
  const [showAddForm, setShowAddForm]   = useState(false);
  const [addForm, setAddForm]           = useState({ username: "", name: "", password: "", role: "editor" });
  const [addError, setAddError]         = useState("");
  const [addLoading, setAddLoading]     = useState(false);
  const [pwModal, setPwModal]           = useState(null);
  const [pwValue, setPwValue]           = useState("");
  const [pwError, setPwError]           = useState("");
  const [pwLoading, setPwLoading]       = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    setUsersError("");
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (e) {
      setUsersError(e.message);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeSection === "security") loadUsers();
  }, [activeSection, loadUsers]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);
    try {
      const newUser = await createUser(addForm);
      setUsers((prev) => [...prev, newUser]);
      setAddForm({ username: "", name: "", password: "", role: "editor" });
      setShowAddForm(false);
      showToast(`User "${newUser.username}" created`);
    } catch (e) {
      setAddError(e.message);
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteUser(deleteConfirm._id);
      setUsers((prev) => prev.filter((u) => u._id !== deleteConfirm._id));
      showToast(`User "${deleteConfirm.username}" deleted`);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwLoading(true);
    try {
      await changeUserPassword(pwModal.id, pwValue);
      showToast(`Password updated for "${pwModal.username}"`);
      setPwModal(null);
      setPwValue("");
    } catch (e) {
      setPwError(e.message);
    } finally {
      setPwLoading(false);
    }
  };

  // ── System health ──────────────────────────────────────────────────────────
  const [apiStatus, setApiStatus]   = useState("idle"); // idle | checking | ok | error
  const [apiLatency, setApiLatency] = useState(null);

  const checkApi = async () => {
    setApiStatus("checking");
    const t0 = Date.now();
    try {
      const res = await fetch(`${API_URL}/api/health`);
      if (res.ok) {
        setApiLatency(Date.now() - t0);
        setApiStatus("ok");
      } else {
        setApiStatus("error");
      }
    } catch {
      setApiStatus("error");
    }
  };

  useEffect(() => {
    if (activeSection === "system") checkApi();
  }, [activeSection]);

  // ── Style helpers ──────────────────────────────────────────────────────────
  const card  = darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900";
  const input = `mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
      : "bg-white border-gray-300 text-gray-900"
  }`;
  const labelCls = `block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`;
  const btnPrimary = "px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50";
  const btnSecondary = `px-4 py-2 text-sm rounded-lg border transition-colors ${
    darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"
  }`;

  const sections = [
    { id: "church",   label: "Church Information", icon: BuildingOffice2Icon, description: "Church details and contact info" },
    { id: "security", label: "Security & Users",   icon: KeyIcon,             description: "Manage admin users and access" },
    { id: "account",  label: "Account Settings",   icon: UserCircleIcon,      description: "Your display name and password" },
    { id: "system",   label: "System",             icon: Cog8ToothIcon,       description: "API health and environment info" },
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
          toast.type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white"
        }`}>
          {toast.type === "error"
            ? <ExclamationTriangleIcon className="h-4 w-4 shrink-0" />
            : <CheckIcon className="h-4 w-4 shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* Section nav */}
      <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {sections.map((s) => {
          const active = activeSection === s.id;
          return (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`p-4 text-left rounded-lg border transition-all ${
                active
                  ? "border-red-600 bg-red-50 dark:bg-red-950/30"
                  : darkMode
                    ? "border-gray-700 hover:border-gray-500 hover:bg-gray-700"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}>
              <div className="flex items-center gap-3">
                <s.icon className={`h-5 w-5 shrink-0 ${active ? "text-red-600" : "text-gray-400"}`} />
                <div>
                  <p className={`text-sm font-semibold ${active ? "text-red-600" : darkMode ? "text-white" : "text-gray-900"}`}>
                    {s.label}
                  </p>
                  <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{s.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Content panel */}
      <div className={`rounded-lg shadow-sm border p-6 ${card}`}>

        {/* ── Church Information ──────────────────────────────────────────── */}
        {activeSection === "church" && (
          churchLoading
            ? <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Loading…</p>
            : (
              <form onSubmit={handleChurchSave} className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold">Church Information</h2>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    These details appear throughout the site. {!isAdmin && <span className="text-amber-500 font-medium">Admin access required to save.</span>}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Church Name</label>
                    <input type="text" className={input} required
                      value={churchForm.name} onChange={e => setChurchForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelCls}>Contact Email</label>
                    <input type="email" className={input}
                      value={churchForm.email} onChange={e => setChurchForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelCls}>Phone</label>
                    <input type="tel" className={input}
                      value={churchForm.phone} onChange={e => setChurchForm(f => ({ ...f, phone: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelCls}>Website URL</label>
                    <input type="url" className={input} placeholder="https://"
                      value={churchForm.website} onChange={e => setChurchForm(f => ({ ...f, website: e.target.value }))} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Address</label>
                    <textarea rows={2} className={input}
                      value={churchForm.address} onChange={e => setChurchForm(f => ({ ...f, address: e.target.value }))} />
                  </div>
                </div>

                <div className={`pt-4 border-t ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                  <h3 className="text-sm font-semibold mb-3">SEO / Website Meta</h3>
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>Site Title</label>
                      <input type="text" className={input}
                        value={churchForm.siteTitle} onChange={e => setChurchForm(f => ({ ...f, siteTitle: e.target.value }))} />
                    </div>
                    <div>
                      <label className={labelCls}>Meta Description</label>
                      <textarea rows={2} className={input}
                        value={churchForm.metaDescription} onChange={e => setChurchForm(f => ({ ...f, metaDescription: e.target.value }))} />
                    </div>
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex justify-end">
                    <button type="submit" disabled={churchSaving} className={btnPrimary}>
                      {churchSaving ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                )}
              </form>
            )
        )}

        {/* ── Security & Users ────────────────────────────────────────────── */}
        {activeSection === "security" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-lg font-semibold">Admin Users</h2>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {isAdmin ? "Manage who has access to the admin panel." : "View who has access to the admin panel."}
                </p>
              </div>
              {isAdmin && (
                <button onClick={() => { setShowAddForm(true); setAddError(""); }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
                  <PlusIcon className="h-4 w-4" /> Add User
                </button>
              )}
            </div>

            {!isAdmin && (
              <div className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
                darkMode ? "border-yellow-600 bg-yellow-900/20 text-yellow-300" : "border-yellow-400 bg-yellow-50 text-yellow-800"
              }`}>
                <ExclamationTriangleIcon className="h-4 w-4 shrink-0" />
                <span>You have <strong>read-only</strong> access. Only admins can add, delete, or change passwords.</span>
              </div>
            )}

            {isAdmin && showAddForm && (
              <form onSubmit={handleAddUser}
                className={`rounded-lg border p-4 space-y-4 ${darkMode ? "border-red-700 bg-gray-700" : "border-red-200 bg-red-50"}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-red-600">New User</h3>
                  <button type="button" onClick={() => setShowAddForm(false)}>
                    <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Username</label>
                    <input required className={input} placeholder="e.g. john_doe"
                      value={addForm.username} onChange={e => setAddForm(f => ({ ...f, username: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelCls}>Full Name</label>
                    <input required className={input} placeholder="e.g. John Doe"
                      value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelCls}>Password</label>
                    <input required type="password" minLength={8} className={input} placeholder="Min 8 characters"
                      value={addForm.password} onChange={e => setAddForm(f => ({ ...f, password: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelCls}>Role</label>
                    <select className={input} value={addForm.role} onChange={e => setAddForm(f => ({ ...f, role: e.target.value }))}>
                      <option value="editor">Editor — can manage content</option>
                      <option value="admin">Admin — full access</option>
                    </select>
                  </div>
                </div>
                {addError && <p className="text-sm text-red-500">{addError}</p>}
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowAddForm(false)} className={btnSecondary}>Cancel</button>
                  <button type="submit" disabled={addLoading} className={btnPrimary}>
                    {addLoading ? "Creating…" : "Create User"}
                  </button>
                </div>
              </form>
            )}

            {usersLoading && <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Loading users…</p>}
            {usersError  && <p className="text-sm text-red-500">{usersError}</p>}
            {!usersLoading && !usersError && (
              <div className={`overflow-x-auto rounded-lg border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                <table className="min-w-full divide-y text-sm" style={{ borderColor: "inherit" }}>
                  <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                    <tr>
                      {["Name", "Username", "Role", "Created", ...(isAdmin ? ["Actions"] : [])].map(h => (
                        <th key={h} className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${darkMode ? "text-gray-300" : "text-gray-500"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                    {users.map(u => (
                      <tr key={u._id} className={darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                        <td className="px-4 py-3 font-medium">{u.name}</td>
                        <td className={`px-4 py-3 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{u.username}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            u.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                          }`}>{ROLE_LABELS[u.role] || u.role}</span>
                        </td>
                        <td className={`px-4 py-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                        </td>
                        {isAdmin && (
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button title="Change password"
                                onClick={() => { setPwModal({ id: u._id, username: u.username }); setPwValue(""); setPwError(""); }}
                                className="p-1.5 rounded text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                                <LockClosedIcon className="h-4 w-4" />
                              </button>
                              <button title="Delete user" onClick={() => setDeleteConfirm(u)}
                                className="p-1.5 rounded text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={isAdmin ? 5 : 4} className={`px-4 py-6 text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Account Settings ────────────────────────────────────────────── */}
        {activeSection === "account" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold">Account Settings</h2>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Logged in as <strong>{currentUser?.username}</strong>
              </p>
            </div>

            {/* Display name */}
            <form onSubmit={handleNameSave} className="space-y-4">
              <h3 className={`text-sm font-semibold uppercase tracking-wide ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Display Name</h3>
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className={labelCls}>Full Name</label>
                  <input type="text" required className={input}
                    value={acctName} onChange={e => setAcctName(e.target.value)} />
                </div>
                <button type="submit" disabled={acctNameSaving} className={`${btnPrimary} mb-px`}>
                  {acctNameSaving ? "Saving…" : "Save"}
                </button>
              </div>
            </form>

            {/* Change own password */}
            <form onSubmit={handlePwChange} className={`space-y-4 pt-6 border-t ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
              <h3 className={`text-sm font-semibold uppercase tracking-wide ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Change Password</h3>
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Current Password</label>
                  <input type="password" required className={input} placeholder="Enter current password"
                    value={pwForm.current} onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>New Password</label>
                  <input type="password" required minLength={8} className={input} placeholder="Min 8 characters"
                    value={pwForm.next} onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Confirm New Password</label>
                  <input type="password" required className={input} placeholder="Repeat new password"
                    value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} />
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={pwSaving} className={btnPrimary}>
                  {pwSaving ? "Updating…" : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── System ──────────────────────────────────────────────────────── */}
        {activeSection === "system" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">System</h2>

            {/* API health */}
            <div className={`rounded-lg border p-4 space-y-3 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ServerIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium">Backend API</span>
                </div>
                <div className="flex items-center gap-2">
                  {apiStatus === "checking" && (
                    <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Checking…</span>
                  )}
                  {apiStatus === "ok" && (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                      <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
                      Online {apiLatency !== null && `· ${apiLatency}ms`}
                    </span>
                  )}
                  {apiStatus === "error" && (
                    <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
                      <span className="h-2 w-2 rounded-full bg-red-500 inline-block" />
                      Unreachable
                    </span>
                  )}
                  <button onClick={checkApi} disabled={apiStatus === "checking"}
                    className={`text-xs px-2 py-1 rounded border transition-colors ${
                      darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}>
                    Recheck
                  </button>
                </div>
              </div>
              <div className={`text-xs font-mono ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {API_URL}
              </div>
            </div>

            {/* Env info */}
            <div className={`rounded-lg border p-4 space-y-2 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              <div className="flex items-center gap-2 mb-3">
                <WifiIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium">Environment</span>
              </div>
              {[
                { label: "Frontend",    value: window.location.origin },
                { label: "Environment", value: import.meta.env.MODE || "production" },
                { label: "Build",       value: import.meta.env.VITE_APP_VERSION || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className={darkMode ? "text-gray-400" : "text-gray-500"}>{label}</span>
                  <span className={`font-mono text-xs ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Change Password Modal (for other users) */}
      {pwModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <form onSubmit={handleChangePassword}
            className={`w-full max-w-sm rounded-xl shadow-xl p-6 space-y-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                Change Password — {pwModal.username}
              </h3>
              <button type="button" onClick={() => setPwModal(null)}>
                <XMarkIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div>
              <label className={labelCls}>New Password</label>
              <input type="password" required minLength={8} className={input} placeholder="Min 8 characters"
                value={pwValue} onChange={e => setPwValue(e.target.value)} />
            </div>
            {pwError && <p className="text-sm text-red-500">{pwError}</p>}
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setPwModal(null)} className={btnSecondary}>Cancel</button>
              <button type="submit" disabled={pwLoading} className={btnPrimary}>
                {pwLoading ? "Saving…" : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className={`w-full max-w-sm rounded-xl shadow-xl p-6 space-y-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500 shrink-0" />
              <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                Delete user "{deleteConfirm.username}"?
              </h3>
            </div>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              This cannot be undone. The user will immediately lose admin access.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className={btnSecondary}>Cancel</button>
              <button onClick={handleDeleteUser} className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsContent;
