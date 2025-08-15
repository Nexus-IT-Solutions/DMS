import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import formOptions from "../../data/pwdRegistrationData.json";
import { IoIosArrowBack } from "react-icons/io";
import { RiCloseCircleLine } from "react-icons/ri";

const OfficerRegisterPWD = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  // Declare formData first to avoid ReferenceError
  const [formData, setFormData] = useState({
    quarter: "",
    gender: "",
    fullName: "",
    contact: "",
    disabilityType: "",
    disabilityCategory: "",
    dateOfBirth: "",
    age: "",
    ghCardNumber: "",
    nhisNumber: "",
    community: "",
    occupation: "",
    userImage: null,
    documents: null,
    guardianName: "",
    guardianOccupation: "",
    guardianPhone: "",
    educationLevel: "",
    schoolName: "",
    guardian_relationship: "",
    assistanceNeeded: "",
  });

  // All other hooks and variables below formData
  const [quarters] = useState(["Q1", "Q2", "Q3", "Q4"]);
  const [communities, setCommunities] = useState([]);
  const [assistanceTypes, setAssistanceTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [genders] = useState([
    { id: 1, name: "Male" },
    { id: 2, name: "Female" },
  ]);

  useEffect(() => {
    fetch("https://disability-management-api.onrender.com/v1/communities")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success" && data.data) {
          setCommunities(data.data);
        }
      });
    fetch("https://disability-management-api.onrender.com/v1/assistance-types")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success" && data.data) {
          setAssistanceTypes(data.data);
        }
      });
    fetch("https://disability-management-api.onrender.com/v1/disability-categories")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success" && data.data) {
          setCategories(data.data);
        }
      });
  }, []);

  useEffect(() => {
    if (formData.disabilityCategory) {
      fetch(`https://disability-management-api.onrender.com/v1/disability-categories/${formData.disabilityCategory}/types`)
        .then(res => res.json())
        .then(data => {
          if (data.status === "success" && data.data) {
            setTypes(data.data);
          }
        });
    } else {
      setTypes([]);
    }
  }, [formData.disabilityCategory]);

  const [isMinor, setIsMinor] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "dateOfBirth") {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      setIsMinor(age < 18);
      setFormData((prev) => ({
        ...prev,
        dateOfBirth: birthDate.toISOString
          ? birthDate.toISOString().split("T")[0]
          : "",
        age: age.toString(),
      }));
    } else if (name === "age") {
      const age = parseInt(value);
      setIsMinor(age < 18);
      const today = new Date();
      const birthYear = today.getFullYear() - age;
      const birthDate = new Date(birthYear, today.getMonth(), today.getDate());
      setFormData((prev) => ({
        ...prev,
        age: value,
        dateOfBirth: birthDate.toISOString().split("T")[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));
    }
  };

  const [registering, setRegistering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegistering(true);

    const payload = {
      quarter: formData.quarter || `Q${Math.ceil((new Date().getMonth() + 1) / 3)}`,
      year: new Date().getFullYear(),
      gender_id: formData.gender,
      full_name: formData.fullName,
      occupation: formData.occupation,
      contact: formData.contact,
      dob: formData.dateOfBirth,
      age: parseInt(formData.age),
      disability_category_id: formData.disabilityCategory,
      disability_type_id: formData.disabilityType,
      gh_card_number: formData.ghCardNumber,
      nhis_number: formData.nhisNumber,
      community_id: formData.community,
      guardian_name: formData.guardianName,
      guardian_occupation: formData.guardianOccupation,
      guardian_phone: formData.guardianPhone,
      guardian_relationship: formData.guardian_relationship,
      education_level: formData.educationLevel,
      school_name: formData.schoolName,
      assistance_type_needed_id: formData.assistanceNeeded,
      supporting_documents: [], // File upload handling needed
      profile_image: "", // File upload handling needed
      role: "officer"
    };

    try {
      const response = await fetch("https://disability-management-api.onrender.com/v1/pwd-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.status === "success") {
        window.Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: result.message || "PWD registered successfully!",
          showConfirmButton: false,
          timer: 2500,
          background: "#232b3e",
          color: "#fff",
        });
        // Optionally reset form or navigate
      } else {
        window.Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: result.message || "Registration failed!",
          showConfirmButton: false,
          timer: 2500,
          background: "#232b3e",
          color: "#fff",
        });
      }
    } catch (error) {
      window.Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Network error!",
        showConfirmButton: false,
        timer: 2500,
        background: "#232b3e",
        color: "#fff",
      });
    }
    setRegistering(false);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg"
        >
          <IoIosArrowBack className="mr-2" />
          Back
        </button>
        <h1 className="text-3xl font-bold">Register Person with Disability</h1>
        <div></div>
      </div>

      <div className="max-w-6xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-1">Quarter</label>
              <select
                name="quarter"
                value={formData.quarter || (() => {
                  const month = new Date().getMonth();
                  const currentQ = `Q${Math.ceil((month + 1) / 3)}`;
                  return currentQ;
                })()}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg"
                required
              >
                <option value="">Select Quarter</option>
                {quarters.map(q => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg"
                required
              >
                <option value="">Select Gender</option>
                {genders.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block mb-1">Disability Category</label>
              <select
                name="disabilityCategory"
                value={formData.disabilityCategory}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.category_id} value={category.category_id}>{category.category_name}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block mb-1">Disability Type</label>
              <select
                name="disabilityType"
                value={formData.disabilityType}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg"
                required
                disabled={!formData.disabilityCategory}
              >
                <option value="">Select Disability Type</option>
                {types.map(type => (
                  <option key={type.type_id} value={type.type_id}>{type.type_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Contact Number</label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Assistance Type Needed</label>
              <select
                name="assistanceNeeded"
                value={formData.assistanceNeeded}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg"
                required
              >
                <option value="">Select Assistance Type</option>
                {assistanceTypes.map(a => (
                  <option key={a.assistance_type_id} value={a.assistance_type_id}>{a.assistance_type_name}</option>
                ))}
              </select>
            </div>

            {formData.age && parseInt(formData.age) < 18 && (
              <>
                <div>
                  <label className="block mb-1">Guardian Name</label>
                  <input
                    type="text"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg"
                    required={isMinor}
                  />
                </div>

                <div>
                  <label className="block mb-1">Guardian Occupation</label>
                  <input
                    type="text"
                    name="guardianOccupation"
                    value={formData.guardianOccupation}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg"
                    required={isMinor}
                  />
                </div>

                <div>
                  <label className="block mb-1">Guardian Phone Number</label>
                  <input
                    type="tel"
                    name="guardianPhone"
                    value={formData.guardianPhone}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg"
                    required={isMinor}
                  />
                </div>

                <div>
                  <label className="block mb-1">Guardian Relationship</label>
                  <input
                    type="text"
                    name="grade"
                    value={formData.guardian_relationship}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg"
                    required={isMinor}
                  />
                </div>

                <div>
                  <label className="block mb-1">Education Level</label>
                  <select
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg"
                    required={isMinor}
                  >
                    <option value="">Select Education Level</option>
                    {['Primary', 'JHS', 'SHS', 'Tertiary', 'None'].map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1">School Name</label>
                  <input
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg"
                    required={isMinor}
                  />
                </div>
              </>
            )}

            <div>
              <label className="block mb-1">Ghana Card Number</label>
              <input
                type="text"
                name="ghCardNumber"
                value={formData.ghCardNumber}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block mb-1">NHIS Number</label>
              <input
                type="text"
                name="nhisNumber"
                value={formData.nhisNumber}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Community</label>
              <input
                type="text"
                name="community"
                value={formData.community}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Occupation</label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Profile Image</label>
              <input
                type="file"
                name="userImage"
                onChange={handleChange}
                accept="image/*"
                className="w-full p-4 bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg hover:border-blue-500 transition-colors cursor-pointer focus:outline-none focus:border-blue-600 h-[150px]"
                required
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file)
                    handleChange({
                      target: { name: "userImage", files: [file] },
                    });
                }}
                onDragOver={(e) => e.preventDefault()}
              />
            </div>

            <div>
              <label className="block mb-1">Supporting Documents</label>
              <input
                type="file"
                name="documents"
                onChange={handleChange}
                accept=".pdf,.doc,.docx"
                className="w-full p-4 bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg hover:border-blue-500 transition-colors cursor-pointer focus:outline-none focus:border-blue-600 h-[150px]"
                
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file)
                    handleChange({
                      target: { name: "documents", files: [file] },
                    });
                }}
                onDragOver={(e) => e.preventDefault()}
              />
            </div>
          </div>

          <div className="flex justify-end mt-8 gap-4">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg"
              disabled={registering}
            >
              {registering ? "Registering..." : "Register PWD"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              <RiCloseCircleLine className="mr-2" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OfficerRegisterPWD;
