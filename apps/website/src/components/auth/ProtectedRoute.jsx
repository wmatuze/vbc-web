import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, verifyAuth } from '../../services/api';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthed = isAuthenticated();

      if (isAuthed) {
        // Verify with server that token is still valid
        const valid = await verifyAuth();
        setIsAuthorized(valid);
      } else {
        setIsAuthorized(false);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    // You could return a loading spinner here
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    // Redirect to admin login page if not authenticated
    return <Navigate to="/admin" replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
