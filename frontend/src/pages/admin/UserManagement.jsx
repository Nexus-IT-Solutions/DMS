import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const initialUsers = [
  {
    id: 1,
    username: 'System Administrator', 
    handle: '@admin',
    email: 'admin@dms.gov.gh',
    role: 'ADMIN',
    created: '1/1/2024',
  },
  {
    id: 2,
    username: 'Data Entry Officer',
    handle: '@data_officer', 
    email: 'data@dms.gov.gh',
    role: 'DATA ENTRY OFFICER',
    created: '1/1/2024',
  },
  {
    id: 3,
    username: 'Assistance Coordinator',
    handle: '@coordinator',
    email: 'coordinator@dms.gov.gh',
    role: 'ASSISTANCE OFFICER', 
    created: '1/1/2024',
  },
  {
    id: 4,
    username: 'Report Viewer',
    handle: '@viewer',
    email: 'viewer@dms.gov.gh',
    role: 'VIEWER',
    created: '1/1/2024',
  }
];

export default function UserManagement() {
  const [users, setUsers] = useState(initialUsers);
  const navigate = useNavigate();

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete this user!",
      icon: 'warning', 
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      background: '#1f2937',
      color: '#fff',
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers(users.filter(user => user.id !== id));
        Swal.fire({
          title: 'Deleted!',
          text: 'User has been removed.',
          icon: 'success',
          background: '#1f2937',
          color: '#fff',
        });
      }
    });
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
                <th className="p-4">Created</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-t border-gray-700 hover:bg-gray-700/50 transition-colors">
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-purple-400">{user.username}</div>
                      <div className="text-gray-400 text-xs">{user.handle}</div>
                    </div>
                  </td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">{user.created}</td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/admin-dashboard/edit-user/${user.id}`)}
                        className="p-2 hover:bg-blue-500/20 rounded-full transition-colors"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 hover:bg-red-500/20 rounded-full transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
