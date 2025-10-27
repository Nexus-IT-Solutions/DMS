import React, { useState, useRef, useEffect } from 'react';
// import { useDarkMode } from '../ThemedContext';
import axios from 'axios';

  
const OfficerOtp = () => {

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [status, setStatus] = useState('');
  // const { setDarkMode } = useDarkMode();
  // useEffect(() => {
  //   setDarkMode(true);
  // }, [setDarkMode]);
  // const inputsRef = useRef([]);

  const handleChange = (e, idx) => {
    const value = e.target.value.replace(/\D/g, '');
    if (!value) return;
    const newOtp = [...otp];
    newOtp[idx] = value[0];
    setOtp(newOtp);
    if (idx < 5 && value) {
      inputsRef.current[idx + 1].focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      if (otp[idx]) {
        const newOtp = [...otp];
        newOtp[idx] = '';
        setOtp(newOtp);
      } else if (idx > 0) {
        inputsRef.current[idx - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(''));
      inputsRef.current[5].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    const otpValue = otp.join('');
    if (otpValue.length !== 6) return;
    setLoading(true);
    try {
      const response = await axios.post('https://disability-management-api.onrender.com/v1/users/password/verify-otp', { otp: otpValue });
      const result = response.data;
      if (result.status === 'success') {
        localStorage.setItem('reset_otp', otpValue);
        setStatus('success');
        Swal.fire({ icon: 'success', title: 'Success', text: result.message || 'OTP verified successfully!' });
        setTimeout(() => navigate('/officer-reset-password'), 1500);
      } else {
        setStatus('error');
        Swal.fire({ icon: 'error', title: 'Error', text: result.message || 'OTP verification failed. Try again.' });
      }
    } catch (error) {
      setStatus('error');
      Swal.fire({ icon: 'error', title: 'Error', text: 'An error occurred during OTP verification.' });
    }
    setLoading(false);
  };

  const handleResend = async (e) => {
    e.preventDefault();
    setStatus('');
    setResendLoading(true);
    try {
      const response = await axios.post('https://disability-management-api.onrender.com/v1/users/password/verify-otp', { resend: true });
      const result = response.data;
      if (result.status === 'success') {
        setStatus('resent');
        Swal.fire({ icon: 'success', title: 'Success', text: result.message || 'OTP resent! Check your email.' });
      } else {
        setStatus('error');
        Swal.fire({ icon: 'error', title: 'Error', text: result.message || 'Error resending OTP.' });
      }
    } catch (error) {
      setStatus('error');
      Swal.fire({ icon: 'error', title: 'Error', text: 'An error occurred while resending OTP.' });
    }
    setResendLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-950 px-4">
  <div className="w-full max-w-md bg-gray-900/90 rounded-2xl shadow-2xl p-8 md:p-10 border border-gray-800 backdrop-blur-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">Officer OTP Verification</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Enter the OTP sent to your email</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={el => inputsRef.current[idx] = el}
                type="text"
                inputMode="numeric"
                pattern="[0-9]{1}"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(e, idx)}
                onKeyDown={e => handleKeyDown(e, idx)}
                className="w-12 h-12 md:w-14 md:h-14 text-center text-2xl rounded-lg border border-gray-700 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                autoFocus={idx === 0}
                required
                disabled={loading || resendLoading}
              />
            ))}
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 font-semibold rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 text-white'}`}
            disabled={otp.join('').length !== 6 || loading || resendLoading}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
  {/* SweetAlert handles all notifications. No need for status divs. */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleResend}
            className={`text-teal-600 dark:text-teal-400 hover:underline text-sm ${resendLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={resendLoading || loading}
          >
            {resendLoading ? 'Resending...' : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfficerOtp; 