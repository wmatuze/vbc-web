import React, { useState, useEffect, useCallback } from "react";
import {
  BuildingOffice2Icon,
  GlobeAltIcon,
  BellIcon,
  KeyIcon,
  UserCircleIcon,
  Cog8ToothIcon,
  PlusIcon,
  TrashIcon,
  LockClosedIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { getCurrentUser } from "../../services/api/auth";
import {
  getUsers,
  createUser,
  deleteUser,
  changeUserPassword,
} from "../../services/api/users";

const ROLE_LABELS = { admin: "Admin", editor: "Editor" };

const SettingsContent = () => {
  const { darkMode } = useDarkMode();
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "admin";
  const [activeSection, setActiveSection] = useState("church");

  // ── User management state ──────────────────────────────────────────────────
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({
    username: "",
    name: "",
    password: "",
    role: "editor",
  });
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [pwModal, setPwModal] = useState(null); // { id, username }
  const [pwValue, setPwValue] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // user object
  const [toast, setToast] = useState(null); // { msg, type }

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

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
      showToast(`User "${newUser.username}" created successfully`);
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

  const sections = [
    {
      id: "church",
      label: "Church Information",
      icon: BuildingOffice2Icon,
      description: "Update your church details and contact information",
    },
    {
      id: "website",
      label: "Website Settings",
      icon: GlobeAltIcon,
      description: "Manage website appearance and functionality",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: BellIcon,
      description: "Configure email and push notification settings",
    },
    {
      id: "security",
      label: "Security & Users",
      icon: KeyIcon,
      description: "Manage admin users and access control",
    },
    {
      id: "account",
      label: "Account Settings",
      icon: UserCircleIcon,
      description: "Update your account preferences",
    },
    {
      id: "system",
      label: "System",
      icon: Cog8ToothIcon,
      description: "View system information and logs",
    },
  ];

  const card = darkMode
    ? "bg-gray-800 border-gray-700 text-white"
    : "bg-white border-gray-200 text-gray-900";
  const input = `mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
      : "bg-white border-gray-300 text-gray-900"
  }`;
  const labelCls = `block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`;

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
            toast.type === "error"
              ? "bg-red-600 text-white"
              : "bg-green-600 text-white"
          }`}
        >
          {toast.type === "error" ? (
            <ExclamationTriangleIcon className="h-4 w-4" />
          ) : (
            <CheckIcon className="h-4 w-4" />
          )}
          {toast.msg}
        </div>
      )}

      {/* Section Nav */}
      <nav className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => {
          const active = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`p-4 text-left rounded-lg border transition-all ${
                active
                  ? "border-blue-500 bg-blue-50 shadow-sm"
                  : darkMode
                    ? "border-gray-700 hover:border-blue-500 hover:bg-gray-700"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <section.icon
                  className={`h-6 w-6 ${active ? "text-blue-500" : "text-gray-400"}`}
                />
                <div>
                  <h3
                    className={`font-medium ${active ? "text-blue-700" : darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    {section.label}
                  </h3>
                  <p
                    className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {section.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Section Content Panel */}
      <div className={`rounded-lg shadow-sm border p-6 ${card}`}>
        {activeSection === "church" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Church Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className={labelCls}>Church Name</label>
                <input
                  type="text"
                  className={input}
                  defaultValue="Victory Bible Church"
                />
              </div>
              <div>
                <label className={labelCls}>Address</label>
                <textarea
                  rows={3}
                  className={input}
                  defaultValue="123 Church Street, City, State 12345"
                />
              </div>
              <div>
                <label className={labelCls}>Contact Email</label>
                <input
                  type="email"
                  className={input}
                  defaultValue="contact@victorybiblechurch.org"
                />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input
                  type="tel"
                  className={input}
                  defaultValue="+254 700 000 000"
                />
              </div>
            </div>
          </div>
        )}

        {activeSection === "website" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Website Settings</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className={labelCls}>Site Title</label>
                <input
                  type="text"
                  className={input}
                  defaultValue="Victory Bible Church - Official Website"
                />
              </div>
              <div>
                <label className={labelCls}>Meta Description</label>
                <textarea
                  rows={3}
                  className={input}
                  defaultValue="Welcome to Victory Bible Church. Join us in worship and fellowship as we grow together in faith."
                />
              </div>
            </div>
          </div>
        )}

        {/* Security & Users */}
        {activeSection === "security" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Admin Users</h2>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  {isAdmin
                    ? "Manage who has access to the admin panel."
                    : "View who has access to the admin panel."}
                </p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => {
                    setShowAddForm(true);
                    setAddError("");
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <PlusIcon className="h-4 w-4" /> Add User
                </button>
              )}
            </div>

            {/* Read-only notice for editors */}
            {!isAdmin && (
              <div
                className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${darkMode ? "border-yellow-600 bg-yellow-900/20 text-yellow-300" : "border-yellow-400 bg-yellow-50 text-yellow-800"}`}
              >
                <ExclamationTriangleIcon className="h-4 w-4 shrink-0" />
                <span>
                  You have <strong>read-only</strong> access. Only admins can
                  add, delete, or change passwords.
                </span>
              </div>
            )}

            {isAdmin && showAddForm && (
              <form
                onSubmit={handleAddUser}
                className={`rounded-lg border p-4 space-y-4 ${darkMode ? "border-blue-500 bg-gray-700" : "border-blue-200 bg-blue-50"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-blue-600">New User</h3>
                  <button type="button" onClick={() => setShowAddForm(false)}>
                    <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Username</label>
                    <input
                      required
                      className={input}
                      placeholder="e.g. john_doe"
                      value={addForm.username}
                      onChange={(e) =>
                        setAddForm((f) => ({ ...f, username: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Full Name</label>
                    <input
                      required
                      className={input}
                      placeholder="e.g. John Doe"
                      value={addForm.name}
                      onChange={(e) =>
                        setAddForm((f) => ({ ...f, name: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Password</label>
                    <input
                      required
                      type="password"
                      minLength={8}
                      className={input}
                      placeholder="Min 8 characters"
                      value={addForm.password}
                      onChange={(e) =>
                        setAddForm((f) => ({ ...f, password: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Role</label>
                    <select
                      className={input}
                      value={addForm.role}
                      onChange={(e) =>
                        setAddForm((f) => ({ ...f, role: e.target.value }))
                      }
                    >
                      <option value="editor">
                        Editor — can manage content
                      </option>
                      <option value="admin">Admin — full access</option>
                    </select>
                  </div>
                </div>
                {addError && <p className="text-sm text-red-500">{addError}</p>}
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className={`px-4 py-2 text-sm rounded-lg border ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-600" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addLoading}
                    className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-60"
                  >
                    {addLoading ? "Creating…" : "Create User"}
                  </button>
                </div>
              </form>
            )}

            {usersLoading && (
              <p
                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Loading users…
              </p>
            )}
            {usersError && <p className="text-sm text-red-500">{usersError}</p>}
            {!usersLoading && !usersError && (
              <div
                className={`overflow-x-auto rounded-lg border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
              >
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                    <tr>
                      {[
                        "Name",
                        "Username",
                        "Role",
                        "Created",
                        ...(isAdmin ? ["Actions"] : []),
                      ].map((h) => (
                        <th
                          key={h}
                          className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-100"}`}
                  >
                    {users.map((u) => (
                      <tr
                        key={u._id}
                        className={
                          darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                        }
                      >
                        <td className="px-4 py-3 font-medium">{u.name}</td>
                        <td
                          className={`px-4 py-3 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                        >
                          {u.username}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              u.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {ROLE_LABELS[u.role] || u.role}
                          </span>
                        </td>
                        <td
                          className={`px-4 py-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString()
                            : "—"}
                        </td>
                        {isAdmin && (
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                title="Change password"
                                onClick={() => {
                                  setPwModal({
                                    id: u._id,
                                    username: u.username,
                                  });
                                  setPwValue("");
                                  setPwError("");
                                }}
                                className="p-1.5 rounded text-blue-500 hover:bg-blue-50 transition-colors"
                              >
                                <LockClosedIcon className="h-4 w-4" />
                              </button>
                              <button
                                title="Delete user"
                                onClick={() => setDeleteConfirm(u)}
                                className="p-1.5 rounded text-red-500 hover:bg-red-50 transition-colors"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td
                          colSpan={isAdmin ? 5 : 4}
                          className={`px-4 py-6 text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
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

        {!["church", "website", "security"].includes(activeSection) && (
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            This section is coming soon.
          </p>
        )}
      </div>

      {/* Change Password Modal */}
      {pwModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <form
            onSubmit={handleChangePassword}
            className={`w-full max-w-sm rounded-xl shadow-xl p-6 space-y-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <div className="flex items-center justify-between">
              <h3
                className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                Change Password — {pwModal.username}
              </h3>
              <button type="button" onClick={() => setPwModal(null)}>
                <XMarkIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div>
              <label className={labelCls}>New Password</label>
              <input
                type="password"
                required
                minLength={8}
                className={input}
                placeholder="Min 8 characters"
                value={pwValue}
                onChange={(e) => setPwValue(e.target.value)}
              />
            </div>
            {pwError && <p className="text-sm text-red-500">{pwError}</p>}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setPwModal(null)}
                className={`px-4 py-2 text-sm rounded-lg border ${darkMode ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-700"}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={pwLoading}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-60"
              >
                {pwLoading ? "Saving…" : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className={`w-full max-w-sm rounded-xl shadow-xl p-6 space-y-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500 shrink-0" />
              <h3
                className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                Delete user "{deleteConfirm.username}"?
              </h3>
            </div>
            <p
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              This cannot be undone. The user will immediately lose admin
              access.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className={`px-4 py-2 text-sm rounded-lg border ${darkMode ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-700"}`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsContent;
