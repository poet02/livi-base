import { api, handleApiError } from './apiHelper';

// GET request
const fetchUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
};

// POST request
export const createUser = async (userData: any) => {
  try {
    const response = await api.post('/v1/auth/register', userData);
    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
};