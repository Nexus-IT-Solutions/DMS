// EditUser.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const mockUserData = {
  1: {
    username: 'System Administrator',
    email: 'admin@dms.gov.gh', 
    role: 'ADMIN',
  },
  2: {
    username: 'Data Entry Officer',
    email: 'data@dms.gov.gh',
    role: 'DATA ENTRY OFFICER',
  },
  3: {
    username: 'Assistance Coordinator', 
    email: 'coordinator@dms.gov.gh',
    role: 'ASSISTANCE OFFICER',
  },
  4: {
    username: 'Report Viewer',
    email: 'viewer@dms.gov.gh',
    role: 'VIEWER',
  },
};

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
    profile_image: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`https://disability-management-api.onrender.com/v1/users/${id}`)
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.status === 'success') {
          setFormData({
            username: data.data.username,
            email: data.data.email,
            role: data.data.role,
            profile_image: data.data.profile_image || '',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.message || 'Failed to load user info.',
          });
        }
      })
      .catch(() => {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Network Error',
          text: 'Could not load user info.',
        });
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`https://disability-management-api.onrender.com/v1/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(result => {
        setLoading(false);
        if (result.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'User Updated',
            text: `${formData.username}'s info has been updated.`,
          }).then(() => navigate('/admin-dashboard/user-management'));
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: result.message || 'Failed to update user.',
          });
        }
      })
      .catch(() => {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Network Error',
          text: 'Could not update user.',
        });
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/admin-dashboard/user-management')}
          className="mb-8 flex items-center text-gray-300 hover:text-white transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to User Management
        </button>

        <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Edit User Profile</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition duration-200"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="DATA ENTRY OFFICER">DATA ENTRY OFFICER</option>
                  <option value="ASSISTANCE OFFICER">ASSISTANCE OFFICER</option>
                  <option value="VIEWER">VIEWER</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 text-white font-medium py-3 px-4 rounded-lg transition duration-200 transform hover:scale-[1.02]"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Update User'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
