import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"
import Swal from 'sweetalert2';
import { FaEye } from 'react-icons/fa';

const AssistanceTracking = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

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
      (entry.assistance_type_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.beneficiary_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dark text-white p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8 bg-gray-800 p-6 rounded-lg">
        <div>
          <h2 className="text-2xl font-bold mb-2">Assistance Tracking</h2>
          <p className="text-gray-400">Log and manage assistance provided to PWDS</p>
        </div>
        <button
          onClick={() => navigate('/officer-dashboard/log-assistance')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
        >
          + Log New Assistance
        </button>
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
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        req.status === 'assessed' 
                          ? 'bg-green-600 text-green-100' 
                          : 'bg-gray-600 text-gray-100'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => navigate(`/officer-dashboard/view-assistance/${req.request_id}`)}
                      className="text-white hover:text-purple-300 transition duration-200 p-2 hover:bg-gray-600 rounded-full"
                      title="View Details"
                    >
                      <FaEye />
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