import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ 
  allowedRoles = [],
  redirectPath = '/login',
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  const hasAllowedRole = allowedRoles.length === 0 || 
    allowedRoles.some(role => 
      user.role.toLowerCase() === role.toLowerCase()
    );

  if (!hasAllowedRole) {
    let rolePath = '/';
    if (user.role.toLowerCase() === 'admin') {
      rolePath = '/admin/software';
    } else if (user.role.toLowerCase() === 'manager') {
      rolePath = '/manager/dashboard';
    } else if (user.role.toLowerCase() === 'employee') {
      rolePath = '/employee/dashboard';
    }
    return <Navigate to={rolePath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute; 