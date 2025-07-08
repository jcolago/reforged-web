import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { authService } from "../api/service";

interface User {
    id: number;
    password: string;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

interface AuthActions {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    fetchUser: () => Promise<void>;
    setError: (error: string | null) => void;
    setLoading: (loading: boolean) => void;
    reset: () => void;
}

type AuthStore = AuthState & AuthActions & {
    readonly isAuthenticated: boolean;
};

export const useAuthStore = create<AuthStore>()(
    devtools (
        persist(
            immer((set, get) => ({
                //initial state
                user: null,
                isLoading: false,
                error: null,
                get isAuthenticated() {
                    return !!localStorage.getItem('token') && !!get().user;
                },
                login: async (email: string, password: string) => {
                    set((state) =>{
                        state.isLoading = true;
                        state.error = null;
                    });
                    try {
                        const response = await authService.login({email, password});
                        const { token, user } = response.data;

                        localStorage.setItem('token', token);

                        set((state) => {
                            state.user = user;
                            state.isLoading = false;
                        });
                    }
                    catch(error: any) {
                        const errorMessage = error.response?.status === 429 ? 'too many attempts. Please try again later.' : error.response?.data?.error || 'Login failed';

                        set((state) => {
                            state.error = errorMessage;
                            state.isLoading = false;
                            state.user = null;
                        });
                        
                        throw error;
                    }
                },

                logout: () => {
                    authService.logout().catch(console.error);
                    localStorage.removeItem('token');

                    set((state) => {
                        state.user = null;
                        state.error = null;
                        state.isLoading = false;
                    });
                },

                fetchUser: async () => {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        set((state) => { state.user = null; })
                        return;
                    }
                    
                    set((state) => { state.isLoading = true; });

                    try {
                        const response = await authService.getCurrentUser();

                        set((state) => {
                            state.user = response.data.user;
                            state.isLoading = false;
                            state.error = null;
                        });
                    } 
                    catch (error:any) {
                        if (error.response?.status === 401) {
                            localStorage.removeItem('token');
                        }

                        set((state) =>{
                            state.user = null;
                            state.isLoading = false;
                            state.error = 'Session expired. Please log in again.';
                        });

                        throw error;
                    }
                },
                setError: (error) => set((state) => { state.error = error; }),
                setLoading: (loading) => set((state) => { state.isLoading = loading; }),
                reset: () => set ((state) => {
                    state.user = null;
                    state.isLoading = false;
                    state.error = null;
                }),
            })),
            {
                name: 'auth-storage',
                partialize: (state) => ({ user: state.user })
            }
        ),
        { name: 'auth-store' }
    )
);

export const useAuth = () => {
    const {
        user,
        isLoading,
        error,
        isAuthenticated,
        login,
        logout,
        setError: clearError
    } = useAuthStore();

    return {
        user,
        isLoading,
        error,
        isAuthenticated,
        login,
        logout,
        clearError: () => clearError(null),
    };
};

export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthError = () => useAuthStore((state) => state.error);
export const uaseAuthLoading = () => useAuthStore((state) => state.isLoading);