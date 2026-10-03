import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL
const API_KEY = import.meta.env.VITE_API_KEY

const extractArray = (res) => {
    if (!res) return [];
    let raw = res.data !== undefined ? res.data : res;
    if (!raw) return [];

    // Nếu bọc trong data (kể cả lồng nhiều cấp data.data)
    while (raw && raw.data !== undefined && !Array.isArray(raw)) {
        raw = raw.data;
    }

    // 1. Nếu là Array chuẩn
    if (Array.isArray(raw)) return raw;

    // 2. Nếu là Object (dạng 0: {...}, 1: {...} hoặc key là id)
    if (typeof raw === "object" && raw !== null) {
        // Nếu bản thân raw là 1 đơn đăng ký duy nhất
        if (raw.storeId || raw.applicantEmail || raw.shopName) {
            return [raw];
        }

        // Nếu là Object chứa danh sách các đơn
        const entries = Object.entries(raw);
        if (entries.length > 0 && typeof entries[0][1] === "object") {
            return entries.map(([key, val]) => ({
                _id: val?._id || val?.id || key,
                ...val,
            }));
        }
    }

    return [];
};

export const adminService = {
    fetchDashBoardRawData: async () => {
        // Thêm .catch cho từng request để nếu 1 API bị lỗi thì không làm sập cả Dashboard
        const [revenueRes, ordersRes, storeRes, userRes, applicationRes] = await Promise.all([
            axios.get(`${BASE_URL}/allStoreRevenue?apiKey=${API_KEY}`).catch((err) => {
                console.warn("[adminService] allStoreRevenue error:", err.message);
                return { data: [] };
            }),
            axios.get(`${BASE_URL}/orders?apiKey=${API_KEY}`).catch((err) => {
                console.warn("[adminService] orders error:", err.message);
                return { data: [] };
            }),
            axios.get(`${BASE_URL}/allStores?apiKey=${API_KEY}`).catch((err) => {
                console.warn("[adminService] allStores error:", err.message);
                return { data: [] };
            }),
            axios.get(`${BASE_URL}/register?apiKey=${API_KEY}`).catch((err) => {
                console.warn("[adminService] register error:", err.message);
                return { data: [] };
            }),
            axios.get(`${BASE_URL}/storeApplication?apiKey=${API_KEY}`).catch((err) => {
                console.warn("[adminService] storeApplication error:", err.message);
                return { data: [] };
            }),
        ]);

        const extractedApp = extractArray(applicationRes);
        return {
            revenue: extractArray(revenueRes),
            orders: extractArray(ordersRes),
            store: extractArray(storeRes),
            user: extractArray(userRes),
            application: extractedApp,
        };
    },

    approveStoreApplication: async (app) => {
        // 1. Tạo mới Store
        const storeId = app.storeId || `store-${Date.now()}`;
        const storeDisplayName = app.shopName || app.storeName || "Gian hàng mới";
        const newStore = {
            id: storeId,
            name: storeDisplayName,
            storeName: storeDisplayName,
            owner: app.applicantName || app.accountHolder || "Chủ gian hàng",
            ownerEmail: app.applicantEmail || app.businessEmail || "",
            ownerName: app.applicantName || app.accountHolder || "Chủ gian hàng",
            createdAt: new Date().toISOString(),
            phone: app.phone || "",
            address: app.pickupAddress || app.address || "",
            status: 'active',
            rating: 5.0,
            totalSales: 0,
            productCount: 0,
        };

        try {
            const currentStoresRes = await axios.get(`${BASE_URL}/allStores?apiKey=${API_KEY}`);
            const currentStores = extractArray(currentStoresRes);
            const existsInAllStores = currentStores.some(s => s && (s.id === storeId || (s.name && s.name === storeDisplayName)));
            if (!existsInAllStores) {
                await axios.post(`${BASE_URL}/allStores?apiKey=${API_KEY}`, newStore);
            }
        } catch (e) {
            console.warn("[adminService] allStores check/create error:", e.message);
        }

        try {
            const currentStoresRes2 = await axios.get(`${BASE_URL}/stores?apiKey=${API_KEY}`);
            const currentStores2 = extractArray(currentStoresRes2);
            const existsInStores = currentStores2.some(s => s && (s.id === storeId || (s.name && s.name === storeDisplayName)));
            if (!existsInStores) {
                await axios.post(`${BASE_URL}/stores?apiKey=${API_KEY}`, newStore);
            }
        } catch (e) {
            console.warn("[adminService] stores check/create error:", e.message);
        }

        // 2. Cập nhật quyền manager trên /register (Sử dụng PUT vì server không hỗ trợ PATCH)
        const targetEmail = app.applicantEmail || app.businessEmail;
        if (targetEmail) {
            try {
                const userRes = await axios.get(`${BASE_URL}/register?apiKey=${API_KEY}`);
                const users = extractArray(userRes);
                const user = users.find((u) => u.email === targetEmail);
                if (user) {
                    const mongoId = user._id || user.id;
                    if (mongoId) {
                        const roles = Array.isArray(user.roles) ? user.roles : [];
                        await axios.put(`${BASE_URL}/register/${mongoId}?apiKey=${API_KEY}`, {
                            ...user,
                            isManager: true,
                            storeId: storeId,
                            roles: [...new Set([...roles, "store_manager"])],
                        });
                    }
                }
            } catch (error) {
                console.warn("[adminService] Cập nhật quyền Store Manager cảnh báo:", error.message);
            }
        }

        // 3. Xóa đơn duyệt sau khi đã accept thành công
        const appId = app._id || app.id;
        if (appId) {
            try {
                await axios.delete(`${BASE_URL}/storeApplication/${appId}?apiKey=${API_KEY}`);
            } catch (err) {
                console.warn("[adminService] Xóa storeApplication cảnh báo:", err.message);
                // Fallback: Tìm đúng _id của application trên server để xóa
                try {
                    const appListRes = await axios.get(`${BASE_URL}/storeApplication?apiKey=${API_KEY}`);
                    const appList = extractArray(appListRes);
                    const match = appList.find(a => (a._id && a._id === appId) || (a.storeId && a.storeId === app.storeId));
                    if (match && match._id) {
                        await axios.delete(`${BASE_URL}/storeApplication/${match._id}?apiKey=${API_KEY}`);
                    }
                } catch (e2) {
                    console.warn("[adminService] Fallback xóa đơn thất bại:", e2.message);
                }
            }
        }
        return newStore;
    },
    rejectStoreApplication: async (id) => {
        try {
            const res = await axios.delete(`${BASE_URL}/storeApplication/${id}?apiKey=${API_KEY}`);
            return res.data;
        } catch (err) {
            console.warn("[adminService] reject error:", err.message);
            // Fallback nếu id truyền vào là storeId
            try {
                const appListRes = await axios.get(`${BASE_URL}/storeApplication?apiKey=${API_KEY}`);
                const appList = extractArray(appListRes);
                const match = appList.find(a => a._id === id || a.id === id || a.storeId === id);
                if (match && match._id) {
                    const res = await axios.delete(`${BASE_URL}/storeApplication/${match._id}?apiKey=${API_KEY}`);
                    return res.data;
                }
            } catch (e2) {
                console.warn("[adminService] Fallback reject error:", e2.message);
            }
            return { success: true };
        }
    },
    computeAdminDashboardData: (rawData) => {
        const {
            revenue = [],
            orders = [],
            store = [],
            user = [],
            application = []
        } = rawData || {};

        // Tính tổng doanh thu từ orders hoặc allStoreRevenue
        const allOrders = (orders || []).filter(o => o && (o.totalAmount || o.total));
        let totalRevenueSum = 0;
        if (allOrders.length > 0) {
            totalRevenueSum = allOrders.reduce((sum, item) => sum + (Number(item.totalAmount || item.total) || 0), 0);
        } else if (revenue.length > 0) {
            totalRevenueSum = revenue.reduce((sum, item) => sum + (Number(item.totalRevenue || item.revenue) || 0), 0);
        }
        const totalGVM = totalRevenueSum.toFixed(2);

        const activeSeller = (store || []).filter((s) => s.status === "Approved" || s.status === "active").length;
        const totalCustomer = (user || []).filter((u) => u.isVerified === true).length;
        const totalCustomerRegisterLastMonth = (user || []).filter((u) => u.isVerified === true && new Date(u.createdAt).getTime() >= Date.now() - 60 * 24 * 60 * 60 * 1000 && new Date(u.createdAt).getTime() < Date.now() - 30 * 24 * 60 * 60 * 1000).length;
        const newCustomer = (user || []).filter((u) => u.isVerified === true && new Date(u.createdAt).getTime() >= Date.now() - 30 * 24 * 60 * 60 * 1000).length;
        const deltaCustomer = newCustomer > totalCustomerRegisterLastMonth ? `+ ${(newCustomer - totalCustomerRegisterLastMonth) / totalCustomerRegisterLastMonth * 100}% this month` : `-${(totalCustomerRegisterLastMonth - newCustomer) / totalCustomerRegisterLastMonth * 100}% this month`;


        const pendingApplications = (application || []).filter((a) => a.status === "Pending" || !a.status);
        const newApplication = pendingApplications.length;
        const newStores = (store || []).filter((s) => {
            if (!s.createdAt) return false;
            const date1 = new Date(s.createdAt);
            const dateDiff = (Date.now() - date1.getTime()) / (1000 * 3600 * 24);
            return dateDiff <= 30;
        });
        const newListStores = newStores.map((s) => ({
            id: s.id || s._id,
            name: s.name || s.storeName || "Gian hàng",
            email: s.email || s.ownerEmail || "",
            status: s.status || "active",
            createdAt: s.createdAt,
            updatedAt: s.updatedAt,
        }));
        const systemLogs = pendingApplications.map((a) => ({
            id: a._id || a.id || a.storeId,
            title: `Đơn đăng kí mới: ${a.shopName || a.storeName || a.applicantName || "Gian hàng mới"}`,
            applicantName: a.applicantName,
            applicantEmail: a.applicantEmail || a.businessEmail,
            submittedAt: a.submittedAt ? new Date(a.submittedAt).toLocaleString("vi-VN") : "Gần đây",
            status: a.status || "Pending",
            application: a,
        }));

        // Tính biểu đồ doanh thu dựa trên dữ liệu thật của orders
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const now = new Date();
        const last7 = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);

            const dayVal = allOrders.filter(o => {
                if (!o.date && !o.createdAt) return false;
                const od = new Date(o.date || o.createdAt);
                return !isNaN(od.getTime()) &&
                       od.getFullYear() === d.getFullYear() &&
                       od.getMonth() === d.getMonth() &&
                       od.getDate() === d.getDate();
            }).reduce((sum, o) => sum + (Number(o.totalAmount || o.total) || 0), 0);
            last7.push({ label: dayNames[d.getDay()], value: Math.round(dayVal) });
        }

        const thisMonthVal = [
            { label: "Week 1", value: 0 },
            { label: "Week 2", value: 0 },
            { label: "Week 3", value: 0 },
            { label: "Week 4", value: 0 },
        ];
        allOrders.forEach(o => {
            if (!o.date && !o.createdAt) return;
            const od = new Date(o.date || o.createdAt);
            if (!isNaN(od.getTime()) && od.getMonth() === now.getMonth() && od.getFullYear() === now.getFullYear()) {
                const day = od.getDate();
                const val = Number(o.totalAmount || o.total) || 0;
                if (day <= 7) thisMonthVal[0].value += val;
                else if (day <= 14) thisMonthVal[1].value += val;
                else if (day <= 21) thisMonthVal[2].value += val;
                else thisMonthVal[3].value += val;
            }
        });
        thisMonthVal.forEach(w => { w.value = Math.round(w.value); });

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const thisYearVal = monthNames.map((m, idx) => {
            const val = allOrders.filter(o => {
                if (!o.date && !o.createdAt) return false;
                const od = new Date(o.date || o.createdAt);
                return !isNaN(od.getTime()) && od.getFullYear() === now.getFullYear() && od.getMonth() === idx;
            }).reduce((sum, o) => sum + (Number(o.totalAmount || o.total) || 0), 0);
            return { label: m, value: Math.round(val) };
        });

        const revenueChart = {
            last7days: last7,
            thismonth: thisMonthVal,
            last30days: thisMonthVal,
            thisyear: thisYearVal,
        };

        return {
            totalGMV: totalGVM,
            totalGVM,
            activeSeller,
            totalCustomer,
            newApplication,
            newStores: newListStores,
            revenueChart,
            systemLogs,
            store,
            newCustomer,
            deltaCustomer,
            user,
            revenue,
            orders
        };
    },
};
