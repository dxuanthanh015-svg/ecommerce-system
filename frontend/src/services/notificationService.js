import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL
const API_KEY = import.meta.env.VITE_API_KEY

export const notificationService = {
    fetchNotification: async () => {
        try {
            const res = await axios.get(`${BASE_URL}/notification?apiKey=${API_KEY}`);
            let raw = res.data;
            if (raw && typeof raw === 'object') {
                if (Array.isArray(raw.data?.data)) raw = raw.data.data;
                else if (Array.isArray(raw.data)) raw = raw.data;
                else if (Array.isArray(raw)) raw = raw;
                else raw = [];
            } else {
                raw = [];
            }
            return raw;
        } catch (error) {
            console.warn("Failed to fetch notifications", error.message);
            return [];
        }
    },

    postNotification: async (notification) => {
        try {
            const payload = {
                id: notification.id || `noti_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                ...notification
            };
            const res = await axios.post(`${BASE_URL}/notification?apiKey=${API_KEY}`, payload, {
                headers: { "Content-Type": "application/json" }
            });
            return res.data?.data || payload;
        } catch (error) {
            console.warn("Failed to post notification", error.message);
            return notification;
        }
    },

    putNotification: async (id, notification) => {
        try {
            const res = await axios.put(`${BASE_URL}/notification/${id}?apiKey=${API_KEY}`, notification, {
                headers: { "Content-Type": "application/json" }
            });
            return res.data?.data || notification;
        } catch (error) {
            console.warn("Failed to update notification", error.message);
            return null;
        }
    },

    deleteNotification: async (id) => {
        try {
            const res = await axios.delete(`${BASE_URL}/notification/${id}?apiKey=${API_KEY}`);
            return res.data?.data;
        } catch (error) {
            console.warn("Failed to delete notification", error.message);
            return null;
        }
    }
};