// src/components/PWDTable.jsx
import { useState, useEffect } from "react";
import { Eye, Edit, Trash } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

// const dummyData = [
//   {
//     id: 1,
//     name: "Peter James",
//     quarter: "Marketing",
//     sex: "Male", 
//     community: "Accra Central",
//     disabilityType: "Visual Impairment",
//     registrationDate: "2025-01-15",
//     status: "pending",
//     profileImage: "https://randomuser.me/api/portraits/men/44.jpg"
//   },
//   {
//     id: 2,
//     name: "Jacob Adjei",
//     quarter: "Sales",
//     sex: "Female",
//     community: "Kumasi Metropolitan", 
//     disabilityType: "Physical Disability",
//     registrationDate: "2025-02-10",
//     status: "approved",
//     profileImage: "https://randomuser.me/api/portraits/women/42.jpg"
//   },
//   {
//     id: 3,
//     name: "Effah George",
//     quarter: "HR",
//     sex: "Male",
//     community: "Tamale Central",
//     disabilityType: "Hearing Impairment", 
//     registrationDate: "2025-05-18",
//     status: "pending",
//     profileImage: "https://randomuser.me/api/portraits/men/40.jpg"
//   },
// ];

export default function PWDTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    search: "",
    quarter: "",
    community: "",
  });

  useEffect(() => {
    setLoading(true);
    fetch(`http://app.dms-api.com/v1/pwd-records?page=${page}`)
      .then(res => res.json())
      .then(result => {
        if (result.status === "success" && result.data) {
          setData(result.data);
          if (result.pagination) {
            setTotalPages(result.pagination.total_pages || 1);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  const filteredData = data.filter(
    (record) =>
      (record.full_name?.toLowerCase().includes(filter.search.toLowerCase()) || "".includes(filter.search.toLowerCase())) &&
      (filter.quarter ? record.quarter === filter.quarter : true) &&
      (filter.community ? record.community_name === filter.community : true)
  );

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete PWD Record?',
      text: 'Are you sure you want to delete this record?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      background: '#232b3e',
      color: '#fff',
    });
    if (confirm.isConfirmed) {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("dms_user"));
        const user_id = user?.user_id;
        fetch(`http://app.dms-api.com/v1/pwd-records/${id}`, {
          method: 'DELETE',
          // credentials: "include",
          // headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id }),
        })
          .then(res => res.json())
          .then(result => {
            if (result.status === 'success') {
              Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Record deleted!',
                showConfirmButton: false,
                timer: 2000,
                background: '#232b3e',
                color: '#fff',
              });
              setData(prev => prev.filter(r => r.pwd_id !== id));
            } else {
              Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: result.message || 'Delete failed!',
                showConfirmButton: false,
                timer: 2000,
                background: '#232b3e',
                color: '#fff',
              });
            }
            setLoading(false);
          })
          .catch(() => setLoading(false));
    }
  };

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
            <option key={quarter} value={quarter}>{"Quarter " + (quarter ? quarter.replace("Q", "") : "")}</option>
          ))}
        </select>
        <select
          className="bg-gray-800 p-4 rounded-md text-sm pr-8 col-start-4"
          name="community"
          value={filter.community}
          onChange={handleFilterChange}
        >
          <option value="">All Communities</option>
          {[...new Set(data.map((record) => record.community_name))].map((community) => (
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
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Quarter</th>
              <th className="px-4 py-3">Gender</th>
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
                  key={record.pwd_id}
                  className="border-t border-gray-600 hover:bg-gray-700"
                >
                  <td className="px-4 py-3">
                    <img 
                      src={record.profile_image ? `http://app.dms-api.com/${record.profile_image}` : "https://ui-avatars.com/api/?name=" + encodeURIComponent(record.full_name)}
                      alt={record.full_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-3">{record.full_name}</td>
                  <td className="px-4 py-3">{"Quarter " + (record.quarter ? record.quarter.replace("Q", "") : "")}</td>
                  <td className="px-4 py-3">{record.gender_name}</td>
                  <td className="px-4 py-3">{record.community_name}</td>
                  <td className="px-4 py-3">{record.disability_type}</td>
                  <td className="px-4 py-3">{record.created_at ? record.created_at.split(" ")[0] : ""}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      record.status === 'approved'
                        ? 'bg-green-500/20 text-green-500'
                        : record.status === 'declined'
                          ? 'bg-red-500/20 text-red-500'
                          : 'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {record.status === 'approved'
                        ? 'Approved'
                        : record.status === 'declined'
                          ? 'Declined'
                          : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-3">
                    <button
                      onClick={() =>
                        navigate(`/admin-dashboard/records/${record.pwd_id}`)
                      }
                      className="hover:text-blue-400"
                      title="View"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={() => navigate(`/admin-dashboard/records/edit/${record.pwd_id}`)}
                      className="hover:text-green-400"
                      title="Edit"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(record.pwd_id)}
                      className="hover:text-red-400"
                      title="Delete"
                    >
                      <Trash size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </button>
        <span className="font-bold">Page {page} of {totalPages}</span>
        <button
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

