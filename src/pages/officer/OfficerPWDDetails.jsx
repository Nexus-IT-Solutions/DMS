import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { Eye, Check, X } from "lucide-react";
import { IoIosArrowBack } from "react-icons/io";
import { useEffect, useState } from "react";



export default function OfficerPWDDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assistances, setAssistances] = useState([]);
  const [assistLoading, setAssistLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://app.dms-api.com/v1/pwd-records/${id}`)
      .then(res => res.json())
      .then(result => {
        if (result.status === "success" && result.data) {
          setRecord(result.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    setAssistLoading(true);
    fetch(`http://app.dms-api.com/v1/assistance-requests/${id}`)
      .then(res => res.json())
      .then(result => {
        if (result.status === "success" && result.data) {
          setAssistances(result.data);
        }
        setAssistLoading(false);
      })
      .catch(() => setAssistLoading(false));
  }, [id]);

  const handleBack = () => {
    navigate("/officer-dashboard/records");
  };

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen flex justify-center items-start">
      <div className="max-w-4xl w-full space-y-8">
        <div className="flex items-center mb-8">
          <button
            type="button"
            onClick={handleBack}
            className="text-white bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded"
          >
            <IoIosArrowBack className="inline-block mr-2 text-lg -mt-1" />
            Back
          </button>
          <div className="text-center ml-[28%] md:relative md:-top-1">
            <h2 className="text-2xl font-bold mb-2">PWD Details</h2>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-8">Loading PWD details...</div>
        ) : record ? (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
            {/* First Section: Personal & Work Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold mb-2">Personal Details</h3>
                <p><strong>Full Name:</strong> {record.full_name}</p>
                <p><strong>Gender:</strong> {record.gender_name}</p>
                <p><strong>Date of Birth:</strong> {record.date_of_birth}</p>
                <p><strong>Ghana Card Number:</strong> {record.gh_card_number}</p>
                <p><strong>NHIS Number:</strong> {record.nhis_number}</p>
                <p><strong>Contact:</strong> {record.contact}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold mb-2">Work Details</h3>
                <p><strong>Quarter:</strong> {record.quarter ? `Quarter ${record.quarter.replace('Q','')}` : ''}</p>
                <p><strong>Occupation:</strong> {record.occupation}</p>
                <p><strong>Community:</strong> {record.community_name}</p>
                <p><strong>Registration Date:</strong> {record.created_at ? record.created_at.split(' ')[0] : ''}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold mb-2">Disability Details</h3>
                <p><strong>Category:</strong> {record.disability_category}</p>
                <p><strong>Type:</strong> {record.disability_type}</p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Profile Image</h3>
                {record.profile_image ? (
                  <img 
                    src={record.profile_image} 
                    alt={`${record.name}'s profile`}
                    className="w-48 h-48 object-cover rounded-lg"
                  />
                ) : (
                  <p>No profile image available</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Documents</h3>
              {record.documents && record.documents.length > 0 ? (
                <div className="space-y-2">
                  {record.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                      <span>{doc.name}</span>
                      <Link
                        to={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-400 hover:text-blue-300"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No documents available</p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Record Status</h3>
              <div className={`inline-block px-3 py-1 rounded-full ${
                record.status === 'approved' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
              }`}>
                {record.status}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-red-400">Record not found.</p>
        )}
        {/* Assistance Requests Section */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Assistance Requests</h2>
          {assistLoading ? (
            <div className="text-center py-4">Loading assistance requests...</div>
          ) : assistances.length === 0 ? (
            <div className="text-center py-4 text-gray-400">No assistance requests found.</div>
          ) : (
            <div className="space-y-4">
              {assistances.map((assist) => (
                <div key={assist.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                  <p><strong>Type:</strong> {assist.assistance_type}</p>
                  <p><strong>Status:</strong> {assist.status}</p>
                  <p><strong>Date Requested:</strong> {assist.request_date}</p>
                  <p><strong>Description:</strong> {assist.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

