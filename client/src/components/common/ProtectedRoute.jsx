import {
  Navigate,
  Outlet,
  useLocation
} from 'react-router-dom';

import useAuth from '../../hooks/useAuth';

function ProtectedRoute() {
  const {
    isAuthenticated,
    loading
  } = useAuth();

  const location = useLocation();

  if (loading) {
    return (
      <main className="route-loading">
        <div
          className="route-loading__spinner"
          aria-label="Loading"
        />
        <p>Checking your secure session...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname
        }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;