import ProtectedAdminRoute from "./components/ProtectedAdminRoute.jsx";
import ProtectedOfficerRoute from "./components/ProtectedOfficerRoute.jsx";
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import RequestAssistance from "./pages/admin/RequestAssistance.jsx"
import ViewAssistance from "./pages/admin/ViewAssistance.jsx"
import OfficerRequestAssistance from "./pages/officer/RequestAssistance.jsx"
import OfficerViewAssistance from "./pages/officer/ViewAssistance.jsx"
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
import OfficerPWDDetails from "./pages/officer/OfficerPWDDetails.jsx"
import OfficerRegisterPWD from "./pages/officer/RegisterPWD.jsx"
import AssistanceTracking from "./pages/admin/Assistance_Tracking.jsx"
import AssistanceDetails from "./pages/admin/AssistanceDetails.jsx"
import LogAssistance from "./pages/admin/LogAssistance.jsx"
import ReportsAnalytics from "./pages/admin/ReportAnalytics.jsx"
import UserManagement from "./pages/admin/UserManagement.jsx"
import AddUser from "./components/admin/AddUser.jsx"
import EditUser from "./components/admin/EditUser.jsx"
import Profile from "./pages/admin/profile.jsx"
import Settings from "./pages/admin/Settings.jsx"
import OfficerResetPassword from "./components/officer/OfficerResetPassword.jsx"
import AdminResetPassword from "./components/admin/AdminResetPassword.jsx"
import OfficerAssistanceTracking from "./pages/officer/Assistance_Tracking.jsx"
import OfficerAssistanceDetails from "./pages/officer/AssistanceDetails.jsx"
import OfficerLogAssistance from "./pages/officer/LogAssistance.jsx"
import EditAssistanceRequest from "./pages/admin/EditAssistanceRequest.jsx"
import EditPWDRecord from "./pages/admin/EditPWDRecord";
import OfficerEditPWDRecord from "./pages/officer/EditPWDRecord";

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
        <Route path="/officer-reset-password" element={<OfficerResetPassword />} />
        <Route path="/admin-reset-password" element={<AdminResetPassword />} />

        {/* Admin dashboard protected route */}
        {/* <Route element={<ProtectedAdminRoute />}> */}
          <Route path="/admin-dashboard" element={<AdminDashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="register-pwd" element={<RegisterPWD />} />
            <Route path="records" element={<PWDRecords />} />
            <Route path="records/:id" element={<PWDDetails />} />   
            <Route path="assistance-tracking" element={<AssistanceTracking />} />
            <Route path="request-assistance" element={<RequestAssistance />} />
            <Route path="log-assistance" element={<LogAssistance />} />
            <Route path="view-assistance/:id" element={<ViewAssistance />} />
            <Route path="reports" element={<ReportsAnalytics />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="add-user" element={<AddUser />} />
            <Route path="edit-user/:id" element={<EditUser />} />
              <Route path="edit-assistance/:id" element={<EditAssistanceRequest />} />
              <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        {/* </Route> */}

        {/* Officer dashboard protected route */}
        <Route element={<ProtectedOfficerRoute />}>
          <Route path="/officer-dashboard" element={<OfficerDashboardLayout />}>
            <Route index element={<OfficerDashboard />} />
            <Route path="register-pwd" element={<OfficerRegisterPWD />} />
            <Route path="records" element={<OfficerPWDRecords />} />
            <Route path="records/:id" element={<OfficerPWDDetails />} />
            <Route path="assistance-tracking" element={<OfficerAssistanceTracking />} />
            <Route path="request-assistance" element={<OfficerRequestAssistance />} />
            <Route path="log-assistance" element={<OfficerLogAssistance />} />
            <Route path="view-assistance/:id" element={<OfficerViewAssistance />} />       
            <Route path="profile" element={<Profile />} />   
          </Route>
        </Route>
        <Route path="/admin-dashboard/records/edit/:id" element={<EditPWDRecord />} />
        <Route path="/officer-dashboard/records/edit/:id" element={<OfficerEditPWDRecord />} />
        <Route path="/admin-dashboard/request-assistance" element={<RequestAssistance />} />
        <Route path="/officer-dashboard/request-assistance" element={<OfficerRequestAssistance />} />

        {/* 404 Page */}
        <Route path="/*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  </DarkModeProvider>
)

