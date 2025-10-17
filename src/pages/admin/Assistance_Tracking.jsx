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
        if (data.status === 'success' && data.data && Array.isArray(data.data)) {
          setRequests(data.data);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.message || 'Failed to fetch assistance requests.',
            background: '#232b3e',
            color: '#fff',
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Network Error',
          text: 'Could not fetch assistance requests.',
          background: '#232b3e',
          color: '#fff',
        });
      });
  }, []);

  const filtered = requests.filter(
    (entry) =>
      (entry.assistance_type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.beneficiary_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
  const user = JSON.parse(localStorage.getItem('dms_user'));
  const user_id = user?.user_id;
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
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id }),
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
          setRequests(prev => prev.filter(r => r.request_id !== id));
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
                <tr key={req.request_id} className="border-b border-gray-700 hover:bg-gray-700 transition duration-150">
                  <td className="p-4 font-medium">{new Date(req.created_at).toLocaleDateString() || 'N/A'}</td>
                  <td className="p-4 font-medium">{req.assistance_type_name || 'N/A'}</td>
                  <td className="p-4 font-medium">{req.beneficiary_name || 'N/A'}</td>
                  <td className="p-4 font-medium">{req.status || 'pending'}</td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => req.request_id && navigate(`/admin-dashboard/view-assistance/${req.request_id}`)}
                      className="text-white hover:text-purple-300 transition duration-200 p-2 hover:bg-gray-600 rounded-full"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => req.request_id && navigate(`/admin-dashboard/edit-assistance/${req.request_id}`)}
                      className="text-white hover:text-blue-300 transition duration-200 p-2 hover:bg-gray-600 rounded-full"
                      title="Edit Request"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0l-10 10A2 2 0 004 15.414V18a1 1 0 001 1h2.586a2 2 0 001.414-.586l10-10a2 2 0 000-2.828l-2-2zM5 16v-1.586l10-10L16.586 6l-10 10H5zm2.586 1H5v-2.586l10-10L18.586 7l-10 10z" /></svg>
                    </button>
                    <button
                      onClick={() => handleDelete(req.request_id)}
                      className="text-white hover:text-red-300 transition duration-200 p-2 hover:bg-gray-600 rounded-full"
                      title="Delete Request"
                      disabled={deleting === req.request_id}
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
