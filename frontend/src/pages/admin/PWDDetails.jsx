import { useParams, useNavigate } from "react-router-dom";
import { Eye, Check, X } from "lucide-react";
import Swal from "sweetalert2";
import { IoIosArrowBack } from "react-icons/io";

const dummyData = [
  {
    id: 1,
    name: "Peter James",
    quarter: "Marketing",
    sex: "Male", 
    community: "Accra Central",
    disabilityType: "Visual Impairment",
    registrationDate: "2025-01-15",
    status: "Pending",
    profileImage: "https://randomuser.me/api/portraits/men/44.jpg"
  },
  {
    id: 2,
    name: "Jacob Adjei",
    quarter: "Sales",
    sex: "Female",
    community: "Kumasi Metropolitan", 
    disabilityType: "Physical Disability",
    registrationDate: "2025-02-10",
    status: "Approved",
    profileImage: "https://randomuser.me/api/portraits/women/42.jpg"
  },
  {
    id: 3,
    name: "Effah George",
    quarter: "HR",
    sex: "Male",
    community: "Tamale Central",
    disabilityType: "Hearing Impairment", 
    registrationDate: "2025-05-18",
    status: "Pending",
    profileImage: "https://randomuser.me/api/portraits/men/40.jpg"
  },
];

export default function PWDDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const record = dummyData.find((r) => r.id === parseInt(id));

  const handleBack = () => {
    navigate("/admin-dashboard/records");
  };

  const handleApprove = () => {
    Swal.fire({
      title: "Approve this record?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, approve",
      background: "#1f2937",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Approved!", "", "success").then(() => {
          navigate("/admin-dashboard/records");
        });
      }
    });
  };

  const handleDisapprove = () => {
    Swal.fire({
      title: "Disapprove this record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, disapprove",
      background: "#1f2937",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Disapproved!", "", "error").then(() => {
          navigate("/admin-dashboard/records");
        });
      }
    });
  };

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen flex justify-center items-start">
      <div className="max-w-4xl w-full space-y-8">
        <div className="flex items-center mb-8">
          <button
            type="button"
            onClick={() => navigate("/admin-dashboard/records")}
            className="text-white bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded"
          >
            <IoIosArrowBack className="inline-block mr-2 text-lg -mt-1" />
            Back
          </button>

          <div className="text-center ml-[28%] md:relative md:-top-1">
            <h2 className="text-2xl font-bold mb-2">PWD Records</h2>
          </div>
        </div>
        {record ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-2">Personal Details</h3>
              <p><strong>Name:</strong> {record.name}</p>
              <p><strong>Sex:</strong> {record.sex}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-2">Work Details</h3>
              <p><strong>Quarter:</strong> {record.quarter}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-2">Disability Details</h3>
              <p><strong>Disability Type:</strong> {record.disabilityType}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-2">Other Details</h3>
              <p><strong>Community:</strong> {record.community}</p>
              <p><strong>Registration Date:</strong> {record.registrationDate}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-2">Profile Image</h3>
              {record.profileImage ? (
                <img 
                  src={record.profileImage} 
                  alt={`${record.name}'s profile`}
                  className="w-48 h-48 object-cover rounded-lg"
                />
              ) : (
                <p>No profile image available</p>
              )}
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-2">Documents</h3>
              {record.documents && record.documents.length > 0 ? (
                <div className="space-y-2">
                  {record.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                      <span>{doc.name}</span>
                      <a 
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-400 hover:text-blue-300"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No documents available</p>
              )}
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md col-span-1 md:col-span-2">
              <h3 className="text-lg font-bold mb-2">Record Status</h3>
              <div className={`inline-block px-3 py-1 rounded-full ${
                 record.status === 'Approved' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {record.status}
              </div>
            </div>
            {record.status !== 'Approved' && (
              <div className="col-span-1 md:col-span-2 flex space-x-4 mt-4">
                <button
                  onClick={handleApprove}
                  className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow"
                >
                  <Check className="mr-2" /> Approve
                </button>
                <button
                  onClick={handleDisapprove}
                  className="flex items-center px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg shadow"
                >
                  <X className="mr-2" /> Disapprove
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-red-400">Record not found.</p>
        )}
      </div>
    </div>
  );
}

