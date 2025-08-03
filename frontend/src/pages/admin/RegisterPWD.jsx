import { useState } from "react";
import { useNavigate } from "react-router-dom";
import formOptions from "../../data/pwdRegistrationData.json";
import { IoIosArrowBack } from "react-icons/io";
import { RiCloseCircleLine } from "react-icons/ri";

const RegisterPWD = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const defaultFormOptions = {
    disabilityCategories: [],
    disabilityTypes: [],
    educationLevels: ["Primary", "Secondary", "Tertiary", "Vocational"],
    assistanceNeeded: ["Education", "Health", "Financial", "Employment"]
  };

  const options = {
    ...defaultFormOptions,
    ...formOptions
  };

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
    assistanceNeeded: ""
  });

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
        dateOfBirth: value,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (let key in formData) {
      if (
        !isMinor &&
        [
          "guardianName",
          "guardianOccupation", 
          "guardianPhone",
          "educationLevel",
          "schoolName",
          "grade",
        ].includes(key)
      ) {
        continue;
      }
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
      <div className="flex items-center justify-between mb-8">
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
              <input
                type="text"
                name="quarter"
                value={`Quater ${Math.ceil(new Date().getMonth() / 3)}, ${new Date().getFullYear()}`}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg"
                disabled
              />
            </div>
            <div>
              <label className="block mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
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
              >
                <option value="">Select Category</option>
                {options.disabilityCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
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
              >
                <option value="">Select Disability Type</option>
                {options.disabilityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
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
              <label className="block mb-1">Assistance Needed</label>
              <select
                name="assistanceNeeded"
                value={formData.assistanceNeeded}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg"
                required
              >
                <option value="">Select Assistance Needed</option>
                {options.assistanceNeeded.map((assistance) => (
                  <option key={assistance} value={assistance}>
                    {assistance}
                  </option>
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
                  {options.educationLevels.map((level) => (
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
                  if (file) handleChange({target: {name: 'userImage', files: [file]}});
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
                required
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) handleChange({target: {name: 'documents', files: [file]}});
                }}
                onDragOver={(e) => e.preventDefault()}
              />
            </div>
          </div>

          
          <div className="flex justify-end mt-8 gap-4">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg"
            >
              Register PWD
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

export default RegisterPWD;


