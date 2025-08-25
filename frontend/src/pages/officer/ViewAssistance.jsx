import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ViewAssistance = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`https://disability-management-api.onrender.com/v1/assistance-requests/${id}`)
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success') {
          setData(result.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="bg-gray-900 text-white p-8">Loading...</div>;
  if (!data) return <div className="bg-gray-900 text-white p-8">No data found.</div>;

  return (
    <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg min-h-[400px]">
      <h2 className="text-2xl font-bold mb-6">Assistance Request Details</h2>
      <div className="bg-gray-800 rounded-xl shadow p-6">
        <div className="mb-4"><strong>Beneficiary:</strong> {data.beneficiary_name}</div>
        <div className="mb-4"><strong>Type:</strong> {data.assistance_type_name}</div>
        <div className="mb-4"><strong>Amount:</strong> {data.amount_value_cost}</div>
        <div className="mb-4"><strong>Status:</strong> {data.status}</div>
        <div className="mb-4"><strong>Date:</strong> {data.created_at}</div>
        <div className="mb-4"><strong>Description:</strong> {data.description}</div>
        {/* Add more fields as needed based on API response */}
      </div>
    </div>
  );
};

export default ViewAssistance;
