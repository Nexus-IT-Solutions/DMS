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
      // headers: token ? { Authorization: `Bearer ${token}` } : {},
      // credentials: "include",
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
    const user_id = user?.user_id;
    const res = await fetch(`https://disability-management-api.onrender.com/v1/pwd-records/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      // credentials: "include",
      body: JSON.stringify({ ...form, user_id }),
    });
    const result = await res.json();
    setLoading(false);
    if (result.status === "success") {
      await Swal.fire({
        icon: "success",
        title: "Record updated",
        text: result.message || "PWD record updated successfully.",
        background: "#232b3e",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
      navigate("/officer-dashboard/records");
    } else {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: result.message || "Failed to update record.",
        background: "#232b3e",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
    }
  };

  if (loading) return <div className="text-center py-10 text-white">Loading...</div>;
  if (!form) return <div className="text-center py-10 ">No record found.</div>;

  return (
    <form onSubmit={handleSave} className="max-w-xl mx-auto bg-gray-800 p-8 rounded-xl shadow text-white">
      <button
        type="button"
        className="mb-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      <h2 className="text-2xl font-bold mb-6 text-white">Edit PWD Record</h2>
      <input
        name="full_name"
        value={form.full_name || ""}
        onChange={handleChange}
        className="w-full mb-4 p-3 rounded border border-gray-500"
        placeholder="Full Name"
        required
      />
      <input
        name="gender_name"
        value={form.gender_name || ""}
        onChange={handleChange}
        className="w-full mb-4 p-3 rounded border border-gray-500"
        placeholder="Gender"
        required
      />
      <input
        name="contact"
        value={form.contact || ""}
        onChange={handleChange}
        className="w-full mb-4 p-3 rounded border border-gray-500"
        placeholder="Contact"
        required
      />
      <input
        name="quarter"
        value={form.quarter || ""}
        onChange={handleChange}
        className="w-full mb-4 p-3 rounded border border-gray-500"
        placeholder="Quarter"
        required
      />
      <input
        name="community_name"
        value={form.community_name || ""}
        onChange={handleChange}
        className="w-full mb-4 p-3 rounded border border-gray-500"
        placeholder="Community"
        required
      />
      <input
        name="disability_category"
        value={form.disability_category || ""}
        onChange={handleChange}
        className="w-full mb-4 p-3 rounded border border-gray-500"
        placeholder="Disability Category"
        required
      />
      <input
        name="disability_type"
        value={form.disability_type || ""}
        onChange={handleChange}
        className="w-full mb-4 p-3 rounded border border-gray-500"
        placeholder="Disability Type"
        required
      />
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
