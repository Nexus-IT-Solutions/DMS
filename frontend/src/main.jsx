import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AdminLogin from "./pages/admin/Login.jsx"
import Page404 from "./pages/PageNotFound.jsx"
import { DarkModeProvider } from "./components/ThemedContext"
import OfficerForgotPassword from "./components/officer/OfficerForgotPassword.jsx"
import AdminForgotPassword from "./components/admin/AdminForgotPassword.jsx"
import OfficerOtp from "./components/officer/OfficerOtp.jsx"
import AdminOtp from "./components/admin/AdminOtp.jsx"
import AdminDashboardLayout from "./components/admin/AdminDashboardLayout.jsx"
import DashboardHome from "./pages/admin/DashboardHome.jsx"
import RegisterPWD from "./pages/admin/RegisterPWD.jsx"
import PWDRecords from "./pages/admin/PWDRecords.jsx"
import PWDDetails from "./pages/PWDDetails.jsx"



createRoot(document.getElementById('root')).render( 
  <DarkModeProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/officer-forgot-password" element={<OfficerForgotPassword />} />
        <Route path="/admin-forgot-password" element={<AdminForgotPassword />} />
        <Route path="/officer-otp" element={<OfficerOtp />} />
        <Route path="/admin-otp" element={<AdminOtp />} />

        {/* Admin dashboard layout and nested routes */}
        <Route path="/admin-dashboard" element={<AdminDashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="register-pwd" element={<RegisterPWD />} />
          <Route path="records" element={<PWDRecords />} />
          <Route path="records/:id" element={<PWDDetails />} />          
        </Route>
        <Route path="/*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  </DarkModeProvider>
)
