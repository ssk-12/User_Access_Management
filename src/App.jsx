import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import NewRequestPage from './pages/employee/NewRequestPage';
import EmployeeRequestsPage from './pages/employee/EmployeeRequestsPage';
import AdminSoftwarePage from './pages/admin/AdminSoftwarePage';

// Placeholder components for routes we'll implement later
const EmployeeRequestDetail = () => <div>Request Detail Page</div>;
const ManagerDashboard = () => <div>Manager Dashboard</div>;
const ManagerRequests = () => <div>Team Requests Page</div>;
const ManagerRequestDetail = () => <div>Request Review Page</div>;
const AdminDashboard = () => <div>Admin Dashboard</div>;
const AdminRequests = () => <div>All Requests Page</div>;
const AdminUsers = () => <div>User Management Page</div>;

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Employee routes */}
          <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
            <Route element={<MainLayout />}>
              <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
              <Route path="/employee/requests" element={<EmployeeRequestsPage />} />
              <Route path="/employee/requests/new" element={<NewRequestPage />} />
              <Route path="/employee/requests/:id" element={<EmployeeRequestDetail />} />
            </Route>
          </Route>

          {/* Manager routes */}
          <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
            <Route element={<MainLayout />}>
              <Route path="/manager/dashboard" element={<ManagerDashboard />} />
              <Route path="/manager/requests" element={<ManagerRequests />} />
              <Route path="/manager/requests/:id" element={<ManagerRequestDetail />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<MainLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/requests" element={<AdminRequests />} />
              <Route path="/admin/software" element={<AdminSoftwarePage />} />
              <Route path="/admin/users" element={<AdminUsers />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
