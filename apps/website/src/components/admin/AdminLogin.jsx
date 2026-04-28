import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login } from "../../services/api/auth";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

const AdminLogin = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        const redirectTo = searchParams.get("redirectTo") || "/admin";
        navigate(redirectTo, { replace: true });
      } else {
        setLoginError("Invalid username or password");
      }
    } catch {
      setLoginError("Error logging in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-200 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <img
            src="/assets/logo.png"
            alt="Victory Bible Church"
            className="mx-auto h-16 w-auto mb-4"
          />
          <h2
            className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Welcome Back
          </h2>
          <p className={`mt-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Sign in to access your admin dashboard
          </p>
        </div>

        <div
          className={`rounded-xl shadow-lg p-8 transition-colors duration-200 ${
            darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
          }`}
        >
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                darkMode ? "bg-gray-700 text-yellow-300" : "bg-gray-100 text-gray-700"
              }`}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
          </div>

          {loginError && (
            <div
              className={`border-l-4 p-4 mb-6 ${
                darkMode
                  ? "bg-red-900/30 border-red-600 text-red-200"
                  : "bg-red-50 border-red-400 text-red-700"
              }`}
            >
              <p className="text-sm">{loginError}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className={`block text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className={`mt-1 block w-full px-3 py-2 rounded-lg shadow-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className={`mt-1 block w-full px-3 py-2 rounded-lg shadow-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Sign in to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
