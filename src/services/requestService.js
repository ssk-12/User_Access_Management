import api from './api';

const getAllRequests = () => {
  return api.get('/requests');
};

const getMyRequests = () => {
  return api.get('/requests/my');
};

const getTeamRequests = () => {
  return api.get('/requests/team');
};

const getRequestById = (id) => {
  return api.get(`/requests/${id}`);
};

const createRequest = (requestData) => {
  return api.post('/requests', requestData);
};

const updateRequestStatus = (id, status, comments) => {
  return api.patch(`/requests/${id}/status`, { status, comments });
};

const getMyAccess = () => {
  return api.get('/requests/my-requests');
};

const requestService = {
  getAllRequests,
  getMyRequests,
  getTeamRequests,
  getRequestById,
  createRequest,
  updateRequestStatus,
  getMyAccess,
};

export default requestService; 