import React, { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { DarkModeContext } from '../ThemedContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const { isDark } = useContext(DarkModeContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://app.dms-api.com/v1/users/password/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const result = await res.json();
      if (result.status === 'success') {
        Swal.fire({ icon: 'success', title: 'Success', text: result.message || 'Reset link sent! Check your email.' });
        navigate('/admin-otp');
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: result.message || 'Failed to send reset link.' });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Network error. Please try again.' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-950 px-4">
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-900/90 rounded-2xl shadow-2xl p-8 md:p-10 border border-gray-200 dark:border-gray-800 backdrop-blur-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">Admin Forgot Password</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Enter your email to reset your password</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 font-semibold rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 text-white'}`}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
  {/* SweetAlert handles notifications */}
        <div className="mt-6 text-center">
          <a href="/admin" className="text-teal-600 dark:text-teal-400 hover:underline">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword; 