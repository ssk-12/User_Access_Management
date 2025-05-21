import api from './api';

const getAllUsers = () => {
  return api.get('/users');
};

const getUserById = (id) => {
  return api.get(`/users/${id}`);
};

const createUser = (userData) => {
  return api.post('/users', userData);
};

const updateUser = (id, userData) => {
  return api.put(`/users/${id}`, userData);
};

const deleteUser = (id) => {
  return api.delete(`/users/${id}`);
};

const getUsersByRole = (role) => {
  return api.get(`/users/role/${role}`);
};

const userService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUsersByRole,
};

export default userService; 