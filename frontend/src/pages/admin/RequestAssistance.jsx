import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaEye } from 'react-icons/fa';

const RequestAssistance = () => {
  const navigate = useNavigate();
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

  return (
    <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg min-h-[500px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Request Assistance</h2>
        <button
          className="px-6 py-3 bg-teal-600 rounded-lg font-semibold hover:bg-teal-700"
          onClick={() => navigate('/admin-dashboard/log-assistance')}
        >
          Request New Assistance
        </button>
      </div>
      <div className="bg-gray-800 rounded-xl shadow p-6">
        <h3 className="text-lg font-bold mb-4">All Assistance Requests</h3>
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-3 px-2">Beneficiary</th>
                <th className="py-3 px-2">Type</th>
                <th className="py-3 px-2">Amount</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr><td colSpan={6} className="text-gray-400 py-6 text-center">No requests found.</td></tr>
              ) : (
                requests.map(req => (
                  <tr key={req.request_id}>
                    <td>{req.beneficiary_name}</td>
                    <td>{req.assistance_type_name}</td>
                    <td>{req.amount_value_cost}</td>
                    <td>{req.status}</td>
                    <td>{req.created_at}</td>
                    <td>
                      <button className="text-blue-400 hover:text-blue-600" onClick={() => req.request_id && navigate(`/admin-dashboard/view-assistance/${req.request_id}`)}><FaEye /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RequestAssistance;
