import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const data = [
  {
    date: '3/2/2025',
    type: 'Financial Support',
    beneficiary: 'Kwame Asante',
    assessment: 'Assessed',
  },
  {
    date: '3/12/2025',
    type: 'Assistive Devices',
    beneficiary: 'Akosua Mensah',
    assessment: 'Assessed',
  },
  {
    date: '8/24/2025',
    type: 'Assistive Devices',
    beneficiary: 'Adwoa Dora',
    assessment: 'Not Assessed',
  },
];

const AssistanceTracking = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = data.filter(
    (entry) =>
      entry.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.beneficiary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dark text-white p-5">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Assistance Tracking</h2>
          <p className="text-sm text-gray-400">Log and manage assistance provided to PWDS</p>
        </div>
        <button
          onClick={() => navigate('/log-assistance')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          + Log New Assistance
        </button>
      </div>

      <input
        type="text"
        placeholder="Search assistance type, name"
        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="w-full bg-gray-900 border border-gray-700 text-sm">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Assistance Type</th>
            <th className="p-2 text-left">Beneficiaries</th>
            <th className="p-2 text-left">Assessment</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((entry, idx) => (
            <tr key={idx} className="border-b border-gray-700 hover:bg-gray-800">
              <td className="p-2">{entry.date}</td>
              <td className="p-2">{entry.type}</td>
              <td className="p-2">{entry.beneficiary}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    entry.assessment === 'Assessed' ? 'bg-green-700' : 'bg-gray-600'
                  }`}
                >
                  {entry.assessment}
                </span>
              </td>
              <td className="p-2">
                <button
                  onClick={() => navigate(`/assistance/${idx}`)}
                  className="text-white hover:text-purple-300"
                >
                  👁
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssistanceTracking;
