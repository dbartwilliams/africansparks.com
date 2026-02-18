# React + Vite

Developer's architecture blueprint 
Zustand for managing authentication 
Tanstack for getting data

Layer	Tech	Status
🔥Frontend	React + Vite
	✅Tailwind CSS	
	✅react-router-dom	
	✅react-hot-toast	
	✅imagekitio-react	
	✅@tanstack/react-query	
	✅Zustand	

🔥Backend	Express	
	✅jsonwebtoken	
	✅mongoose	
	✅cookie-parser	
	✅bcryptjs	
	✅cors	
	✅multer	
	✅dotenv	
	✅nodemailer	
	✅nodemon (dev)	


    ✅ Backend dev Strategy
    backend/src
    ├── controllers/      # Business logic
    ├── middleware/       # Auth, error handling, validation
    ├── models/           # Mongoose schemas
    ├── routes/           # API route definitions
    ├── utils/            # Helpers (email, upload, etc.)
    ├── config/           # Database connection, cloud config
    └── server.js         # Entry point
    .env          # [Root] — correct


    ✅ Frontend dev Strategy
    frontend/src
    ├── components/      # Reusable UI components
    ├── pages/           # Route-level components
    ├── auth/            # Login, register, auth hooks
    ├── tanstack/        # API layer (see below)
    ├── store/           # Zustand stores
    ├── hooks/           # Custom React hooks
    ├── utils/           # Helpers (single folder)
    └── main.jsx         # Entry point
    .env                 # [Root] VITE_API_URL=http://localhost:6600/api

    ✅ Tanstack Design 

    src/tanstack
    ├── api/              # API functions (usersApi.js, sparksApi.js)
    ├── queries/          # Tanstack hooks (useUser, useSparks)
    └── http/
        └── axiosClient.js   # Axios instance


    ✅ Axios Instance
    import axios from "axios";
    const api = axios.create({ 
        baseURL: import.meta.env.VITE_API_URL || "http://localhost:6600/api",
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        }
    });

    // Request interceptor for auth token
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('token'); // or from Zustand
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    });
    export default api;


    🔥 Building block data flow
    Frontend call
    |
    TanstackQuery
    |
    TanstackApi
    |
    Axios Instance
    |
    route
    |
    controller
    |
    db


   🔥 Zustand Store Scheme

 import { create } from "zustand";
 import api from "../tanstack/http/axiosClient"; // ✅ use shared instance

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  ✅signup: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/signup", payload);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  ✅login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/login", payload);
      set({
        isAuthenticated: true,
        user: response.data.user,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  ✅logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/auth/logout");
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: "Error logging out",
        isLoading: false,
      });
      throw error;
    }
  },

  ✅verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/verify-email", { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  ✅checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await api.get("/auth/check-auth");
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch {
      set({
        isAuthenticated: false,
        isCheckingAuth: false,
      });
    }
  },

  ✅forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/forgot-password", { email });
      set({
        message: response.data.message,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error sending reset email",
        isLoading: false,
      });
      throw error;
    }
  },

  ✅resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(
        `/auth/reset-password/${token}`,
        { password }
      );
      set({
        message: response.data.message,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error resetting password",
        isLoading: false,
      });
      throw error;
    }
  },
}));













