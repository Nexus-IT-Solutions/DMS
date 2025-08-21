import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditPWDRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("dms_user"));
  const token = user?.token;

  useEffect(() => {
    fetch(`https://disability-management-api.onrender.com/v1/pwd-records/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: "include",
    })
      .then(res => res.json())
      .then(result => {
        if (result.status === "success") setForm(result.data);
        setLoading(false);
      });
  }, [id, token]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("dms_user"));
    const officer_id = user?.officer_id;
    const res = await fetch(`https://disability-management-api.onrender.com/v1/pwd-records/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ ...form, officer_id }),
    });
    const result = await res.json();
    setLoading(false);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: result.status === "success" ? "success" : "error",
      title: result.message,
      showConfirmButton: false,
      timer: 2000,
      background: "#232b3e",
      color: "#fff",
    });
    if (result.status === "success") navigate("/officer-dashboard/records");
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!form) return <div className="text-center py-10">No record found.</div>;

  return (
    <form onSubmit={handleSave} className="max-w-xl mx-auto bg-gray-800 p-8 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-white">Edit PWD Record</h2>
      <input
        name="full_name"
        value={form.full_name || ""}
        onChange={handleChange}
        className="w-full mb-4 p-3 rounded"
        placeholder="Full Name"
        required
      />
      {/* Add other fields as needed */}
      <button
        type="submit"
        className="bg-teal-600 text-white px-6 py-3 rounded font-semibold"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
