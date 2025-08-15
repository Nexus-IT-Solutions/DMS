// AddUser.jsx
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const AddUser = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    profile_image: '',
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_image') {
      setFormData({ ...formData, profile_image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    payload.append('username', formData.username);
    payload.append('email', formData.email);
    payload.append('password', formData.password);
    payload.append('role', formData.role);
    if (formData.profile_image) {
      payload.append('profile_image', formData.profile_image);
    }

    fetch('https://disability-management-api.onrender.com/v1/users', {
      method: 'POST',
      body: payload
    })
      .then(res => res.json())
      .then(result => {
        setLoading(false);
        if (result.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'User Added',
            text: `${formData.username} has been successfully added.`,
          }).then(() => navigate('/admin-dashboard/user-management'));
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: result.message || 'Failed to add user.',
          });
        }
      })
      .catch(() => {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Network Error',
          text: 'Could not add user.',
        });
      });
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
          
          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
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
              <label htmlFor="profile_image" className="block text-sm font-medium text-gray-300">
                Profile Image
              </label>
              <input
                id="profile_image"
                type="file"
                name="profile_image"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-white"
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-white"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="h-5 w-5" />
                  ) : (
                    <AiOutlineEye className="h-5 w-5" />
                  )}
                </button>
              </div>
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
                <option value="admin">ADMIN</option>
                <option value="officer">DATA ENTRY OFFICER</option>
                {/* <option value="ASSISTANCE OFFICER">ASSISTANCE OFFICER</option>
                <option value="VIEWER">VIEWER</option> */}
              </select>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
