import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AdminLogin from "./pages/(auth)/AdminLogin.jsx"
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
import PWDDetails from "./pages/admin/PWDDetails.jsx"
import OfficerDashboardLayout from "./components/officer/OfficerDashboardLayout.jsx"
import OfficerDashboard from "./pages/officer/OfficerDashboard.jsx"
import OfficerPWDRecords from "./pages/officer/PWDRecords.jsx"
import OfficerRegisterPWD from "./pages/officer/RegisterPWD.jsx"
import AssistanceTracking from "./pages/admin/Assistance_Tracking.jsx"
import AssistanceDetails from "./pages/admin/AssistanceDetails.jsx"
import LogAssistance from "./pages/admin/LogAssistance.jsx"


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
          <Route path="assistance-tracking" element={<AssistanceTracking />} />
          <Route path="log-assistance" element={<LogAssistance />} />
          <Route path="view-assistance/:id" element={<AssistanceDetails />} />
        </Route>

        {/* Officer dashboard layout and nested routes */}
        <Route path="/officer-dashboard" element={<OfficerDashboardLayout />}>
          <Route index element={<OfficerDashboard />} />
          <Route path="register-pwd" element={<OfficerRegisterPWD />} />
          <Route path="records" element={<OfficerPWDRecords />} />
          <Route path="records/:id" element={<PWDDetails />} />          
        </Route>

        {/* 404 Page */}
        <Route path="/*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  </DarkModeProvider>
)

