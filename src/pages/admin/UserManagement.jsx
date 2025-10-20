import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch('http://app.dms-api.com/v1/users', {
      method: "GET",
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success' && result.users) {
          setUsers(result.users);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    const confirmed = await Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete this user!",
      icon: 'warning', 
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      background: '#1f2937',
      color: '#fff',
    });
    if (confirmed.isConfirmed) {
      try {
        const res = await fetch(`http://app.dms-api.com/v1/users/${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.status === 'success') {
          setUsers(users.filter(user => user.user_id !== id));
          Swal.fire({
            title: 'Deleted!',
            text: 'User has been removed.',
            icon: 'success',
            background: '#1f2937',
            color: '#fff',
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: result.message || 'Delete failed.',
            icon: 'error',
            background: '#1f2937',
            color: '#fff',
          });
        }
      } catch {
        Swal.fire({
          title: 'Error!',
          text: 'Network error.',
          icon: 'error',
          background: '#1f2937',
          color: '#fff',
        });
      }
    }
  };

  return (
    <div className="p-8 text-white bg-gradient-to-b from-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            User Management
          </h1>
          <p className="text-gray-400 mt-2">Manage system users and their roles</p>
        </div>
        
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate('/admin-dashboard/add-user')}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-2 rounded-lg shadow-lg transform transition hover:scale-105 flex items-center gap-2"
          >
            <span>+</span>
            <span>Add New User</span>
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-700 text-gray-200">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Created At</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8">Loading users...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8">No users found.</td></tr>
              ) : (
                users.map(user => (
                  <tr key={user.user_id} className="border-t border-gray-700 hover:bg-gray-700/50 transition-colors">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-purple-400">{user.username}</div>
                        <div className="text-gray-400 text-xs">{user.handle || `@${user.username?.toLowerCase().replace(/\s+/g, '_')}`}</div>
                      </div>
                    </td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">{user.created_at || '-'}</td>
                    <td className="p-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/admin-dashboard/edit-user/${user.user_id}`)}
                          className="p-2 hover:bg-blue-500/20 rounded-full transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(user.user_id)}
                          className="p-2 hover:bg-red-500/20 rounded-full transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
