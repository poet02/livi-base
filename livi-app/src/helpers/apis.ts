import { api, handleApiError, type ApiError } from './apiHelper';

type CreateUserPayload = Record<string, unknown>;

export const createUser = async (userData: CreateUserPayload) => {
  try {
    const response = await api.post('/v1/auth/register', userData);
    return response.data;
  } catch (error: unknown) {
    handleApiError(error as ApiError);
  }
};