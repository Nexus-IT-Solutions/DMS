import { Link } from "react-router-dom";
import React, { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { DarkModeContext } from '../../components/ThemedContext';

const OfficerLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isDark, toggleDarkMode } = useContext(DarkModeContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!acceptTerms) return;
    setLoading(true);
    try {
      const res = await fetch('https://app.dms-api.com/v1/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const result = await res.json();
      if (result.status === 'success' && result.user) {
        localStorage.setItem('dms_user', JSON.stringify(result.user));
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: result.message || 'Login successful',
          showConfirmButton: false,
          timer: 2000,
          background: '#232b3e',
          color: '#fff',
        });
        setTimeout(() => {
          window.location.href = '/officer-dashboard';
        }, 1200);
      } else {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: result.message || 'Login failed',
          showConfirmButton: false,
          timer: 2000,
          background: '#232b3e',
          color: '#fff',
        });
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Network error',
        showConfirmButton: false,
        timer: 2000,
        background: '#232b3e',
        color: '#fff',
      });
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-stretch bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-950">
      {/* Left Section: Image with Gradient Overlay */}
      <div className="hidden md:flex md:w-1/2 relative items-center justify-center bg-gray-200 dark:bg-gray-800">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"
          alt="Disability Management Illustration"
          className="object-cover w-full h-full min-h-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/70 to-blue-900/80 dark:from-teal-800/80 dark:to-gray-900/90 mix-blend-multiply" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg mb-2">Officer Portal</h2>
          <p className="text-white/90 text-base md:text-lg font-medium">Secure access for data entry officers</p>
        </div>
      </div>
      {/* Right Section: Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center relative bg-white/80 dark:bg-gray-900/90 min-h-screen">
        {/* Dark/Light Mode Toggle Icon */}
        <button
          onClick={toggleDarkMode}
          className="absolute top-6 right-6 z-10 p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors focus:outline-none shadow"
          aria-label="Toggle dark mode"
        >
          {isDark ? (
            // Sun icon for light mode
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21m8.25-9H21M3 12h2.25m12.02-6.02l-1.59 1.59m-9.19 9.19l-1.59 1.59m12.02 0l-1.59-1.59m-9.19-9.19l-1.59-1.59M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z" />
            </svg>
          ) : (
            // Moon icon for dark mode
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-700 dark:text-gray-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 15.002A9.718 9.718 0 0 1 12 21.75a9.75 9.75 0 0 1 0-19.5c.31 0 .617.016.922.047a.75.75 0 0 1 .37 1.33A7.5 7.5 0 0 0 19.5 15.08a.75.75 0 0 1 1.33.37c.03.305.047.612.047.922Z" />
            </svg>
          )}
        </button>
        <div className="flex flex-col justify-center h-full p-8 md:p-10 max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">Officer Login</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Sign in to your account</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1" htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 dark:text-gray-500 focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {/* Font Awesome style eye/eye-slash icon */}
                  {showPassword ? (
                    // Eye-slash icon
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor" className="w-5 h-5">
                      <path d="M320 400c-49.6 0-95.2-21.5-134.1-56.7l-46.2 36.7C192.7 429.2 254.2 464 320 464c97.2 0 183.2-55.1 230.3-136.1c6.2-10.2 6.2-22.7 0-32.9c-18.7-30.7-43.2-57.2-71.7-77.7l-46.2 36.7C415.2 378.5 369.6 400 320 400zM320 112c49.6 0 95.2 21.5 134.1 56.7l46.2-36.7C447.3 82.8 385.8 48 320 48C222.8 48 136.8 103.1 89.7 184.1c-6.2 10.2-6.2 22.7 0 32.9c18.7 30.7 43.2 57.2 71.7 77.7l46.2-36.7C224.8 133.5 270.4 112 320 112z" />
                    </svg>
                  ) : (
                    // Eye icon
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" className="w-5 h-5">
                      <path d="M572.52 241.4C518.7 135.5 407.8 64 288 64S57.3 135.5 3.48 241.4a48.35 48.35 0 0 0 0 29.2C57.3 376.5 168.2 448 288 448s230.7-71.5 284.52-177.4a48.35 48.35 0 0 0 0-29.2zM288 400c-61.9 0-112-50.1-112-112s50.1-112 112-112s112 50.1 112 112s-50.1 112-112 112z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="flex justify-end items-center mt-2">
                
  <Link to="/officer-forgot-password" className="text-sm text-teal-600 hover:underline dark:text-teal-400">Forgot password?</Link>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={e => setAcceptTerms(e.target.checked)}
                required
                className="accent-teal-600 w-4 h-4"
              />
              <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300 select-none">
                
  I agree to the <Link to="#" className="underline text-teal-600 dark:text-teal-400">Terms and Conditions</Link>
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled={!acceptTerms}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OfficerLogin;
