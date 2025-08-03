import React, { useState } from 'react';

const LogAssistance = () => {
  const [form, setForm] = useState({
    type: '',
    date: '',
    beneficiaryName: '',
    amount: '',
    ghanaCard: '',
    assessed: false,
    notes: '',
    files: []
  });

  // const beneficiaries = [
  //   'Kwame Asante - GHA-123456789-0',
  //   'Akosua Mensah - GHA-987654321-0', 
  //   'Yaw Boateng - GHA-555777568-0',
  // ];

  const toggleBeneficiary = (name) => {
    const exists = form.beneficiaries.includes(name);
    const updated = exists
      ? form.beneficiaries.filter((n) => n !== name)
      : [...form.beneficiaries, name];
    setForm({ ...form, beneficiaries: updated });
  };

  return (
    <div className="dark text-white p-8 max-w-4xl mx-auto rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => window.history.back()} className="text-white hover:text-gray-300 transition-colors">
          <span className="text-xl">←</span> Back
        </button>
        <div className="text-center flex-1">
          <h2 className="text-2xl font-bold mb-2 text-white">Log New Assistance</h2>
          <p className="text-gray-400">Record details of assistance provided to PWDS</p>
        </div>
        <div className="w-[100px]"></div>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <label className="block mb-2 font-medium text-white">Assistance Type *</label>
          <select
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="">Select assistance type</option>
            <option value="Financial Support">Financial Support</option>
            <option value="Assistive Devices">Assistive Devices</option>
          </select>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <label className="block mb-2 font-medium text-white">Date of Approval *</label>
          <input
            type="date"
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <label className="block mb-3 font-medium text-white">Beneficiary Details *</label>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm text-gray-400">Beneficiary Name *</label>
              <input
                type="text"
                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all"
                placeholder="Enter beneficiary name"
                value={form.beneficiaryName || ''}
                onChange={(e) => setForm({ ...form, beneficiaryName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm text-gray-400">Ghana Card Number *</label>
              <input
                type="text"
                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all"
                placeholder="Enter Ghana card number"
                value={form.ghanaCard || ''}
                onChange={(e) => setForm({ ...form, ghanaCard: e.target.value })}
                pattern="GHA-[0-9]{9}-[0-9]"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
              <label className="block mb-2 text-sm text-white font-medium">Amount Needed *</label>
              <input
                type="text"
                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all"
                placeholder="Enter amount needed"
                value={form.amount || ''}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.assessed}
              onChange={(e) => setForm({ ...form, assessed: e.target.checked })}
              className="w-4 h-4 mr-3 text-gray-500 border-gray-600 rounded focus:ring-gray-500"
            />
            <span className="text-gray-300">Assessment was conducted before support</span>
          </label>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <label className="block mb-2 font-medium text-white">Assessment Notes *</label>
          <textarea
            rows="4"
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all resize-none"
            placeholder="Enter assessment notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          ></textarea>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex flex-col">
            <div className="flex-1 mb-6">
              <label className="block mb-2 font-medium text-white">Supporting Documents</label>
              <div 
                className="w-full h-48 border-2 border-dashed border-gray-600 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-700 cursor-pointer hover:border-gray-500 transition-colors"
                onDrop={(e) => {
                  e.preventDefault();
                  setForm({ ...form, files: [...e.dataTransfer.files] });
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                <input
                  type="file"
                  accept=".pdf,.jpg"
                  multiple
                  onChange={(e) => setForm({ ...form, files: [...e.target.files] })}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-center">
                    <p className="text-gray-400">Drag and drop files here or click to browse</p>
                    <p className="text-sm text-gray-500 mt-2">PDF, JPG (Max 10MB each)</p>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end gap-4">
              <button className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-md font-medium transition-colors min-w-[150px]">
                Save Assistance Record
              </button>
              <button 
                onClick={() => window.history.back()} 
                className="px-8 py-4 rounded-md font-medium bg-gray-700 hover:bg-gray-600 transition-colors min-w-[150px]"
              >
                Cancel
              </button>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogAssistance;
