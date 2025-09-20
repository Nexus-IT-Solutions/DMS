
// ResetPassword.js
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (e.target.name === 'otp') {
      localStorage.setItem('reset_otp', e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.newPassword !== formData.confirmPassword) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Passwords do not match' });
      return;
    }
    const otp = localStorage.getItem('reset_otp');
    if (!otp) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'OTP not found. Please request a new one.' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://app.dms-api.com/v1/users/password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otp,
          new_password: formData.newPassword
        })
      });
      const result = await res.json();
      if (result.status === 'success') {
        Swal.fire({ icon: 'success', title: 'Success', text: result.message || 'Password reset successful' });
        setTimeout(() => navigate('/'), 1500);
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: result.message || 'Error resetting password' });
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'An error occurred while resetting password' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-xl shadow-2xl border border-gray-700">
        <div>
          <h1 className="text-3xl font-extrabold text-center text-white mb-2">Reset Password</h1>
          <p className="text-center text-gray-400 text-sm">Enter your username and new password below</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-5">
            <div>
              <label htmlFor="newPassword" className="text-sm font-medium text-gray-300 block mb-2">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                minLength={8}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-600 placeholder-gray-500 text-white rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter new password"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300 block mb-2">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={8}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-600 placeholder-gray-500 text-white rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Confirm new password"
                disabled={loading}
              />
            </div>
          </div>
          {error && (
            <div className="rounded-md bg-red-500 bg-opacity-10 p-4">
              <p className="text-sm text-red-400 text-center">{error}</p>
            </div>
          )}
          <button 
            type="submit" 
            disabled={loading}
            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2  transition duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed ${loading ? 'cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resetting...
              </span>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
 
};

export default ResetPassword;
