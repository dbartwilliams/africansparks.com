import axios from "axios";

const isDev = import.meta.env.DEV; 

const api = axios.create({ 
    baseURL: isDev 
        ? "http://localhost:6600/api" 
        : "https://africansparks.com/api",  // ✅ Removed trailing space
    withCredentials: true,
}); 

export default api;