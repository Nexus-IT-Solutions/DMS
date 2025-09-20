import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
        const response = await fetch(`http://app.dms-api.com/v1/assistance-requests/${id}`, {
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

    fetchAssistanceDetails();
  }, [id, user.token]);

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
        </div>
      </div>
    </div>
  );
};

export default AssistanceDetails;

