import React, { Component } from 'react';

/**
 * A component that safely renders its children, catching any rendering errors
 * and displaying a fallback UI instead of crashing the entire application.
 */
class SafeRender extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to the console
    console.error('SafeRender caught an error:', error, errorInfo);
    
    // You could also log the error to an error reporting service here
  }

  render() {
    const { children, fallback, darkMode } = this.props;
    
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (fallback) {
        return fallback(this.state.error);
      }
      
      // Default fallback UI
      return (
        <div className="p-6 text-center">
          <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Something went wrong
          </h3>
          <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            There was an error rendering this component.
          </p>
          <p className={`mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Error details: {this.state.error?.message || 'Unknown error'}
          </p>
        </div>
      );
    }

    return children;
  }
}

export default SafeRender;
