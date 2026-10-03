import React from 'react';
import Navigation from './customer/components/Navigation/Navigation.jsx';
import './App.css';
import Footer from './customer/components/Footer/Footer';
import ChatbotWidget from './customer/components/Chatbot/ChatbotWidget.jsx';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
          },
          success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
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
