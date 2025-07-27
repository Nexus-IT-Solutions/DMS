import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import formOptions from "../../data/pwdRegistrationData.json";
import { IoIosArrowBack } from "react-icons/io";

const OfficerRegisterPWD = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    quarter: "",
    sex: "",
    fullName: "",
    contact: "",
    disabilityType: "",
    disabilityCategory: "",
    dateOfBirth: "",
    ghCardNumber: "",
    nhisNumber: "",
    community: "",
    occupation: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();
      console.log("Success:", result);
      alert("PWD registered successfully (mock)");
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 text-sm">
      <div className="flex items-center mb-8">
          <button
            type="button"
            onClick={() => navigate("/officer-dashboard")}
            className="text-white bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded"
          >
            <IoIosArrowBack className="inline-block mr-2 text-lg -mt-1" />
            Back
          </button>

          <h2 className="text-3xl font-bold mb-8 text-center ml-[17%] md:relative md:top-[14px]">
          Register Person with Disability
        </h2>
        </div>
      <div className="max-w-6xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1">Quarter</label>
              <select
                name="quarter"
                value={formData.quarter}
                onChange={handleChange}
                className="w-full p-3 pr-[15px] bg-gray-700 border border-gray-600 rounded-lg"
              >
                <option value="">Select quarter</option>
                {formOptions.quarters.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Sex</label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className="w-full p-3 pr-[15px] bg-gray-700 border border-gray-600 rounded-lg"
              >
                <option value="">Select sex</option>
                {formOptions.sexOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Full Name */}
          <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="p-3 w-full bg-gray-700 border border-gray-600 rounded-lg"
            />

          {/* Occupation and Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="w-full p-3 pr-[15px] bg-gray-700 border border-gray-600 rounded-lg"
            >
              <option value="">Select Occupation</option>
              {formOptions.occupation.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Contact"
              className="p-3 w-full bg-gray-700 border border-gray-600 rounded-lg"
            />
          </div>

          {/* Disability Type & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select
              name="disabilityCategory"
              value={formData.disabilityCategory}
              onChange={handleChange}
              className="w-full p-3 pr-[15px] bg-gray-700 border border-gray-600 rounded-lg"
            >
              <option value="">Select Category</option>
              {formOptions.disabilityCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              name="disabilityType"
              value={formData.disabilityType}
              onChange={handleChange}
              className="w-full p-3 pr-[15px] bg-gray-700 border border-gray-600 rounded-lg"
            >
              <option value="">Select Disability Type</option>
              {formOptions.disabilityTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Date of Birth */}
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="p-3 w-full bg-gray-700 border border-gray-600 rounded-lg"
          />

          {/* Ghana Card and NHIS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="ghCardNumber"
              value={formData.ghCardNumber}
              onChange={handleChange}
              placeholder="Ghana Card Number"
              className="p-3 w-full bg-gray-700 border border-gray-600 rounded-lg"
            />
            <input
              type="text"
              name="nhisNumber"
              value={formData.nhisNumber}
              onChange={handleChange}
              placeholder="NHIS Number"
              className="p-3 w-full bg-gray-700 border border-gray-600 rounded-lg"
            />
          </div>

          {/* Community */}
          <select
            name="community"
            value={formData.community}
            onChange={handleChange}
            className="w-full p-3 pr-[15px] bg-gray-700 border border-gray-600 rounded-lg"
          >
            <option value="">Select Community</option>
            {formOptions.communities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* File Upload */}
          <div className="w-full">
            <label className="block text-sm font-medium mb-1 text-white">
              Supporting Documents
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Upload any relevant documents (medical report, passport picture,
              etc.)
            </p>

            <div
              className="border-2 border-dashed border-gray-500 bg-gray-700 rounded-lg p-6 text-center md:h-[180px] flex flex-col items-center justify-center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const files = Array.from(e.dataTransfer.files);
                // console.log('Dropped files:', files);
                // handle file upload here
              }}
            >
              <label
                htmlFor="fileUpload"
                className="cursor-pointer text-sm text-white"
              >
                Drag and drop files here, or{" "}
                <span className="underline text-teal-400">click to browse</span>
              </label>
              <input
                id="fileUpload"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg"
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  // console.log('Selected files:', files);
                  // handle file upload here
                }}
                className="hidden"
              />
              <p className="text-xs text-gray-300 mt-2">
                Supported formats: PDF, JPG (Max 10MB each)
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-white w-full md:w-auto"
            >
              Register PWD
            </button>
            <button
              type="button"
              onClick={() => navigate("/officer-dashboard")}
              className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded text-white w-full md:w-auto"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OfficerRegisterPWD;

