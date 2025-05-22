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

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp < currentTime) {
          logout();
        } else {
          setUser({
            id: decodedToken.id,
            username: decodedToken.username,
            role: decodedToken.role,
          });
        }
      } catch (error) {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      const { token } = response.data;
      localStorage.setItem('token', token);
      
      const decodedToken = jwtDecode(token);
      
      setUser({
        id:  decodedToken.id,
        username: decodedToken.username,
        role: decodedToken.role,
      });
      
      if (decodedToken.role === 'admin') {
        navigate('/admin/software');
      } else if (decodedToken.role === 'manager') {
        navigate('/manager/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 