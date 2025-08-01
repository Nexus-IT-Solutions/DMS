// AddUser.jsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';

const AddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: 'success',
      title: 'User Added', 
      text: `${formData.username} has been successfully added.`,
    }).then(() => navigate('/admin/user-management'));
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <button
        onClick={() => navigate('/admin-dashboard/user-management')}
        className="mb-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition duration-200 flex items-center gap-2"
      >
        <MdArrowBack className="h-5 w-5" />
        Back
      </button>
      
      <div className="flex items-center justify-center">
        <div className="w-full max-w-lg p-8 space-y-8 bg-gray-800 rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold text-center text-white">Add New User</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium text-gray-300">
                User Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-white"
                required
              >
                <option value="" disabled>Select a role</option>
                <option value="ADMIN">ADMIN</option>
                <option value="DATA ENTRY OFFICER">DATA ENTRY OFFICER</option>
                <option value="ASSISTANCE OFFICER">ASSISTANCE OFFICER</option>
                <option value="VIEWER">VIEWER</option>
              </select>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                Add User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
