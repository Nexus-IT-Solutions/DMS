import { Link } from "react-router-dom";
import React, { useState } from 'react';
import Swal from 'sweetalert2';
// import { useDarkMode } from '../components/ThemedContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // const { setDarkMode } = useDarkMode();
  // React.useEffect(() => {
  //   setDarkMode(true);
  // }, [setDarkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!acceptTerms) return;
    setLoading(true);
    try {
      const res = await fetch('https://disability-management-api.onrender.com/v1/users/login', {
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
        setLoading(false);
        setTimeout(() => {
          if (result.user.role === 'admin') {
            window.location.href = '/admin-dashboard';
          } else if (result.user.role === 'officer') {
            window.location.href = '/officer-dashboard';
          }
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
  <div className="min-h-screen w-full flex items-stretch bg-gradient-to-br from-teal-600 to-blue-900">
      {/* Left Section: Image with Gradient Overlay */}
      <div className="hidden md:flex md:w-1/2 relative items-center justify-center bg-gray-200 dark:bg-gray-800">
        <img
          src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=900&q=80"
          alt="Disability Management - Accessible Workspace"
          className="object-cover w-full h-full min-h-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/70 to-blue-900/80 dark:from-teal-800/80 dark:to-blue-900/90 mix-blend-multiply" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg mb-2">Disability Management System</h2>
          <p className="text-white/90 text-base md:text-lg font-medium">Secure access for authorized personnel</p>
        </div>
      </div>
      {/* Right Section: Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center relative bg-gray-900/90 min-h-screen">
        <div className="flex flex-col justify-center h-full p-8 md:p-10 max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">Login</h2>
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
                
  <Link to="/forgot-password" className="text-sm text-teal-600 hover:underline dark:text-teal-400">Forgot password?</Link>
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
            {/* {error && <div className="text-red-500 text-center text-sm">{error}</div>} */}
            <button
              type="submit"
              className={`w-full py-2 px-4 font-semibold rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 text-white'}`}
              disabled={loading || !acceptTerms}
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;