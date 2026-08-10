import React from "react";
import { Outlet } from "react-router-dom";
import StoreSidebar from "./StoreSidebar";
import StoreHeader from "./StoreHeader";

const StoreManagerLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#f8f9fc] font-sans antialiased">
      {/* Fixed Left Sidebar */}
      <StoreSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <StoreHeader />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StoreManagerLayout;
