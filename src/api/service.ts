import apiClient from './client';

export const getUsers = () => apiClient.get('/users');
export const getUser = (id: number) => apiClient.get(`/users/${id}`);
// Add other API calls as needed
