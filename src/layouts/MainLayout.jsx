import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Home, Package, Users, PlusCircle, ClipboardList, LayoutDashboard, LogOut } from 'lucide-react';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getNavLinks = () => {
    if (!user) return [];

    if (user.role === 'admin') {
      return [
        { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5 mr-2" /> },
        { to: '/admin/requests', label: 'All Requests', icon: <ClipboardList className="h-5 w-5 mr-2" /> },
        { to: '/admin/software', label: 'Software', icon: <Package className="h-5 w-5 mr-2" /> },
        { to: '/admin/users', label: 'Users', icon: <Users className="h-5 w-5 mr-2" /> },
      ];
    } else if (user.role === 'manager') {
      return [
        { to: '/manager/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5 mr-2" /> },
        { to: '/manager/requests', label: 'Team Requests', icon: <ClipboardList className="h-5 w-5 mr-2" /> },
      ];
    } else {
      return [
        { to: '/employee/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5 mr-2" /> },
        { to: '/employee/requests/new', label: 'New Request', icon: <PlusCircle className="h-5 w-5 mr-2" /> },
        { to: '/employee/requests', label: 'My Requests', icon: <ClipboardList className="h-5 w-5 mr-2" /> },
      ];
    }
  };

  const navLinks = getNavLinks();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Create an overlay when sidebar is open on mobile
  const Overlay = () => (
    isSidebarOpen && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
        onClick={() => setIsSidebarOpen(false)}
      />
    )
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Overlay />
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out
          bg-gray-800 text-white h-full flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
          <span className="text-xl font-semibold">Access Manager</span>
          <button
            className="p-1 md:hidden hover:bg-gray-700 rounded"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User Profile Section */}
        {user && (
          <div className="px-4 py-4 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center uppercase font-bold">
                {user.username?.charAt(0) || 'U'}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.username}</span>
                <span className="text-xs px-2 py-1 bg-gray-700 rounded-full mt-1 text-center">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`
                    flex items-center px-4 py-3 rounded-lg transition-colors
                    ${location.pathname === link.to 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 relative">
        {/* Mobile Header */}
        <header className="bg-white h-16 flex items-center md:hidden shadow-sm px-4 z-10">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="ml-4 font-semibold text-lg">Access Manager</h1>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 