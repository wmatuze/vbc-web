import React, { Component } from "react";
import { toast } from "react-toastify";
import { logError, getErrorMessage } from "../utils/errorHandling";

/**
 * A global error boundary component that catches errors in the component tree,
 * displays a user-friendly error message, and provides recovery options.
 */
class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };

    // Override console.error to suppress React's default error logging
    if (process.env.NODE_ENV !== "development") {
      this.originalConsoleError = console.error;
      console.error = (...args) => {
        // Filter out React-specific error messages that we're already handling
        if (
          args[0]?.includes?.("The above error occurred in the") ||
          args[0]?.includes?.("React will try to recreate this component tree")
        ) {
          return;
        }
        this.originalConsoleError.apply(console, args);
      };
    }
  }

  componentWillUnmount() {
    // Restore original console.error when component unmounts
    if (process.env.NODE_ENV !== "development" && this.originalConsoleError) {
      console.error = this.originalConsoleError;
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Only log the error if it's the first occurrence
    if (this.state.errorCount === 0) {
      // Use our utility function to log the error
      logError("GlobalErrorBoundary", error, {
        componentStack: errorInfo.componentStack,
      });

      // Show a toast notification with a cleaner error message
      toast.error(`Error: ${getErrorMessage(error)}`);

      // You could also log the error to an error reporting service here
      // Example: logErrorToService(error, errorInfo);
    }

    // Update state with error details
    this.setState((prevState) => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));
  }

  handleResetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReloadPage = () => {
    window.location.reload();
  };

  handleNavigateHome = () => {
    window.location.href = "/";
  };

  render() {
    const { hasError, error, errorInfo, errorCount } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback(error, errorInfo, this.handleResetError);
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-red-600 p-4">
              <h2 className="text-white text-xl font-bold">
                Something went wrong
              </h2>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                We're sorry, but an error occurred while rendering the page.
              </p>

              {/* Error details (collapsible) */}
              <details className="mb-6 bg-gray-50 p-4 rounded-lg">
                <summary className="cursor-pointer text-gray-600 font-medium">
                  Technical Details
                </summary>
                <div className="mt-3">
                  <p className="text-red-600 font-mono text-sm mb-2">
                    {getErrorMessage(error)}
                  </p>
                  {errorInfo && (
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                      {errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>

              {/* Recovery options */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={this.handleResetError}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={this.handleReloadPage}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Reload Page
                </button>
                <button
                  onClick={this.handleNavigateHome}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                >
                  Go to Homepage
                </button>
              </div>

              {/* Show warning if multiple errors occur */}
              {errorCount > 1 && (
                <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
                  <p className="text-sm">
                    Multiple errors have occurred. You may want to reload the
                    page or contact support.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default GlobalErrorBoundary;
