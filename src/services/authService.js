import api from './api';

const login = (credentials) => {
  return api.post('/auth/login', credentials);
};

const register = (userData) => {
  return api.post('/auth/signup', userData);
};

const verifyToken = () => {
  return api.get('/auth/verify');
};

const authService = {
  login,
  register,
  verifyToken,
};

export default authService; 