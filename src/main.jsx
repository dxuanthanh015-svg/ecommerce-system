import { Children, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import "./index.css";
import App from "./App.jsx";
import { AppRouters } from "./Routers/AppRouters.jsx";
import { RouterProvider } from "react-router-dom";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // dữ liệu mới trong 5 phút và không fetch lại
      gcTime: 1000 * 60 * 10, // dữ liệu sẽ bị xóa sau 10 phút nếu không được sử dụng
      refetchOnWindowFocus: false,// không fetch lại khi người dùng click qua tab khác rồi quay lại
      retry: 1, // Chỉ retry 1 lần nếu lỗi
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={AppRouters} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
