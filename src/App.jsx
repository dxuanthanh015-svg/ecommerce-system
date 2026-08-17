import Navigation from './customer/components/Navigation/Navigation.jsx'
import './App.css'
import Footer from './customer/components/Footer/Footer'
import ChatbotWidget from './customer/components/Chatbot/ChatbotWidget.jsx'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <div className="">
      <Navigation />
      <div>
        <Outlet />
      </div>
      <ChatbotWidget />
      <Footer />
    </div>
  )
}

export default App
