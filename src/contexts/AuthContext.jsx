import { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  console.log('AuthProvider - Initial rendering');

  useEffect(() => {
    console.log('AuthProvider - useEffect running to check token');
    const token = localStorage.getItem('token');
    console.log('AuthProvider - Token found in localStorage:', !!token);
    
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log('AuthProvider - Decoded token:', decodedToken);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp < currentTime) {
          console.log('AuthProvider - Token expired');
          logout();
        } else {
          console.log('AuthProvider - Token valid, setting user');
          setUser({
            id: decodedToken.id,
            username: decodedToken.username,
            role: decodedToken.role,
          });
        }
      } catch (error) {
        console.error('AuthProvider - Invalid token', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      console.log('AuthProvider - Login attempt with:', credentials.username);
      setLoading(true);
      const response = await authService.login(credentials);
      const { token } = response.data;
      localStorage.setItem('token', token);
      
      const decodedToken = jwtDecode(token);
      console.log('AuthProvider - Login successful, decoded token:', decodedToken);
      
      setUser({
        id:  decodedToken.id,
        username: decodedToken.username,
        role: decodedToken.role,
      });
      
      // Redirect based on role
      if (decodedToken.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (decodedToken.role === 'manager') {
        navigate('/manager/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
      
      return { success: true };
    } catch (error) {
      console.error('AuthProvider - Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('AuthProvider - Logging out');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  console.log('AuthProvider - Current user state:', user);
  console.log('AuthProvider - Current loading state:', loading);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 