// src/pages/PWDDetails.jsx
import { useParams } from "react-router-dom";

const dummyData = [
  {
    id: 1,
    name: "Peter James",
    quarter: "Marketing",
    sex: "Male",
    community: "Accra Central",
    disabilityType: "Visual Impairment",
    registrationDate: "2025-01-15",
  },
  {
    id: 2,
    name: "Jacob Adjei",
    quarter: "Sales",
    sex: "Female",
    community: "Kumasi Metropolitan",
    disabilityType: "Physical Disability",
    registrationDate: "2025-02-10",
  },
  {
    id: 3,
    name: "Effah George",
    quarter: "HR",
    sex: "Male",
    community: "Tamale Central",
    disabilityType: "Hearing Impairment",
    registrationDate: "2025-05-18",
  },
];

export default function PWDDetails() {
  const { id } = useParams();
  const record = dummyData.find((r) => r.id === parseInt(id));

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h2 className="text-xl font-semibold mb-4">PWD Record Details</h2>
      {record ? (
        <div className="space-y-2">
          <p><strong>Name:</strong> {record.name}</p>
          <p><strong>Quarter:</strong> {record.quarter}</p>
          <p><strong>Sex:</strong> {record.sex}</p>
          <p><strong>Community:</strong> {record.community}</p>
          <p><strong>Disability Type:</strong> {record.disabilityType}</p>
          <p><strong>Registration Date:</strong> {record.registrationDate}</p>
        </div>
      ) : (
        <p className="text-red-400">Record not found.</p>
      )}
    </div>
  );
}
