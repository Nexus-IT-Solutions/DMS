import {  useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"
import Swal from 'sweetalert2';
import { FaEye, FaCheck, FaTimes } from 'react-icons/fa';



const AssistanceTracking = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('https://disability-management-api.onrender.com/v1/assistance-requests')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && Array.isArray(data.data)) {
          setRequests(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = requests.filter(
    (entry) =>
      (entry.assistance_type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.beneficiary_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this assistance request?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });
    if (result.isConfirmed) {
      setDeleting(id);
      try {
        const res = await fetch(`https://disability-management-api.onrender.com/v1/assistance-requests/${id}`, {
          method: 'DELETE'
        });
        const result = await res.json();
        if (result.status === 'success') {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Deleted successfully!',
            showConfirmButton: false,
            timer: 2000,
            background: '#232b3e',
            color: '#fff',
          });
          setRequests(prev => prev.filter(r => r.id !== id));
        } else {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: result.message || 'Delete failed!',
            showConfirmButton: false,
            timer: 2000,
            background: '#232b3e',
            color: '#fff',
          });
        }
      } catch (err) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Network error!',
          showConfirmButton: false,
          timer: 2000,
          background: '#232b3e',
          color: '#fff',
        });
      }
      setDeleting(null);
    }
  };

  return (
    <div className="dark text-white p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8 bg-gray-800 p-6 rounded-lg">
        <div>
          <h2 className="text-2xl font-bold mb-2">Assistance Tracking</h2>
          <p className="text-gray-400">Log and manage assistance provided to PWDS</p>
        </div>
        {/* <button
          onClick={() => navigate('/admin-dashboard/log-assistance')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
        >
          + Log New Assistance
        </button> */}
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-900 border-b border-gray-700">
              <th className="p-4 text-left font-semibold">Date</th>
              <th className="p-4 text-left font-semibold">Assistance Type</th>
              <th className="p-4 text-left font-semibold">Beneficiary</th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-gray-400 py-8 text-center">No requests found.</td></tr>
            ) : (
              filtered.map((req) => (
                <tr key={req.id} className="border-b border-gray-700 hover:bg-gray-700 transition duration-150">
                  <td className="p-4 font-medium">{req.request_date || 'N/A'}</td>
                  <td className="p-4 font-medium">{req.assistance_type || 'N/A'}</td>
                  <td className="p-4 font-medium">{req.beneficiary_name || 'N/A'}</td>
                  <td className="p-4 font-medium">{req.status || 'pending'}</td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => navigate(`/admin-dashboard/view-assistance/${req.id}`)}
                      className="text-white hover:text-purple-300 transition duration-200 p-2 hover:bg-gray-600 rounded-full"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => navigate(`/admin-dashboard/edit-assistance/${req.id}`)}
                      className="text-white hover:text-blue-300 transition duration-200 p-2 hover:bg-gray-600 rounded-full"
                      title="Edit Request"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => handleDelete(req.id)}
                      className="text-white hover:text-red-300 transition duration-200 p-2 hover:bg-gray-600 rounded-full"
                      title="Delete Request"
                      disabled={deleting === req.id}
                    >
                      <FaTimes />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssistanceTracking;

