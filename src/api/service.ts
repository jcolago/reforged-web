/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './client';

// Auth service
export const authService = {
  login: (credentials: { email: string; password: string }) => 
    apiClient.post('/login', credentials),
  logout: () => apiClient.delete('/logout'),
  getCurrentUser: () => apiClient.get('/me'),
};

// Users service
export const userService = {
  getUsers: () => apiClient.get('/users'),
  getUser: (id: number) => apiClient.get(`/users/${id}`),
  createUser: (userData: any) => apiClient.post('/users', { user: userData }),
  updateUser: (id: number, userData: any) => apiClient.patch(`/users/${id}`, { user: userData }),
  deleteUser: (id: number) => apiClient.delete(`/users/${id}`),
};

// Players service
export const playerService = {
  getPlayers: () => apiClient.get('/players'),
  getPlayer: (id: number) => apiClient.get(`/players/${id}`),
  createPlayer: (playerData: any) => apiClient.post('/players', { player: playerData }),
  updatePlayer: (id: number, playerData: any) => apiClient.patch(`/players/${id}`, { player: playerData }),
  deletePlayer: (id: number) => apiClient.delete(`/players/${id}`),
  updatePlayerHP: (id: number, hp: number) => apiClient.patch(`/players/${id}/update_hp`, { current_hp: hp }),
};

// Monsters service
export const monsterService = {
  getMonsters: () => apiClient.get('/monsters/monsters'),
  getMonster: (id: number) => apiClient.get(`/monsters/${id}`),
  addMonster: (monsterData: any) => apiClient.post('/monsters/add_monster', { monster: monsterData }),
  removeMonster: (id: number) => apiClient.delete('/monsters/remove_monster', { data: { id } }),
  updateMonster: (id: number, monsterData: any) => apiClient.patch(`/monsters/${id}`, { monster: monsterData }),
};

// Games service
export const gameService = {
  getGames: () => apiClient.get('/games'),
  getGame: (id: number) => apiClient.get(`/games/${id}`),
  createGame: (gameData: any) => apiClient.post('/games', { game: gameData }),
  updateGame: (id: number, gameData: any) => apiClient.patch(`/games/${id}`, { game: gameData }),
  deleteGame: (id: number) => apiClient.delete(`/games/${id}`),
};

// Conditions service
export const conditionService = {
  getConditions: () => apiClient.get('/conditions'),
  getCondition: (id: number) => apiClient.get(`/conditions/${id}`),
  createCondition: (conditionData: any) => apiClient.post('/conditions', { condition: conditionData }),
  updateCondition: (id: number, conditionData: any) => apiClient.patch(`/conditions/${id}`, { condition: conditionData }),
  deleteCondition: (id: number) => apiClient.delete(`/conditions/${id}`),
};

// Player Conditions service
export const playerConditionService = {
  getPlayerConditions: () => apiClient.get('/player_conditions'),
  getPlayerCondition: (id: number) => apiClient.get(`/player_conditions/${id}`),
  createPlayerCondition: (pcData: any) => apiClient.post('/player_conditions', { player_condition: pcData }),
  updatePlayerCondition: (id: number, pcData: any) => apiClient.patch(`/player_conditions/${id}`, { player_condition: pcData }),
  deletePlayerCondition: (id: number) => apiClient.delete(`/player_conditions/${id}`),
};