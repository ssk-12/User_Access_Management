import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useEffect } from 'react';
import { ToastProviderComponent } from './components/ui/toast';

import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import NewRequestPage from './pages/employee/NewRequestPage';
import EmployeeRequestsPage from './pages/employee/EmployeeRequestsPage';
import AdminSoftwarePage from './pages/admin/AdminSoftwarePage';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManagerRequestsPage from './pages/manager/ManagerRequestsPage';

const EmployeeRequestDetail = () => <div>Request Detail Page</div>;
const AdminDashboard = () => <div>Admin Dashboard</div>;
const AdminRequests = () => <div>All Requests Page</div>;
const AdminUsers = () => <div>User Management Page</div>;

function App() {
  // Ensure proper viewport meta tag is set for mobile responsiveness
  useEffect(() => {
    // Check if viewport meta tag exists
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    
    // If it doesn't exist, create it
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.head.appendChild(viewportMeta);
    }
    
    // Set the content attribute to ensure proper mobile scaling
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
  }, []);

  return (
    <Router>
      <ToastProviderComponent>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
              <Route element={<MainLayout />}>
                <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
                <Route path="/employee/requests" element={<EmployeeRequestsPage />} />
                <Route path="/employee/requests/new" element={<NewRequestPage />} />
                {/* <Route path="/employee/requests/:id" element={<EmployeeRequestDetail />} /> */}
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
              <Route element={<MainLayout />}>
                <Route path="/manager/dashboard" element={<ManagerDashboard />} />
                <Route path="/manager/requests" element={<ManagerRequestsPage />} />
              </Route>
            </Route>

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
      </ToastProviderComponent>
    </Router>
  );
}

export default App;
