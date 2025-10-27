import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { IoIosArrowBack } from 'react-icons/io';

const AssistanceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assistanceDetails, setAssistanceDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem('dms_user'));

  useEffect(() => {
    const fetchAssistanceDetails = async () => {
      try {
        const response = await fetch(`https://disability-management-api.onrender.com/v1/assistance-requests/${id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch assistance details');
        }
        const result = await response.json();
        setAssistanceDetails(result.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.token) {
        fetchAssistanceDetails();
    }
  }, [id, user.token]);

  const handleStatusUpdate = async (status, admin_notes) => {
    try {
      const response = await fetch(`https://disability-management-api.onrender.com/v1/assistance-requests/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ status, admin_notes, user_id: user.user_id })
      });

      if (!response.ok) {
        throw new Error(`Failed to update status to ${status}`);
      }

      const result = await response.json();

      Swal.fire({
        icon: 'success',
        title: `Assessment ${status}`,
        text: `The assessment has been successfully updated to ${status}`,
      });

      setAssistanceDetails(result.data);

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    }
  };

  const openStatusModal = (status) => {
    Swal.fire({
      title: `Add a note for changing status to "${status}"`,
      input: 'textarea',
      inputPlaceholder: 'Enter your notes here...',
      showCancelButton: true,
      confirmButtonText: 'Update Status',
      customClass: {
  popup: 'bg-gray-900 rounded-lg',
        title: 'text-gray-900',
        input: 'swal2-input',
      },
      background: 'rgba(0,0,0,0)'
    }).then((result) => {
      if (result.isConfirmed) {
        handleStatusUpdate(status, result.value);
      }
    });
  }

  if (loading) {
  return <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (error) {
  return <div className="bg-gray-900 min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  if (!assistanceDetails) {
  return <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">No assistance details found.</div>;
  }

  const {
    created_at,
    assistance_type_name,
    beneficiary_name,
    status,
    admin_review_notes,
    supporting_documents
  } = assistanceDetails;

  return (
  <div className="bg-gray-900 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-white bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded"
          >
            <IoIosArrowBack className="inline-block mr-2 text-lg -mt-1" />
            Back
          </button>
          <h2 className="text-xl font-bold text-center flex-1 text-white">Assistance Details</h2>
          <div className="w-16"></div>
        </div>

        <div className="space-y-8">
          {/* Basic Info Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Basic Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-700 p-5 rounded-lg border border-gray-600">
                <p className="text-xs text-gray-300">Date</p>
                <p className="text-base font-medium text-white">{new Date(created_at).toLocaleDateString()}</p>
              </div>
              <div className="bg-gray-700 p-5 rounded-lg border border-gray-600">
                <p className="text-xs text-gray-300">Assistance Type</p>
                <p className="text-base font-medium text-white">{assistance_type_name}</p>
              </div>
              <div className="bg-gray-700 p-5 rounded-lg border border-gray-600 col-span-2">
                <p className="text-xs text-gray-300">Beneficiary</p>
                <p className="text-base font-medium text-white">{beneficiary_name}</p>
              </div>
            </div>
          </div>

          {/* Assessment Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Assessment Details</h3>
            <div className="space-y-6">
              <div className="bg-gray-700 p-5 rounded-lg border border-gray-600">
                <p className="text-xs text-gray-300">Assessment Status</p>
                <p className="text-base font-medium">
                  <span className={`inline-block px-3 py-1 mt-3 rounded-full ${
                    status === 'assessed' ? 'bg-green-900 text-green-100' : 'bg-yellow-900 text-yellow-100'
                  }`}>
                    {status}
                  </span>
                </p>
              </div>
              <div className="bg-gray-700 p-5 rounded-lg border border-gray-600">
                <p className="text-xs text-gray-300">Assessment Notes</p>
                <p className="text-base font-medium text-white">{admin_review_notes || 'No notes available.'}</p>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Supporting Documents</h3>
            <div className="bg-gray-700 p-5 rounded-lg border border-gray-600">
              {supporting_documents && supporting_documents.length > 0 ? (
                <ul className="space-y-2">
                  {supporting_documents.map((doc, i) => (
                    <li key={i} className="flex items-center">
                      <span className="mr-2">📎</span>
                      <span className="text-blue-400 hover:text-blue-300 cursor-pointer text-sm">{doc}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm">No documents available</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-end">
            <button onClick={() => openStatusModal('pending')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">Set to Pending</button>
            <button onClick={() => openStatusModal('review')} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors">Set to Review</button>
            <button onClick={() => openStatusModal('ready_to_access')} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">Set to Ready to Access</button>
            <button onClick={() => openStatusModal('assessed')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">Set to Assessed</button>
            <button onClick={() => open_status_modal('declined')} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">Set to Declined</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AssistanceDetails;