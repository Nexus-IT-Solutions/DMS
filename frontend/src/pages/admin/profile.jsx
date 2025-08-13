import React, { useState } from 'react';
import Swal from 'sweetalert2';

export default function Profile() {
  const [avatar, setAvatar] = useState('https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y');
  const [username, setUsername] = useState('System Administrator');
  const [email, setEmail] = useState('admin@dms.gov.gh');
  const [role, setRole] = useState('ADMIN');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmOldPassword, setConfirmOldPassword] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (confirmOldPassword !== oldPassword) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Incorrect Old Password",
        showConfirmButton: false,
        timer: 2500,
        background: "#232b3e",
        color: "#fff",
      });
      return;
    }
    try {
      const payload = {
        username,
        email,
        role: "admin",
        profile_image: avatar,
      };
      // Replace 1 with actual user id from context/session
      const response = await fetch(`https://disability-management-api.onrender.com/v1/users/1`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.status === "success") {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Profile Updated!",
          showConfirmButton: false,
          timer: 2500,
          background: "#232b3e",
          color: "#fff",
        });
      } else {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: result.message || "Update failed!",
          showConfirmButton: false,
          timer: 2500,
          background: "#232b3e",
          color: "#fff",
        });
      }
    } catch (error) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Network error!",
        showConfirmButton: false,
        timer: 2500,
        background: "#232b3e",
        color: "#fff",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900 backdrop-blur-lg overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">
                Profile Settings
              </h2>
              <p className="mt-2 text-sm text-gray-400">Manage your account preferences and settings</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <img
                    src={avatar}
                    alt="Profile Avatar"
                    className="w-32 h-32 rounded-full border-4 border-purple-500/30 object-cover transition group-hover:border-purple-500"
                  />
                  <label className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 cursor-pointer shadow-lg hover:bg-purple-700 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Role</label>
                  <input
                    type="text"
                    value={role}
                    readOnly
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="border-t border-gray-800 pt-8">
                <h3 className="text-lg font-medium text-gray-200 mb-4">Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Current Password</label>
                    <input
                      type="password"
                      value={confirmOldPassword}
                      onChange={(e) => setConfirmOldPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setOldPassword(e.target.value);
                      }}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-150 ease-in-out hover:scale-105"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
