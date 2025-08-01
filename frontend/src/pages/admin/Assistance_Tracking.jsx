import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

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

  const handleApprove = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You want to approve this assessment?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9333EA',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve it!'
    });

    if (result.isConfirmed) {
      try {
        // Placeholder API call
        const response = await fetch(`/api/assessments/${id}/approve`, {
          method: 'PUT'
        });

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Assessment Approved!',
            text: 'The assessment has been successfully approved',
            confirmButtonColor: '#9333EA'
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong while approving the assessment',
          confirmButtonColor: '#9333EA'
        });
      }
    }
  };

  const handleDisapprove = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You want to disapprove this assessment?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9333EA',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, disapprove it!'
    });

    if (result.isConfirmed) {
      try {
        // Placeholder API call
        const response = await fetch(`/api/assessments/${id}/disapprove`, {
          method: 'PUT'
        });

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Assessment Disapproved',
            text: 'The assessment has been disapproved',
            confirmButtonColor: '#9333EA'
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong while disapproving the assessment',
          confirmButtonColor: '#9333EA'
        });
      }
    }
  };

  return (
    <div className="dark text-white p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8 bg-gray-800 p-6 rounded-lg">
        <div>
          <h2 className="text-2xl font-bold mb-2">Assistance Tracking</h2>
          <p className="text-gray-400">Log and manage assistance provided to PWDS</p>
        </div>
        <button
          onClick={() => navigate('/admin-dashboard/log-assistance')}
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
              <th className="p-4 text-left font-semibold">Beneficiaries</th>
              <th className="p-4 text-left font-semibold">Assessment</th>
              <th className="p-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry, idx) => (
              <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700 transition duration-150">
                <td className="p-4 font-medium">{entry.date}</td>
                <td className="p-4 font-medium">{entry.type}</td>
                <td className="p-4 font-medium">{entry.beneficiary}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      entry.assessment === 'Assessed' 
                        ? 'bg-green-600 text-green-100' 
                        : 'bg-gray-600 text-gray-100'
                    }`}
                  >
                    {entry.assessment}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => navigate(`/admin-dashboard/view-assistance/${idx}`)}
                    className="text-white hover:text-purple-300 transition duration-200 p-2 hover:bg-gray-600 rounded-full"
                    title="View Details"
                  >
                    👁️
                  </button>
                  {entry.assessment !== 'Assessed' && (
                    <>
                      <button
                        onClick={() => handleApprove(idx)}
                        className="text-white hover:text-green-300 transition duration-200 p-2 hover:bg-gray-600 rounded-full"
                        title="Approve Assessment"
                      >
                        ✅
                      </button>
                      <button
                        onClick={() => handleDisapprove(idx)}
                        className="text-white hover:text-red-300 transition duration-200 p-2 hover:bg-gray-600 rounded-full"
                        title="Disapprove Assessment"
                      >
                        ❌
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssistanceTracking;

