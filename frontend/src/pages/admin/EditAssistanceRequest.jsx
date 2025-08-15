import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const statusOptions = [
  'review',
  'ready_to_access',
  'assessed',
  'declined',
];

const EditAssistanceRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`https://disability-management-api.onrender.com/v1/assistance-requests/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.data) {
          setRequest(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleStatusUpdate = async (status) => {
    setUpdating(true);
    try {
      const res = await fetch(`https://disability-management-api.onrender.com/v1/assistance-requests/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const result = await res.json();
      if (result.status === 'success') {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `Status updated to ${status}!`,
          showConfirmButton: false,
          timer: 2000,
          background: '#232b3e',
          color: '#fff',
        });
        setRequest(prev => ({ ...prev, status }));
      } else {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: result.message || 'Update failed!',
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
    setUpdating(false);
  };

  if (loading) return <div className="text-center py-12 text-white">Loading...</div>;
  if (!request) return <div className="text-center py-12 text-red-400">Request not found.</div>;

  return (
    <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg min-h-[500px] max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Edit Assistance Request</h2>
      <div className="bg-gray-800 rounded-xl shadow p-6 mb-6">
        <div className="mb-4"><strong>Beneficiary:</strong> {request.beneficiary_name || 'N/A'}</div>
        <div className="mb-4"><strong>Type:</strong> {request.assistance_type || 'N/A'}</div>
        <div className="mb-4"><strong>Amount:</strong> {request.amount_value_cost || 'N/A'}</div>
        <div className="mb-4"><strong>Status:</strong> <span className="font-bold">{request.status || 'pending'}</span></div>
        <div className="mb-4"><strong>Date:</strong> {request.request_date || 'N/A'}</div>
        {/* Add more fields as needed */}
      </div>
      <div className="flex gap-4 flex-wrap">
        {statusOptions.map(status => (
          <button
            key={status}
            className={`px-5 py-2 rounded-lg font-semibold transition-colors duration-200 ${request.status === status ? 'bg-teal-700 text-white' : 'bg-gray-700 text-gray-200 hover:bg-teal-600'}`}
            disabled={updating || request.status === status}
            onClick={() => handleStatusUpdate(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <button
          className="px-6 py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default EditAssistanceRequest;
