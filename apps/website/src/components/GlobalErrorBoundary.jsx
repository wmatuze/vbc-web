import React, { Component } from "react";

const isChunkError = (error) => {
  const msg = error?.message || "";
  return (
    msg.includes("dynamically imported module") ||
    msg.includes("Loading chunk") ||
    msg.includes("Failed to fetch") ||
    msg.includes("error loading")
  );
};

class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorCount: 0 };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState((prev) => ({ errorCount: prev.errorCount + 1 }));
    console.error("[ErrorBoundary]", error, errorInfo?.componentStack);
  }

  render() {
    const { hasError, error, errorCount } = this.state;
    const { children, fallback } = this.props;

    if (!hasError) return children;
    if (fallback) return fallback(error, this.handleReset);

    // Chunk load error — stale browser cache after a new deploy
    if (isChunkError(error)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
          <div className="max-w-sm w-full text-center">
            <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-5">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              New version available
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
              The site was recently updated. Please refresh the page to load the latest version.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-5 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    // Generic error
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-red-600 px-6 py-4">
            <h2 className="text-white text-lg font-bold">Something went wrong</h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              An unexpected error occurred. Try one of the options below.
            </p>
            {errorCount > 1 && (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 text-amber-700 dark:text-amber-400 text-sm rounded">
                Multiple errors detected — a full page reload is recommended.
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={() => { window.location.href = "/"; }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GlobalErrorBoundary;
