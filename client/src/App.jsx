import {
  Routes,
  Route
} from 'react-router-dom';

import AdminAlertDetail from './pages/admin/AdminAlertDetail';
import AdminAlerts from './pages/admin/AdminAlerts';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRoute from './components/common/AdminRoute';
import ProtectedRoute from './components/common/ProtectedRoute';
import AlertDetail from './pages/AlertDetail';
import AlertHistory from './pages/AlertHistory';
import Contacts from './pages/Contacts';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Settings from './pages/Settings';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Landing />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/contacts"
          element={<Contacts />}
        />

        <Route
          path="/alert-history"
          element={<AlertHistory />}
        />

        <Route
          path="/alert-history/:id"
          element={<AlertDetail />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />
      </Route>

      <Route element={<AdminRoute />}>
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/alerts"
          element={<AdminAlerts />}
        />

        <Route
          path="/admin/alerts/:id"
          element={<AdminAlertDetail />}
        />

        <Route
          path="/admin/users"
          element={<AdminUsers />}
        />
      </Route>
    </Routes>
  );
}

export default App;