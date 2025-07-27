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
    <div className="dark text-white p-5 max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-4 text-purple-400">
        ← Back
      </button>
      <h2 className="text-xl font-semibold mb-2">Assistance Details</h2>
      <div className="bg-gray-900 p-4 rounded border border-gray-700">
        <p><strong>Date:</strong> {data.date}</p>
        <p><strong>Assistance Type:</strong> {data.type}</p>
        <p><strong>Beneficiary:</strong> {data.beneficiary}</p>
        <p><strong>Assessment Status:</strong> {data.assessment}</p>
        <p><strong>Assessment Notes:</strong> {data.notes}</p>
        <p><strong>Supporting Documents:</strong></p>
        <ul className="list-disc ml-5">
          {data.documents.length > 0 ? data.documents.map((doc, i) => <li key={i}>{doc}</li>) : <li>None</li>}
        </ul>
      </div>
    </div>
  );
};

export default AssistanceDetails;
