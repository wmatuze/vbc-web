// User management API functions (admin only)
import { getAuthHeaders, API_URL } from "./core";

const base = `${API_URL}/api/users`;

const handleResponse = async (res) => {
  if (res.status === 401) {
    localStorage.removeItem("auth");
    window.location.href = "/admin/login";
    throw new Error("Session expired. Please log in again.");
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `API error: ${res.status}`);
  return data;
};

/** Fetch all users (no passwords returned) */
export const getUsers = async () => {
  const res = await fetch(base, { headers: getAuthHeaders() });
  return handleResponse(res);
};

/** Create a new admin/editor user */
export const createUser = async ({ username, name, password, role }) => {
  const res = await fetch(base, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({ username, name, password, role }),
  });
  return handleResponse(res);
};

/** Delete a user by id */
export const deleteUser = async (id) => {
  const res = await fetch(`${base}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

/** Change a user's password */
export const changeUserPassword = async (id, password) => {
  const res = await fetch(`${base}/${id}/password`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({ password }),
  });
  return handleResponse(res);
};

/** Update own display name */
export const updateProfile = async (name) => {
  const res = await fetch(`${base}/me`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({ name }),
  });
  return handleResponse(res);
};

/** Change own password (requires current password) */
export const changeOwnPassword = async (currentPassword, newPassword) => {
  const res = await fetch(`${base}/me/password`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return handleResponse(res);
};

/** Get church config */
export const getChurchConfig = async () => {
  const res = await fetch(`${API_URL}/api/config`);
  return handleResponse(res);
};

/** Update church config (admin only) */
export const updateChurchConfig = async (data) => {
  const res = await fetch(`${API_URL}/api/config`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};
