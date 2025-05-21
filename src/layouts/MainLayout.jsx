import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  console.log('MainLayout - Rendering with user:', user);
  console.log('MainLayout - Current pathname:', location.pathname);

  // Define navigation links based on user role
  const getNavLinks = () => {
    if (!user) return [];

    if (user.role === 'admin') {
      return [
        { to: '/admin/dashboard', label: 'Dashboard' },
        { to: '/admin/requests', label: 'All Requests' },
        { to: '/admin/software', label: 'Software' },
        { to: '/admin/users', label: 'Users' },
      ];
    } else if (user.role === 'manager') {
      return [
        { to: '/manager/dashboard', label: 'Dashboard' },
        { to: '/manager/requests', label: 'Team Requests' },
      ];
    } else {
      return [
        { to: '/employee/dashboard', label: 'Dashboard' },
        { to: '/employee/requests/new', label: 'New Request' },
        { to: '/employee/requests', label: 'My Requests' },
      ];
    }
  };

  const navLinks = getNavLinks();
  console.log('MainLayout - Nav links:', navLinks);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-gray-800 text-white w-64 fixed inset-y-0 left-0 transform ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition duration-200 ease-in-out z-30`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
          <span className="text-xl font-semibold">Access Manager</span>
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="mt-6">
          <ul>
            {navLinks.map((link) => (
              <li key={link.to} className="px-2 py-1">
                <Link
                  to={link.to}
                  className={`block px-4 py-2 rounded-md ${
                    location.pathname === link.to 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top header */}
        <header className="bg-white h-16 flex items-center justify-between shadow-sm px-6 z-10">
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center">
            {user && (
              <>
                <span className="mr-4">{user.username}</span>
                <span className="px-2 py-1 text-xs bg-gray-200 rounded-full mr-4">
                  {user.role}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 