import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { IoIosArrowBack } from 'react-icons/io';

const statusOptions = [
  'pending',
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
  const user = JSON.parse(localStorage.getItem("dms_user"));
  const user_id = user?.user_id;

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

  const handleStatusUpdate = async (status, admin_notes) => {
    setUpdating(true);
    try {
      const res = await fetch(`https://disability-management-api.onrender.com/v1/assistance-requests/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, admin_notes, user_id }),
        mode: 'cors',
        credentials: 'include'
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
        setRequest(result.data);
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

  const openStatusModal = (status) => {
    Swal.fire({
      title: `Add a note for changing status to "${status}"`,
      input: 'textarea',
      inputPlaceholder: 'Enter your notes here...',
      showCancelButton: true,
      confirmButtonText: 'Update Status',
      customClass: {
        popup: 'bg-white rounded-lg',
        title: 'text-gray-900',
        input: 'swal2-input',
      },
      background: 'rgb(255, 255, 255)'
    }).then((result) => {
      if (result.isConfirmed) {
        handleStatusUpdate(status, result.value);
      }
    });
  }

  if (loading) return <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!request) return <div className="bg-gray-900 min-h-screen flex items-center justify-center text-red-500">Request not found.</div>;

  return (
    <div className="bg-gray-900 min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="text-white bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg"
                >
                    <IoIosArrowBack className="inline-block mr-2 text-lg -mt-1" />
                    Back
                </button>
                <h2 className="text-2xl font-bold text-center flex-1 text-white">Edit Assistance Request</h2>
                <div className="w-24"></div>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <p className="text-sm text-gray-400">Beneficiary</p>
                        <p className="text-lg font-bold text-white">{request.beneficiary_name || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Assistance Type</p>
                        <p className="text-lg text-white">{request.assistance_type_name || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Amount/Value</p>
                        <p className="text-lg text-white">{request.amount_value_cost || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Request Date</p>
                        <p className="text-lg text-white">{new Date(request.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-sm text-gray-400">Current Status</p>
                        <p className="text-lg font-bold text-teal-400">{request.status || 'pending'}</p>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-8">
                    <h3 className="text-lg font-semibold text-white mb-4">Update Status</h3>
                    <div className="flex flex-wrap gap-4">
                        {statusOptions.map(status => (
                            <button
                                key={status}
                                className={`px-5 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                                    request.status === status
                                        ? 'bg-teal-500 text-white cursor-not-allowed'
                                        : 'bg-gray-700 text-gray-200 hover:bg-teal-600'
                                }`}
                                disabled={updating || request.status === status}
                                onClick={() => openStatusModal(status)}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default EditAssistanceRequest;
