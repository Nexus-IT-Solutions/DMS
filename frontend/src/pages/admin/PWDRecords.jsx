// src/components/PWDTable.jsx
import { useState } from "react";
import { Eye, Check, X } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
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
    status: "pending",
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
    status: "approved",
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
    status: "pending",
    profileImage: "https://randomuser.me/api/portraits/men/40.jpg"
  },
];

export default function PWDTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    search: "",
    quarter: "",
    community: "",
  });

  useEffect(() => {
    setLoading(true);
    fetch("https://disability-management-api.onrender.com/v1/pwd-records")
      .then(res => res.json())
      .then(result => {
        if (result.status === "success" && result.data && result.data.records) {
          setData(result.data.records);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  const filteredData = data.filter(
    (record) =>
      (record.name?.toLowerCase().includes(filter.search.toLowerCase()) || "".includes(filter.search.toLowerCase())) &&
      (filter.quarter ? record.quarter === filter.quarter : true) &&
      (filter.community ? record.community === filter.community : true)
  );

  return (
    <div className="p-1 text-white">
      <div className="flex items-center mb-8">
        <button
          type="button"
          onClick={() => navigate("/admin-dashboard")}
          className="text-white bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded"
        >
          <IoIosArrowBack className="inline-block mr-2 text-lg -mt-1" />
          Back
        </button>

        <div className="text-center ml-[27%] md:relative md:top-[14px]">
          <h2 className="text-3xl font-bold mb-2">PWD Records</h2>
          <p className="text-sm text-gray-400 mb-4">
            View and manage disability records
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 md:justify-end">
        <input
          className="bg-gray-800 p-4 rounded-md text-sm col-start-2"
          placeholder="Search name, Ghana Card..."
          name="search"
          value={filter.search}
          onChange={handleFilterChange}
        />
        <select
          className="bg-gray-800 p-4 rounded-md text-sm pr-8 col-start-3"
          name="quarter"
          value={filter.quarter}
          onChange={handleFilterChange}
        >
          <option value="">All Quarters</option>
          {[...new Set(data.map((record) => record.quarter))].map((quarter) => (
            <option key={quarter} value={quarter}>{quarter}</option>
          ))}
        </select>
        <select
          className="bg-gray-800 p-4 rounded-md text-sm pr-8 col-start-4"
          name="community"
          value={filter.community}
          onChange={handleFilterChange}
        >
          <option value="">All Communities</option>
          {[...new Set(data.map((record) => record.community))].map((community) => (
            <option key={community} value={community}>{community}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-w-full">
        <table className="min-w-full table-auto bg-gray-800 rounded-lg">
          <thead>
            <tr className="text-left bg-gray-700">
              <th className="px-4 py-3">Profile</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Quarter</th>
              <th className="px-4 py-3">Sex</th>
              <th className="px-4 py-3">Community</th>
              <th className="px-4 py-3">Disability Type</th>
              <th className="px-4 py-3">Registration Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="text-center py-8">Loading...</td></tr>
            ) : filteredData.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-8">No records found.</td></tr>
            ) : (
              filteredData.map((record) => (
                <tr
                  key={record.id}
                  className="border-t border-gray-600 hover:bg-gray-700"
                >
                  <td className="px-4 py-3">
                    <img 
                      src={record.profileImage}
                      alt={record.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-3">{record.name}</td>
                  <td className="px-4 py-3">{record.quarter}</td>
                  <td className="px-4 py-3">{record.sex}</td>
                  <td className="px-4 py-3">{record.community}</td>
                  <td className="px-4 py-3">{record.disabilityType}</td>
                  <td className="px-4 py-3">{record.registrationDate}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      record.status === 'approved' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-3">
                    <button
                      onClick={() =>
                        navigate(`/admin-dashboard/records/${record.id}`)
                      }
                      className="hover:text-blue-400"
                    >
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

