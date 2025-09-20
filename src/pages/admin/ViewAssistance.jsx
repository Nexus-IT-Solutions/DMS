import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';

const ViewAssistance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`http://app.dms-api.com/v1/assistance-requests/${id}`)
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success') {
          setData(result.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!data) return <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">No data found.</div>;

  const getStatusColor = (status) => {
    switch (status) {
      case 'assessed':
        return 'bg-green-900 text-green-100';
      case 'pending':
        return 'bg-yellow-900 text-yellow-100';
      case 'review':
        return 'bg-blue-900 text-blue-100';
      case 'ready_to_access':
        return 'bg-purple-900 text-purple-100';
      case 'declined':
        return 'bg-red-900 text-red-100';
      default:
        return 'bg-gray-700 text-gray-200';
    }
  };

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
            <h2 className="text-2xl font-bold text-center flex-1 text-white">Assistance Request Details</h2>
            <div className="w-24"></div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 space-y-8">
            {/* Beneficiary and Status Section */}
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-400">Beneficiary</p>
                    <p className="text-xl font-bold text-white">{data.beneficiary_name}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400 text-right">Status</p>
                    <p className={`text-lg font-semibold px-3 py-1 mt-1 rounded-full ${getStatusColor(data.status)}`}>
                        {data.status}
                    </p>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-700 pt-8">
                <div>
                    <p className="text-sm text-gray-400">Assistance Type</p>
                    <p className="text-lg text-white">{data.assistance_type_name}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Amount/Value</p>
                    <p className="text-lg text-white">{data.amount_value_cost}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Request Date</p>
                    <p className="text-lg text-white">{new Date(data.created_at).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Description Section */}
            <div className="border-t border-gray-700 pt-8">
                <p className="text-sm text-gray-400">Description</p>
                <p className="text-lg text-white">{data.description}</p>
            </div>

            {/* Admin Notes Section */}
            {data.admin_review_notes && (
                <div className="border-t border-gray-700 pt-8">
                    <p className="text-sm text-gray-400">Admin Notes</p>
                    <p className="text-lg text-white">{data.admin_review_notes}</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ViewAssistance;