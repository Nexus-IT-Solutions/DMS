import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useDarkMode } from '../ThemedContext';
import {
  RiDashboardLine, RiUserAddLine, RiFileListLine, RiFileWarningLine,
  RiUserSettingsLine, RiLogoutBoxLine, RiMenuLine, RiSearchLine,
  RiMoonLine, RiSunLine, RiUserLine
} from 'react-icons/ri';
// import { SiSimpleanalytics } from "react-icons/si";

const navItems = [
  { label: 'Dashboard', path: '/officer-dashboard', icon: RiDashboardLine },
  { label: 'Register PWD', path: '/officer-dashboard/register-pwd', icon: RiUserAddLine },
  { label: 'PWD Records', path: '/officer-dashboard/records', icon: RiFileListLine },
  { label: 'Request Assistance', path: '/officer-dashboard/request-assistance', icon: RiFileWarningLine },
  { label: 'Profile', path: '/officer-dashboard/profile', icon: RiUserLine },
//   { label: 'Reports', path: '/admin-dashboard/reports', icon: SiSimpleanalytics },
//   { label: 'User Management', path: '/admin-dashboard/user-management', icon: RiUserSettingsLine },
];


const OfficerDashboardLayout = () => {
  const { isDark, toggleDarkMode, setDarkMode } = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setDarkMode(true); // Always default to dark mode
    if (location.pathname === '/officer-dashboard' || location.pathname === '/officer-dashboard/') {
      navigate('/officer-dashboard');
    }
  }, [setDarkMode, location.pathname, navigate]);

  const handleLogout = () => {
  localStorage.removeItem("dms_user");
  window.location.href = "/";
};

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden text-sm">
      {/* Sidebar */}
      <aside className={`fixed md:relative z-30 h-full w-64 bg-[#151c2c] dark:bg-[#101624] flex flex-col justify-between py-6 px-4 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex-1">
          <div className="text-white tracking-widest text-lg font-bold mb-8">DMS</div>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200
                    ${isActive || (item.path === '/officer-dashboard' && location.pathname === '/officer-dashboard') ? 'bg-[#232b3e] dark:bg-[#1a2233] text-white' : 'text-gray-300 hover:bg-[#232b3e] dark:hover:bg-[#1a2233] hover:text-white'}`}
                >
                  <span className="flex-shrink-0">{item.icon()}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-gray-700 pt-4">
          <div className="text-xs text-gray-400 px-4 mb-3">Data Entry Officer</div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg text-sm text-gray-300 hover:bg-[#232b3e] dark:hover:bg-[#1a2233] hover:text-white transition-colors duration-200"
          >
            <RiLogoutBoxLine className="w-5 h-5 flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile: clicking outside sidebar closes it, but does not darken content */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 md:hidden"
          style={{ background: 'transparent' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-0">
        <header className="flex items-center justify-between px-6 h-16 bg-white dark:bg-[#151c2c] shadow-sm border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <RiMenuLine className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </button>
            <span className="text-base font-semibold text-gray-800 dark:text-gray-100">Officer Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-48 md:w-64">
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 border-0"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <RiSearchLine className="w-4 h-4" />
              </span>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {isDark ? <RiMoonLine className="w-5 h-5 text-yellow-400" /> : <RiSunLine className="w-5 h-5 text-gray-700 dark:text-gray-200" />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 overflow-auto space-y-6">
          {/* Render nested routes */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OfficerDashboardLayout;



