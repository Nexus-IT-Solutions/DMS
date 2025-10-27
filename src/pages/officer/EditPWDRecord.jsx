
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditPWDRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quarters] = useState(["Q1", "Q2", "Q3", "Q4"]);
  const [communities, setCommunities] = useState([]);
  const [assistanceTypes, setAssistanceTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [genders, setGenders] = useState([
    { id: 1, name: "Male" },
    { id: 2, name: "Female" },
  ]);
  const [isMinor, setIsMinor] = useState(false);

  useEffect(() => {
    // Fetch record data
    fetch(`https://disability-management-api.onrender.com/v1/pwd-records/${id}`)
      .then(res => res.json())
      .then(result => {
        if (result.status === "success") {
          setFormData(result.data);
          setIsMinor(result.data.age < 18);
        }
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    // Fetch communities
    fetch("https://disability-management-api.onrender.com/v1/communities")
      .then(res => res.json())
      .then(result => {
        if (result.status === "success") setCommunities(result.data);
      });
    // Fetch assistance types
    fetch("https://disability-management-api.onrender.com/v1/assistance-types")
      .then(res => res.json())
      .then(result => {
        if (result.status === "success") setAssistanceTypes(result.data);
      });
    // Fetch disability categories
    fetch("https://disability-management-api.onrender.com/v1/disability-categories")
      .then(res => res.json())
      .then(result => {
        if (result.status === "success") setCategories(result.data);
      });
  }, []);

  useEffect(() => {
    // Fetch disability types for selected category (match RegisterPWD logic)
    if (formData?.disability_category_id) {
      fetch(`https://disability-management-api.onrender.com/v1/disability-categories/${formData.disability_category_id}/types`)
        .then(res => res.json())
        .then(result => {
          if (result.status === "success" && result.data) setTypes(result.data);
        });
    } else {
      setTypes([]);
    }
  }, [formData?.disability_category_id]);

  const handleChange = e => {
    const { name, value, type, files } = e.target;
    let updated = { ...formData };
    if (type === "file") {
      if (name === "profile_image") {
        updated.profile_image = files[0];
      } else if (name === "supporting_documents") {
        const newFiles = Array.from(files);
        updated.supporting_documents = Array.isArray(updated.supporting_documents)
          ? [...updated.supporting_documents, ...newFiles]
          : newFiles;
      }
    } else {
      updated[name] = value;
      // Age/DOB logic
      if (name === "dateOfBirth" || name === "dob") {
        const birthDate = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        updated.age = age;
        setIsMinor(age < 18);
      }
      if (name === "age") {
        let ageNum = parseInt(value, 10);
        if (!isNaN(ageNum) && ageNum >= 0) {
          const today = new Date();
          const birthYear = today.getFullYear() - ageNum;
          updated.dateOfBirth = `${birthYear}-01-01`;
          updated.dob = `${birthYear}-01-01`;
          setIsMinor(ageNum < 18);
        }
      }
      // If category changes, reset type
      if (name === "disability_category_id") {
        updated.disability_type_id = "";
      }
    }
    setFormData(updated);
  };

  const handleRemoveFile = idx => {
    setFormData({
      ...formData,
      supporting_documents: formData.supporting_documents.filter((_, i) => i !== idx)
    });
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, profile_image: null });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("dms_user"));
    const user_id = user?.user_id;
    const form = new FormData();
    // Only send fields that exist in formData
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "profile_image" && value instanceof File) {
        form.append("profile_image", value);
      } else if (key === "supporting_documents" && Array.isArray(value)) {
        value.forEach(file => {
          if (file instanceof File) form.append("supporting_documents[]", file);
        });
      } else if (value !== undefined && value !== null && !(value instanceof File)) {
        form.append(key, value);
      }
    });
    form.append("user_id", user_id);
    const res = await fetch(`https://disability-management-api.onrender.com/v1/pwd-records/${id}`, {
      method: "PATCH",
      body: form,
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

  
  if (!formData) return <div className="text-center py-10 text-white">No record found.</div>;

  // Only show fields that exist in formData (except status, profile image, supporting documents)
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-gray-900 p-10 rounded-2xl shadow-lg text-white space-y-6">
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <h2 className="text-3xl font-bold">Edit PWD Record</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formData.full_name !== undefined && (
          <div>
            <label className="block mb-2 font-semibold">Full Name</label>
            <input name="full_name" value={formData.full_name || ""} onChange={handleChange} className="w-full p-3 rounded border border-gray-500 bg-gray-800" placeholder="Full Name" required />
          </div>
        )}
        {formData.gender_id !== undefined && (
          <div>
            <label className="block mb-2 font-semibold">Gender</label>
            <select name="gender_id" value={formData.gender_id || ""} onChange={handleChange} className="w-full p-3 rounded border border-gray-500 bg-gray-800" required>
              <option value="">Select Gender</option>
              {genders.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
            </select>
          </div>
        )}
        {(formData.dateOfBirth !== undefined || formData.dob !== undefined) && (
          <div>
            <label className="block mb-2 font-semibold">Date of Birth</label>
            <input type="date" name="dob" value={formData.dob || formData.dateOfBirth || ""} onChange={handleChange} className="w-full p-3 rounded border border-gray-500 bg-gray-800" required />
          </div>
        )}
        {formData.age !== undefined && (
          <div>
            <label className="block mb-2 font-semibold">Age</label>
            <input type="number" name="age" value={formData.age || ""} onChange={handleChange} className="w-full p-3 rounded border border-gray-500 bg-gray-800" min="0" required />
          </div>
        )}
        {formData.quarter !== undefined && (
          <div>
            <label className="block mb-2 font-semibold">Quarter</label>
            <select name="quarter" value={formData.quarter || ""} onChange={handleChange} className="w-full p-3 rounded border border-gray-500 bg-gray-800" required>
              <option value="">Select Quarter</option>
              {quarters.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
          </div>
        )}
        {formData.community_id !== undefined && (
          <div>
            <label className="block mb-2 font-semibold">Community</label>
            <select name="community_id" value={formData.community_id || ""} onChange={handleChange} className="w-full p-3 rounded border border-gray-500 bg-gray-800" required>
              <option value="">Select Community</option>
              {communities.map(c => <option key={c.community_id} value={c.community_id}>{c.community_name}</option>)}
            </select>
          </div>
        )}
        {formData.disability_category_id !== undefined && (
          <div>
            <label className="block mb-2 font-semibold">Disability Category</label>
            <select name="disability_category_id" value={formData.disability_category_id || ""} onChange={handleChange} className="w-full p-3 rounded border border-gray-500 bg-gray-800" required>
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.category_id || cat.disability_category_id} value={cat.category_id || cat.disability_category_id}>
                  {cat.category_name || cat.disability_category}
                </option>
              ))}
            </select>
          </div>
        )}
        {formData.disability_type_id !== undefined && (
          <div>
            <label className="block mb-2 font-semibold">Disability Type</label>
            <select name="disability_type_id" value={formData.disability_type_id || ""} onChange={handleChange} className="w-full p-3 rounded border border-gray-500 bg-gray-800" required disabled={!formData.disability_category_id}>
              <option value="">Select Type</option>
              {types.map(type => (
                <option key={type.type_id || type.disability_type_id} value={type.type_id || type.disability_type_id}>
                  {type.type_name || type.disability_type}
                </option>
              ))}
            </select>
          </div>
        )}
        {formData.occupation !== undefined && (
          <div>
            <label className="block mb-2 font-semibold">Occupation</label>
            <input name="occupation" value={formData.occupation || ""} onChange={handleChange} className="w-full p-3 rounded border border-gray-500 bg-gray-800" placeholder="Occupation" />
          </div>
        )}
        {formData.contact !== undefined && (
          <div>
            <label className="block mb-2 font-semibold">Contact</label>
            <input name="contact" value={formData.contact || ""} onChange={handleChange} className="w-full p-3 rounded border border-gray-500 bg-gray-800" placeholder="Contact" required />
          </div>
        )}
        {formData.gh_card_number !== undefined && (
          <div>
            <label className="block mb-2 font-semibold">Ghana Card Number</label>
            <input name="gh_card_number" value={formData.gh_card_number || ""} onChange={handleChange} className="w-full p-3 rounded border border-gray-500 bg-gray-800" placeholder="Ghana Card Number" />
          </div>
        )}
        {formData.nhis_number !== undefined && (
          <div>
            <label className="block mb-2 font-semibold">NHIS Number</label>
            <input name="nhis_number" value={formData.nhis_number || ""} onChange={handleChange} className="w-full p-3 rounded border border-gray-500 bg-gray-800" placeholder="NHIS Number" />
          </div>
        )}
        {formData.assistance_type_needed_id !== undefined && (
          <div>
            <label className="block mb-2 font-semibold">Assistance Needed</label>
            <select name="assistance_type_needed_id" value={formData.assistance_type_needed_id || ""} onChange={handleChange} className="w-full p-3 rounded border border-gray-500 bg-gray-800">
              <option value="">Select Assistance</option>
              {assistanceTypes.map(a => <option key={a.assistance_type_id} value={a.assistance_type_id}>{a.assistance_type_name}</option>)}
            </select>
          </div>
        )}
        {/* Guardian fields for minors (age < 18) */}
        {isMinor && (
          <>
            {formData.guardian_name !== undefined && (
              <div>
                <label className="block mb-2 font-semibold">Guardian Name</label>
                <input name="guardian_name" value={formData.guardian_name || ""} onChange={handleChange} className="w-full p-3 rounded border border-gray-500 bg-gray-800" placeholder="Guardian Name" />
              </div>
            )}
            {formData.guardian_occupation !== undefined && (
              <div>
                <label className="block mb-2 font-semibold">Guardian Occupation</label>
                <input name="guardian_occupation" value={formData.guardian_occupation || ""} onChange={handleChange} className="w-full p-3 rounded border border-gray-500 bg-gray-800" placeholder="Guardian Occupation" />
              </div>
            )}
            {formData.guardian_phone !== undefined && (
              <div>
                <label className="block mb-2 font-semibold">Guardian Phone</label>
                <input name="guardian_phone" value={formData.guardian_phone || ""} onChange={handleChange} className="w-full p-3 rounded border border-gray-500 bg-gray-800" placeholder="Guardian Phone" />
              </div>
            )}
            {/* Keep other minor fields if present */}
            {formData.guardian_relationship !== undefined && (
              <div>
                <label className="block mb-2 font-semibold">Guardian Relationship</label>
                <input name="guardian_relationship" value={formData.guardian_relationship || ""} onChange={handleChange} className="w-full p-3 rounded border border-gray-500 bg-gray-800" placeholder="Guardian Relationship" />
              </div>
            )}
            {formData.education_level !== undefined && (
              <div>
                <label className="block mb-2 font-semibold">Education Level</label>
                <input name="education_level" value={formData.education_level || ""} onChange={handleChange} className="w-full p-3 rounded border border-gray-500 bg-gray-800" placeholder="Education Level" />
              </div>
            )}
            {formData.school_name !== undefined && (
              <div>
                <label className="block mb-2 font-semibold">School Name</label>
                <input name="school_name" value={formData.school_name || ""} onChange={handleChange} className="w-full p-3 rounded border border-gray-500 bg-gray-800" placeholder="School Name" />
              </div>
            )}
          </>
        )}
      </div>
      {/* Status always present */}
      <div>
        <label className="block mb-2 font-semibold">Status</label>
        <select name="status" value={formData.status || "pending"} onChange={handleChange} className="w-full p-3 rounded border border-gray-500 bg-gray-800">
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="declined">Declined</option>
        </select>
      </div>
      {/* Profile Image Section always present */}
      <div className="mt-6">
        <label className="block mb-2 font-semibold">Profile Image</label>
        <div className="flex items-center gap-4">
          <input type="file" name="profile_image" accept="image/*" onChange={handleChange} className="w-full p-3 rounded border border-gray-500 bg-gray-800" />
          {formData.profile_image ? (
            typeof formData.profile_image === "string" ? (
              <div className="flex flex-col items-center">
                <img src={`https://disability-management-api.onrender.com/${formData.profile_image.replace(/\\/g, '/')}`} alt={formData.full_name || 'Profile'} className="h-24 rounded mb-2" />
                <button type="button" className="text-red-400 underline text-xs cursor-pointer" onClick={handleRemoveImage}>Remove</button>
              </div>
            ) : formData.profile_image instanceof File ? (
              <div className="flex flex-col items-center">
                <span className="text-xs">{formData.profile_image.name}</span>
                <button type="button" className="text-red-400 underline text-xs cursor-pointer" onClick={handleRemoveImage}>Remove</button>
              </div>
            ) : null
          ) : (
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(formData.full_name || '')}`}
              alt={formData.full_name || 'Profile'}
              className="h-24 rounded mb-2"
            />
          )}
        </div>
      </div>
      {/* Supporting Documents Section always present */}
      <div className="mt-6">
        <label className="block mb-2 font-semibold">Supporting Documents</label>
        <input type="file" name="supporting_documents" multiple onChange={handleChange} className="w-full p-3 rounded border border-gray-500 bg-gray-800" />
        {formData.supporting_documents && Array.isArray(formData.supporting_documents) && formData.supporting_documents.length > 0 && (
          <ul className="mt-2 list-disc list-inside text-sm">
            {formData.supporting_documents.map((doc, idx) => (
              <li key={idx} className="flex items-center gap-2">
                {typeof doc === "string" ? (
                  <a href={`https://disability-management-api.onrender.com/${encodeURIComponent(doc)}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                    {doc.split('/').pop()}
                  </a>
                ) : (
                  <span>{doc.name}</span>
                )}
                <button type="button" className="text-red-400 underline text-xs ml-2 cursor-pointer" onClick={() => handleRemoveFile(idx)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
        {(!formData.supporting_documents || !Array.isArray(formData.supporting_documents) || formData.supporting_documents.length === 0) && (
          <span className="text-xs text-gray-400">No supporting documents uploaded.</span>
        )}
      </div>
      <button type="submit" className="w-full bg-teal-600 text-white px-6 py-3 rounded font-semibold mt-8" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
