import React, { useState, useContext, useRef } from 'react';
import { DarkModeContext } from '../ThemedContext';
import axios from 'axios';

const AdminOtp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [status, setStatus] = useState('');
  const { isDark } = useContext(DarkModeContext);
  const inputsRef = useRef([]);

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
    try {
      await axios.post('https://jsonplaceholder.typicode.com/posts', { otp: otpValue });
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    setStatus('');
    try {
      await axios.post('https://jsonplaceholder.typicode.com/posts', { resend: true });
      setStatus('resent');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-950 px-4">
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-900/90 rounded-2xl shadow-2xl p-8 md:p-10 border border-gray-200 dark:border-gray-800 backdrop-blur-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">Admin OTP Verification</h2>
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
                className="w-12 h-12 md:w-14 md:h-14 text-center text-2xl rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                autoFocus={idx === 0}
                required
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            disabled={otp.join('').length !== 6}
          >
            Verify OTP
          </button>
        </form>
        {status === 'success' && <div className="mt-4 text-green-600 text-center">OTP verified successfully!</div>}
        {status === 'error' && <div className="mt-4 text-red-600 text-center">OTP verification failed. Try again.</div>}
        {status === 'resent' && <div className="mt-4 text-blue-600 text-center">OTP resent! Check your email.</div>}
        <div className="mt-6 text-center">
          <button onClick={handleResend} className="text-teal-600 dark:text-teal-400 hover:underline text-sm">Resend OTP</button>
        </div>
      </div>
    </div>
  );
};

export default AdminOtp; 