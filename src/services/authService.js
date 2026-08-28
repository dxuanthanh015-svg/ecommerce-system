import { storeService } from './storeService'

const BASE_URL = import.meta.env.VITE_BASE_URL
const API_KEY = import.meta.env.VITE_API_KEY

export const authService = {
    register: async (userData) => {
        const checkRes = await fetch(`${BASE_URL}/register?apiKey=${API_KEY}`)
        if (checkRes.ok) {
            const checkJson = await checkRes.json();
            const userList = checkJson.data?.data || []
            const isEmailTaken = userList.some(user => user.email?.toLowerCase() === userData.email?.toLowerCase())
            if (isEmailTaken) {
                throw new Error('Email đã tồn tại!')
            }
            const newUser = {
                id: userData.id || `user_${Date.now()}`,
                ...userData,
                phone: "",
                phonePrefix: "+1",
                city: "",
                district: "",
                specificAddress: "",
                avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
                isVerified: true
            }
            const res = await fetch(`${BASE_URL}/register?apiKey=${API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser)
            });
            if (!res.ok) throw new Error("Failed to register new user");
            const result = await res.json();
            return result.data || newUser;
        }
    },

    login: async (email, password) => {
        const res = await fetch(`${BASE_URL}/register?apiKey=${API_KEY}`)
        if (!res.ok) throw new Error('Failed to fetch users from server')
        const json = await res.json()
        const list = Array.isArray(json.data?.data)
            ? json.data.data
            : Array.isArray(json.data)
                ? json.data
                : Array.isArray(json)
                    ? json
                    : []
        const user = list.find(
            (u) =>
                u.email?.toLowerCase() === email.trim().toLowerCase() &&
                u.password === password
        )
        if (!user) return null;

        // 1. Lưu vào /currentUser
        await fetch(`${BASE_URL}/currentUser?apiKey=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });

        // 2. Nếu là Store Manager => tìm store trong /allStores và lưu vào /currentStore
        if (user.isManager && user.storeId) {
            try {
                const allStores = await storeService.fetchAllStores()
                const userStore = allStores.find(
                    (s) => s.id === user.storeId || s.ownerEmail === user.email
                )
                if (userStore) {
                    await storeService.setCurrentStore(userStore)
                }
            } catch (e) {
                console.warn('[authService] Lỗi lưu currentStore khi login:', e.message)
            }
        }

        return user
    },

    getCurrentUser: async () => {
        const res = await fetch(`${BASE_URL}/currentUser?apiKey=${API_KEY}`)
        if (!res.ok) throw new Error('Failed to fetch current user')
        const json = await res.json()
        const list = Array.isArray(json.data?.data)
            ? json.data.data
            : Array.isArray(json.data)
                ? json.data
                : Array.isArray(json)
                    ? json
                    : []
        return list[0] || null;
    },

    logout: async () => {
        // 1. Xóa /currentUser
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
            const mongoId = currentUser._id || currentUser.id;
            await fetch(`${BASE_URL}/currentUser/${mongoId}?apiKey=${API_KEY}`, {
                method: "DELETE",
            });
        }

        // 2. Xóa /currentStore (nếu là Store Manager)
        try {
            await storeService.removeCurrentStore()
        } catch (e) {
            console.warn('[authService] Lỗi xóa currentStore khi logout:', e.message)
        }

        return true;
    },

    updateProfile: async (idOrData, maybeData) => {
        let id = null;
        let data = {};

        if (typeof idOrData === "object" && idOrData !== null) {
            data = idOrData;
            id = idOrData.id || idOrData._id;
        } else {
            id = idOrData;
            data = (typeof maybeData === "object" && maybeData !== null) ? maybeData : {};
        }

        // Cập nhật /register (bản gốc)
        try {
            const registerRes = await fetch(`${BASE_URL}/register?apiKey=${API_KEY}`);
            if (registerRes.ok) {
                const registerJson = await registerRes.json();
                const registerList = registerJson.data?.data || [];
                const matchedRegister = registerList.find(
                    (u) => (id && u.id === id) || (data.email && u.email?.toLowerCase() === data.email?.toLowerCase())
                );

                if (matchedRegister) {
                    const registerMongoId = matchedRegister._id || matchedRegister.id;
                    await fetch(`${BASE_URL}/register/${registerMongoId}?apiKey=${API_KEY}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...matchedRegister, ...data, id: id || matchedRegister.id || data.id }),
                    });
                }
            }
        } catch (err) {
            console.warn("Lỗi cập nhật /register:", err.message);
        }

        // Cập nhật /currentUser (phiên hiện tại)
        const currentRes = await fetch(`${BASE_URL}/currentUser?apiKey=${API_KEY}`);
        if (!currentRes.ok) throw new Error("Không thể tải thông tin currentUser!");

        const currentJson = await currentRes.json();
        const currentList = currentJson.data?.data || [];
        const activeUser = currentList[0];

        if (activeUser) {
            const currentMongoId = activeUser._id || activeUser.id;
            const updatedData = { ...activeUser, ...data, id: id || activeUser.id || data.id };

            const updateCurrentRes = await fetch(`${BASE_URL}/currentUser/${currentMongoId}?apiKey=${API_KEY}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });

            if (!updateCurrentRes.ok) throw new Error("Cập nhật currentUser thất bại!");
            const resultJson = await updateCurrentRes.json();
            return resultJson.data || updatedData;
        }

        return data;
    },
}

export default authService