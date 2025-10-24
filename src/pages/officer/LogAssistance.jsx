import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const LogAssistance = () => {
  const [form, setForm] = useState({
    type: '',
    beneficiary: '',
    amount: '',
    notes: '',
  });
  const [assistanceTypes, setAssistanceTypes] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('https://disability-management-api.onrender.com/v1/assistance-types')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && Array.isArray(data.data)) {
          setAssistanceTypes(data.data);
        }
      });
    fetch('https://disability-management-api.onrender.com/v1/pwd-records')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && Array.isArray(data.data)) {
          setBeneficiaries(data.data);
        }
      });
  }, []);

  return (
    <div className="dark text-white p-8 max-w-4xl mx-auto rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => window.history.back()} className="text-white hover:text-gray-300 transition-colors">
          <span className="text-xl">←</span> Back
        </button>
        <div className="text-center flex-1">
          <h2 className="text-2xl font-bold mb-2 text-white">Log New Assistance</h2>
          <p className="text-gray-400">Record details of assistance provided to persons with disabilities</p>
        </div>
        <div className="w-[100px]"></div>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <label className="block mb-2 font-medium text-white">Assistance Type *</label>
          <select
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all"
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
            required
          >
            <option value="">Select assistance type</option>
            {assistanceTypes.map(type => (
              <option key={type.assistance_type_id || type.id} value={type.assistance_type_id || type.id}>{type.assistance_type_name}</option>
            ))}
          </select>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <label className="block mb-3 font-medium text-white">Beneficiary *</label>
          <select
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all"
            value={form.beneficiary}
            onChange={async e => {
              const beneficiaryId = e.target.value;
              setForm(f => ({ ...f, beneficiary: beneficiaryId }));
              if (!beneficiaryId) {
                setSelectedBeneficiary(null);
                setForm(f => ({ ...f, gender: '', contact: '', quarter: '', disability_category: '', disability_type: '' }));
                return;
              }
              try {
                const res = await fetch(`https://disability-management-api.onrender.com/v1/pwd-records/${beneficiaryId}`);
                const data = await res.json();
                if (data.status === 'success' && data.data) {
                  setSelectedBeneficiary(data.data);
                  setForm(f => ({
                    ...f,
                    gender: data.data.gender_name || '',
                    contact: data.data.contact || '',
                    quarter: data.data.quarter || '',
                    disability_category: data.data.disability_category || '',
                    disability_type: data.data.disability_type || ''
                  }));
                } else {
                  setSelectedBeneficiary(null);
                  setForm(f => ({ ...f, gender: '', contact: '', quarter: '', disability_category: '', disability_type: '' }));
                }
              } catch {
                setSelectedBeneficiary(null);
                setForm(f => ({ ...f, gender: '', contact: '', quarter: '', disability_category: '', disability_type: '' }));
              }
            }}
            required
          >
            <option value="">Select beneficiary</option>
            {beneficiaries.map(b => (
              <option key={b.pwd_id || b.id} value={b.pwd_id || b.id}>{b.full_name}</option>
            ))}
          </select>
        </div>

        {/* Always show additional info fields */}
        <div className="bg-gray-800 p-6 rounded-lg grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white mb-1">Gender</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              value={form.gender || ''}
              disabled
            />
          </div>
          <div>
            <label className="block text-white mb-1">Contact</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              value={form.contact || ''}
              disabled
            />
          </div>
          <div>
            <label className="block text-white mb-1">Quarter</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              value={form.quarter ? `Quarter ${form.quarter.replace('Q','')}` : ''}
              disabled
            />
          </div>
          <div>
            <label className="block text-white mb-1">Disability Category</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              value={form.disability_category || ''}
              disabled
            />
          </div>
          <div>
            <label className="block text-white mb-1">Disability Type</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              value={form.disability_type || ''}
              disabled
            />
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <label className="block mb-2 text-sm text-white font-medium">Amount Needed *</label>
          <input
            type="number"
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all"
            placeholder="Enter amount needed"
            value={form.amount || ''}
            onChange={e => setForm({ ...form, amount: e.target.value })}
            required
          />
        </div>

        {/* <div className="bg-gray-800 p-6 rounded-lg">
          {/* Assessment checkbox removed *}
        </div> */}

        <div className="bg-gray-800 p-6 rounded-lg">
          <label className="block mb-2 font-medium text-white">Description *</label>
          <textarea
            rows="4"
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all resize-none"
            placeholder="Enter description"
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            required
          ></textarea>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex justify-end gap-4 mt-6">
            <button
              className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-md font-medium transition-colors min-w-[150px]"
              onClick={async () => {
                setLoading(true);
                if (!form.type || !form.beneficiary || !form.amount || !form.notes) {
                  Swal.fire({ icon: 'error', title: 'Missing fields', text: 'Please fill all required fields.' });
                  setLoading(false);
                  return;
                }
                const user = JSON.parse(localStorage.getItem("dms_user"));
                const officer_id = user?.user_id;
                const payload = {
                  assistance_type_id: form.type,
                  beneficiary_id: form.beneficiary,
                  amount_value_cost: form.amount,
                  description: form.notes,
                  user_id: officer_id,
                };
                const res = await fetch('https://disability-management-api.onrender.com/v1/assistance-requests', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload)
                });
                const result = await res.json();
                setLoading(false);
                if (result.status === 'success') {
                  Swal.fire({ icon: 'success', title: 'Request submitted', text: 'Assistance request logged successfully.' });
                  window.history.back();
                } else {
                  Swal.fire({ icon: 'error', title: 'Error', text: result.message || 'Failed to log assistance.' });
                }
              }}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Assistance Record'}
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
  );
};

export default LogAssistance;
