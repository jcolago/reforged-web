import axios, { AxiosInstance } from 'axios';

// Types for your API responses
interface LoginResponse {
  token: string;
}

interface UserResponse {
  user: {
    id: number;
    email: string;
    // ... other user properties
  }
}

// API client setup
const api: AxiosInstance = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API service functions
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post<LoginResponse>('/login', { email, password });
    return response.data;
  },

  me: async () => {
    const response = await api.get<UserResponse>('/me');
    return response.data;
  },

  logout: async () => {
    return api.delete('/logout');
  }
};

export const playerService = {
  getAll: async () => {
    const response = await api.get('/players');
    return response.data;
  },

  updateHp: async (playerId: number, hp: number) => {
    const response = await api.patch(`/players/${playerId}/update_hp`, { current_hp: hp });
    return response.data;
  }
};

export const monsterService = {
  getAll: async () => {
    const response = await api.get('/monsters/monsters');
    return response.data;
  },

  addMonster: async (monsterData: unknown) => {
    const response = await api.post('/monsters/add_monster', monsterData);
    return response.data;
  },

  removeMonster: async (monsterId: number) => {
    return api.delete('/monsters/remove_monster', { data: { id: monsterId } });
  }
};

export default api;