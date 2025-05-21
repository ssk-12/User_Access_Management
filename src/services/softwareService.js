import api from './api';

const getAllSoftware = () => {
  return api.get('/software');
};

const getSoftwareById = (id) => {
  return api.get(`/software/${id}`);
};

const createSoftware = (softwareData) => {
  return api.post('/software', softwareData);
};

const updateSoftware = (id, softwareData) => {
  return api.put(`/software/${id}`, softwareData);
};

const deleteSoftware = (id) => {
  return api.delete(`/software/${id}`);
};

const softwareService = {
  getAllSoftware,
  getSoftwareById,
  createSoftware,
  updateSoftware,
  deleteSoftware,
};

export default softwareService; 