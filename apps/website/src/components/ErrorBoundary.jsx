import GlobalErrorBoundary from "./GlobalErrorBoundary";

/**
 * A simplified error boundary that extends the GlobalErrorBoundary
 * with a simpler UI for component-level error handling.
 */
class ErrorBoundary extends GlobalErrorBoundary {
  render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      // Simpler UI for component-level errors
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Something went wrong
          </h3>
          <p className="text-red-700 mb-4">
            {error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={this.handleResetError}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
