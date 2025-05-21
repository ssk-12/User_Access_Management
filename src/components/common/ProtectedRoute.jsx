import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ 
  allowedRoles = [],
  redirectPath = '/login',
}) => {
  const { user, loading } = useAuth();
  console.log('ProtectedRoute - Current user:', user);
  console.log('ProtectedRoute - Loading state:', loading);
  console.log('ProtectedRoute - Allowed roles:', allowedRoles);

  // Show loading state while authentication is being verified
  if (loading) {
    console.log('ProtectedRoute - Still loading, showing loading state');
    return <div>Loading...</div>;
  }

  // Check if user is authenticated
  if (!user) {
    console.log('ProtectedRoute - No user, redirecting to login');
    return <Navigate to={redirectPath} replace />;
  }

  // Case-insensitive role check
  const hasAllowedRole = allowedRoles.length === 0 || 
    allowedRoles.some(role => 
      user.role.toLowerCase() === role.toLowerCase()
    );

  // Check if user role is allowed
  if (!hasAllowedRole) {
    // Redirect based on user role
    let rolePath = '/';
    if (user.role.toLowerCase() === 'admin') {
      rolePath = '/admin/dashboard';
    } else if (user.role.toLowerCase() === 'manager') {
      rolePath = '/manager/dashboard';
    } else if (user.role.toLowerCase() === 'employee') {
      rolePath = '/employee/dashboard';
    }
    console.log(`ProtectedRoute - Role not allowed, redirecting to ${rolePath}`);
    return <Navigate to={rolePath} replace />;
  }

  console.log('ProtectedRoute - User is authenticated and authorized, rendering content');
  // User is authenticated and authorized, render the protected route
  return <Outlet />;
};

export default ProtectedRoute; 