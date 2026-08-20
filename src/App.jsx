import React, { useEffect } from 'react';
import Navigation from './customer/components/Navigation/Navigation.jsx';
import './App.css';
import Footer from './customer/components/Footer/Footer';
import ChatbotWidget from './customer/components/Chatbot/ChatbotWidget.jsx';
import { Outlet } from 'react-router-dom';
import { product_mock_data } from './Data/product_mock_data';
import { store_manager_mock_data } from './Data/store-manager_mock_data';

function App() {
  useEffect(() => {
    // 1. Seed & Merge products
    const existing = JSON.parse(localStorage.getItem("products"));
    if (!existing || existing.length === 0) {
      localStorage.setItem("products", JSON.stringify(product_mock_data));
    } else {
      const existingIds = new Set(existing.map((p) => String(p.id)));
      const missingMockProducts = product_mock_data.filter((p) => !existingIds.has(String(p.id)));
      if (missingMockProducts.length > 0) {
        const merged = [...existing, ...missingMockProducts];
        localStorage.setItem("products", JSON.stringify(merged));
      }
    }

    // 2. Seed & Merge stores (store-001, store-002, store-003 + custom stores)
    const existingStores = JSON.parse(localStorage.getItem("allStores")) || JSON.parse(localStorage.getItem("stores")) || [];
    const existingStoreIds = new Set(existingStores.map((s) => String(s.id)));
    const missingMockStores = store_manager_mock_data.filter((s) => !existingStoreIds.has(String(s.id)));
    const mergedStores = [...existingStores, ...missingMockStores];

    localStorage.setItem("allStores", JSON.stringify(mergedStores));
    localStorage.setItem("stores", JSON.stringify(mergedStores));

    // 3. Seed & Merge allStoreRevenue for ALL stores
    const allStoreRevenue = JSON.parse(localStorage.getItem("allStoreRevenue")) || {};

    mergedStores.forEach((store) => {
      if (!allStoreRevenue[store.id]) {
        allStoreRevenue[store.id] = {
          storeId: store.id,
          storeName: store.name || "Store",
          totalRevenue: 0,
          todayRevenue: 0,
          orders: [],
        };
      }
    });

    // Also check any registered store managers or active user
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    registeredUsers.forEach((u) => {
      if (u.storeId && !allStoreRevenue[u.storeId]) {
        allStoreRevenue[u.storeId] = {
          storeId: u.storeId,
          storeName: `${u.firstName || "Store"}'s Shop`,
          totalRevenue: 0,
          todayRevenue: 0,
          orders: [],
        };
      }
    });

    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser?.storeId && !allStoreRevenue[currentUser.storeId]) {
      allStoreRevenue[currentUser.storeId] = {
        storeId: currentUser.storeId,
        storeName: `${currentUser.firstName || "Store"}'s Shop`,
        totalRevenue: 0,
        todayRevenue: 0,
        orders: [],
      };
    }

    localStorage.setItem("allStoreRevenue", JSON.stringify(allStoreRevenue));

    if (currentUser?.isManager && currentUser?.storeId && allStoreRevenue[currentUser.storeId]) {
      localStorage.setItem("orderRevenue", JSON.stringify(allStoreRevenue[currentUser.storeId]));
    }
  }, []);

  return (
    <div className="">
      <Navigation />
      <div>
        <Outlet />
      </div>
      <ChatbotWidget />
      <Footer />
    </div>
  );
}

export default App;
