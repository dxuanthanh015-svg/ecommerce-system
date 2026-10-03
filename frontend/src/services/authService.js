import { storeService } from './storeService'

const BASE_URL = import.meta.env.VITE_BASE_URL
const API_KEY = import.meta.env.VITE_API_KEY
let cachedCurrentId = null;
let cacheRegisterMongoIdMap = {};

export const authService = {
    register: async (userData) => {
        try {
            const inputEmail = userData.email?.toLowerCase().trim();

            // Kiểm tra email đã tồn tại trên hệ thống hay chưa
            const checkRes = await fetch(`${BASE_URL}/register?apiKey=${API_KEY}`);
            if (checkRes.ok) {
                const json = await checkRes.json();
                const list = Array.isArray(json.data?.data)
                    ? json.data.data
                    : Array.isArray(json.data)
                        ? json.data
                        : Array.isArray(json)
                            ? json
                            : [];
                const existingUser = list.find(
                    (u) => u.email?.toLowerCase().trim() === inputEmail
                );
                if (existingUser) {
                    throw new Error("Email này đã được sử dụng! Vui lòng nhập email khác hoặc đăng nhập.");
                }
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
                createdAt: new Date().toISOString(),
                isVerified: true
            }

            const res = await fetch(`${BASE_URL}/register?apiKey=${API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser)
            });

            if (!res.ok) throw new Error("Không thể tạo tài khoản trên hệ thống server!");
            const result = await res.json();
            return result.data || newUser;
        } catch (error) {
            console.error('[authService] register error:', error);
            throw error;
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

        // Xóa sạch currentUser cũ còn tồn đọng trên server trước khi lưu user mới
        await authService.removeCurrentUser();

        // 1. Lưu vào /currentUser
        await fetch(`${BASE_URL}/currentUser?apiKey=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });

        // 2. Nếu là Store Manager => tìm store trong /allStores và lưu vào /currentStore
        const isStoreManager = user.isManager || (Array.isArray(user.roles) && user.roles.includes("store_manager"));
        if (isStoreManager && user.storeId) {
            try {
                const allStores = await storeService.fetchAllStores()
                const safeStores = Array.isArray(allStores) ? allStores : []
                const userStore = safeStores.find(
                    (s) => String(s.id) === String(user.storeId) || s.ownerEmail === user.email
                )
                if (userStore) {
                    await storeService.setCurrentStore(userStore)
                } else {
                    await storeService.removeCurrentStore()
                }
            } catch (e) {
                console.warn('[authService] Lỗi lưu currentStore khi login:', e.message)
            }
        } else {
            // Đăng nhập bằng tài khoản người dùng thường => xóa currentStore cũ nếu có trên server
            await storeService.removeCurrentStore()
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
        const user = list[0] || null;
        if (user) {
            cachedCurrentId = user._id || user.id;
        }
        return user;
    },

    removeCurrentUser: async () => {
        try {
            cachedCurrentId = null;
            const res = await fetch(`${BASE_URL}/currentUser?apiKey=${API_KEY}`);
            if (res.ok) {
                const json = await res.json();
                const list = Array.isArray(json.data?.data) ? json.data.data : json.data || [];
                for (const u of list) {
                    const mongoId = u._id || u.id;
                    if (mongoId) {
                        await fetch(`${BASE_URL}/currentUser/${mongoId}?apiKey=${API_KEY}`, { method: 'DELETE' });
                    }
                }
            }
            return true;
        } catch (error) {
            console.warn('[authService] removeCurrentUser error:', error.message);
            return false;
        }
    },

    logout: async () => {
        // 1. Xóa sạch /currentUser trên server
        await authService.removeCurrentUser();

        // 2. Xóa /currentStore (nếu có)
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

        const userEmail = data.email?.toLowerCase().trim() || "";
        // Cập nhật currentUser
        const updateCurrentUserPromise = (async () => {
            let mongoId = cachedCurrentId;
            let activeUser = null;
            // nếu trong cache chưa có ID mới thì get để lấy Id
            if (!mongoId) {
                const currentUser = await authService.getCurrentUser()
                if (currentUser) {
                    mongoId = currentUser._id || currentUser.id;
                    cachedCurrentId = mongoId;
                    activeUser = currentUser || null;
                }
            }
            if (mongoId) {
                const updateData = { ...activeUser, ...data, id: data?.id || activeUser?.id }
                const updateRes = await fetch(`${BASE_URL}/currentUser/${mongoId}?apiKey=${API_KEY}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updateData),
                });
                if (!updateRes.ok) {
                    throw new Error("Cập nhật thất bại");
                }
                const resultJson = await updateRes.json();
                return resultJson.data || updateData || activeUser;
            }

        })();
        // Cập nhật register 
        const updateRegister = (async () => {
            try {
                let registerMongoId = userEmail ? cacheRegisterMongoIdMap[userEmail] : null;
                let matchRegister = null;
                // Nếu không có trong cache thì get register để tìm
                if (!registerMongoId) {
                    const registerRes = await fetch(`${BASE_URL}/register?apiKey=${API_KEY}`)
                    if (registerRes.ok) {
                        const registerJson = await registerRes.json();
                        const registerList = registerJson.data?.data || [];
                        matchRegister = registerList.find((u) => (id && String(u.id) === String(id)) || (userEmail && String(u.email?.toLowerCase().trim()) === userEmail));
                        if (matchRegister) {
                            registerMongoId = matchRegister._id || matchRegister.id;
                            cacheRegisterMongoIdMap[userEmail] = registerMongoId;
                        }
                    }
                }
                if (registerMongoId) {
                    await fetch(`${BASE_URL}/register/${registerMongoId}?apiKey=${API_KEY}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...matchRegister, ...data, id: matchRegister?.id || matchRegister?.id })
                    })

                }
            } catch (error) {
                console.warn("Lỗi cập nhật register", error.message)
            }
        })();
        const [updatedCurrentUser] = await Promise.all([updateCurrentUserPromise, updateRegister]);
        return updatedCurrentUser;
    }
}

export default authService