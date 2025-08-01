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
    status: "pending"
  },
  {
    id: 2,
    name: "Jacob Adjei",
    quarter: "Sales",
    sex: "Female", 
    community: "Kumasi Metropolitan",
    disabilityType: "Physical Disability",
    registrationDate: "2025-02-10",
    status: "approved"
  },
  {
    id: 3,
    name: "Effah George",
    quarter: "HR",
    sex: "Male",
    community: "Tamale Central", 
    disabilityType: "Hearing Impairment",
    registrationDate: "2025-05-18",
    status: "pending"
  },
];

export default function PWDTable() {
  const [data, setData] = useState(dummyData);
  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    search: "",
    quarter: "",
    community: "",
  });

  const handleApprove = (id) => {
    Swal.fire({
      title: "Approve this record?",
      icon: "question", 
      showCancelButton: true,
      confirmButtonText: "Yes, approve",
      background: "#1f2937",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        setData(data.map(record => {
          if(record.id === id) {
            return {...record, status: "approved"}
          }
          return record;
        }));
        Swal.fire("Approved!", "", "success");
      }
    });
  };

  const handleDisapprove = (id) => {
    Swal.fire({
      title: "Disapprove this record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, disapprove",
      background: "#1f2937",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        setData(data.filter((record) => record.id !== id));
        Swal.fire("Disapproved!", "", "error");
      }
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  const filteredData = data.filter(
    (record) =>
      record.name.toLowerCase().includes(filter.search.toLowerCase()) &&
      record.quarter.includes(filter.quarter) &&
      record.community.includes(filter.community)
  );

  return (
    <div className="p-4 md:p-6 text-white">
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
          {dummyData.map((record) => (
            <option key={record.id} value={record.quarter}>
              {record.quarter}
            </option>
          ))}
        </select>
        <select
          className="bg-gray-800 p-4 rounded-md text-sm pr-8 col-start-4"
          name="community"
          value={filter.community}
          onChange={handleFilterChange}
        >
          <option value="">All Communities</option>
          {dummyData.map((record) => (
            <option key={record.id} value={record.community}>
              {record.community}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-gray-800 rounded-lg">
          <thead>
            <tr className="text-left bg-gray-700">
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
            {filteredData.map((record) => (
              <tr
                key={record.id}
                className="border-t border-gray-600 hover:bg-gray-700"
              >
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
                <td className="px-4 py-3 space-x-4">
                  <button
                    onClick={() =>
                      navigate(`/admin-dashboard/records/${record.id}`)
                    }
                    className="hover:text-blue-400"
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    onClick={() => handleApprove(record.id)}
                    className="hover:text-green-400"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={() => handleDisapprove(record.id)}
                    className="hover:text-red-400"
                  >
                    <X size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

