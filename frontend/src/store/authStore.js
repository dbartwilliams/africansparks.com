import { create } from "zustand";
import axios from "axios";

const backendUrl = import.meta.env.MODE === "development" 
? "http://localhost:6600/api/auth"
: "/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,

	signup: async (payload) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${backendUrl}/signup`, 
				payload,
			);
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
		} catch (error) {
			set({ error: error.response.data.message || "Error signing up", isLoading: false });
			throw error;
		}
	},

	login: async (payload) => {
		set({ isLoading: true, error: null });
		try {
			console.log('BACKEND URL:', backendUrl);
			const response = await axios.post(`${backendUrl}/login`, payload);
			set({
				isAuthenticated: true,
				user: response.data.user,
				error: null,
				isLoading: false,
			});
		} catch (error) {
			set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			throw error;
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${backendUrl}/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},
	verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${backendUrl}/verify-email`, { code });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response.data.message || "Error verifying email", isLoading: false });
			throw error;
		}
	},

	checkAuth: async () => {
			set({ isCheckingAuth: true, error: null });
			try {
				const response = await axios.get(`${backendUrl}/check-auth`);
				set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
			} catch (error) {
				set({ error: null, isCheckingAuth: false, isAuthenticated: false });
				throw error;
			}
	},

	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${backendUrl}/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},

	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${backendUrl}/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},

	// In your store
	updateSparkCommentsCount: (sparkId) => 
		set(state => ({
		sparks: state.sparks.map(spark => 
			spark._id === sparkId 
			? { ...spark, commentsCount: spark.commentsCount + 1 }
			: spark
		)
		})),
}));