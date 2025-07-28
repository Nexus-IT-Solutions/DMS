import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const fakeData = [
  {
    date: '3/2/2025',
    type: 'Financial Support', 
    beneficiary: 'Kwame Asante',
    assessment: 'Assessed',
    notes: 'Funds were disbursed after pre-evaluation.',
    documents: ['report.pdf'],
  },
  {
    date: '3/12/2025',
    type: 'Assistive Devices',
    beneficiary: 'Akosua Mensah', 
    assessment: 'Assessed',
    notes: 'Wheelchair and white cane support.',
    documents: ['device-image.jpg'],
  },
  {
    date: '8/24/2025',
    type: 'Assistive Devices',
    beneficiary: 'Adwoa Dora',
    assessment: 'Not Assessed',
    notes: 'Emergency need reported. No prior assessment.',
    documents: [],
  },
];

const AssistanceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = fakeData[id];

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate(-1)} className="text-gray-300 hover:text-white transition-colors text-sm cursor-pointer">
            ← Back
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
                <p className="text-base font-medium text-white">{data.date}</p>
              </div>
              <div className="bg-gray-700 p-5 rounded-lg border border-gray-600">
                <p className="text-xs text-gray-300">Assistance Type</p>
                <p className="text-base font-medium text-white">{data.type}</p>
              </div>
              <div className="bg-gray-700 p-5 rounded-lg border border-gray-600 col-span-2">
                <p className="text-xs text-gray-300">Beneficiary</p>
                <p className="text-base font-medium text-white">{data.beneficiary}</p>
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
                  <span className={`inline-block px-3 py-1 rounded-full ${
                    data.assessment === 'Assessed' ? 'bg-green-900 text-green-100' : 'bg-yellow-900 text-yellow-100'
                  }`}>
                    {data.assessment}
                  </span>
                </p>
              </div>
              <div className="bg-gray-700 p-5 rounded-lg border border-gray-600">
                <p className="text-xs text-gray-300">Assessment Notes</p>
                <p className="text-base font-medium text-white">{data.notes}</p>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Supporting Documents</h3>
            <div className="bg-gray-700 p-5 rounded-lg border border-gray-600">
              {data.documents.length > 0 ? (
                <ul className="space-y-2">
                  {data.documents.map((doc, i) => (
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

