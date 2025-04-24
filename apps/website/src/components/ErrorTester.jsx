import React, { useState } from "react";

// Create an error component that will throw during render
class ErrorThrower extends React.Component {
  componentDidMount() {
    // This will be caught by the error boundary during the commit phase
    if (this.props.shouldThrow) {
      throw new Error("This is a test error from ErrorTester component");
    }
  }

  render() {
    return <div>This will throw an error on mount</div>;
  }
}

/**
 * A component that can be used to test error boundaries by throwing errors on demand.
 */
const ErrorTester = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  const throwError = () => {
    setShouldThrow(true);
  };

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="text-lg font-medium text-yellow-800 mb-2">
        Error Boundary Tester
      </h3>
      <p className="text-yellow-700 mb-4">
        Click the button below to simulate an error and test the error boundary.
      </p>
      <div className="space-y-4">
        <button
          onClick={throwError}
          disabled={shouldThrow}
          className={`px-4 py-2 text-white rounded transition-colors ${shouldThrow ? "bg-yellow-400 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700"}`}
        >
          {shouldThrow ? "Error Triggered" : "Trigger Test Error"}
        </button>

        <div className="text-sm text-yellow-600">
          <p>This will test the GlobalErrorBoundary component.</p>
          <p>
            After the error is thrown, you should see the error UI with recovery
            options.
          </p>
        </div>

        {/* Render the error thrower component when shouldThrow is true */}
        {shouldThrow && <ErrorThrower shouldThrow={true} />}
      </div>
    </div>
  );
};

export default ErrorTester;
