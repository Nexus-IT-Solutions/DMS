import React, { useState } from 'react';

const LogAssistance = () => {
  const [form, setForm] = useState({
    type: '',
    date: '',
    beneficiaries: [],
    notes: '',
    assessed: false,
    files: [],
  });

  const beneficiaries = [
    'Kwame Asante - GHA-123456789-0',
    'Akosua Mensah - GHA-987654321-0',
    'Yaw Boateng - GHA-555777568-0',
  ];

  const toggleBeneficiary = (name) => {
    const exists = form.beneficiaries.includes(name);
    const updated = exists
      ? form.beneficiaries.filter((n) => n !== name)
      : [...form.beneficiaries, name];
    setForm({ ...form, beneficiaries: updated });
  };

  return (
    <div className="dark text-white p-5 max-w-3xl mx-auto">
      <button onClick={() => window.history.back()} className="mb-4 text-purple-400">
        ← Back
      </button>
      <h2 className="text-xl font-semibold mb-2">Log New Assistance</h2>
      <p className="text-sm text-gray-400 mb-4">Record details of assistance provided to PWDS</p>

      <div className="mb-4">
        <label className="block mb-1">Assistance Type *</label>
        <select
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="">Select assistance type</option>
          <option value="Financial Support">Financial Support</option>
          <option value="Assistive Devices">Assistive Devices</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Date of Support *</label>
        <input
          type="date"
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Beneficiary Name *</label>
        {beneficiaries.map((name, i) => (
          <div key={i}>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={form.beneficiaries.includes(name)}
                onChange={() => toggleBeneficiary(name)}
                className="mr-2"
              />
              {name}
            </label>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={form.assessed}
            onChange={(e) => setForm({ ...form, assessed: e.target.checked })}
            className="mr-2"
          />
          Assessment was conducted before support
        </label>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Assessment Notes *</label>
        <textarea
          rows="4"
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
          placeholder="Enter assessment notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Supporting Documents</label>
        <input
          type="file"
          accept=".pdf,.jpg"
          multiple
          onChange={(e) => setForm({ ...form, files: [...e.target.files] })}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
        <p className="text-sm text-gray-500 mt-1">PDF, JPG (Max 10MB each)</p>
      </div>

      <div className="flex gap-4">
        <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">Save Assistance Record</button>
        <button onClick={() => window.history.back()} className="bg-gray-600 px-4 py-2 rounded">Cancel</button>
      </div>
    </div>
  );
};

export default LogAssistance;
