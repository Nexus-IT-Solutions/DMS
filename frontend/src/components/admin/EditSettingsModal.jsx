import React, { useState } from 'react';
import Swal from 'sweetalert2';

const EditSettingsModal = ({ tabKey, item, onClose, onSave }) => {
  const [value, setValue] = useState(
    item.community_name || item.category_name || item.type_name || item.assistance_type_name || item.name || ''
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    let url = '';
    let body = {};
    let id = item.id || item.community_id || item.category_id || item.type_id || item.assistance_type_id;
    switch (tabKey) {
      case 'communities':
        url = `https://disability-management-api.onrender.com/v1/communities/${id}`;
        body = { community_name: value };
        break;
      case 'category':
        url = `https://disability-management-api.onrender.com/v1/disability-categories/${id}`;
        body = { category_name: value };
        break;
      case 'type':
        url = `https://disability-management-api.onrender.com/v1/disability-types/${id}`;
        body = { type_name: value };
        break;
      case 'assistance':
        url = `https://disability-management-api.onrender.com/v1/assistance-types/${id}`;
        body = { assistance_type_name: value };
        break;
      default:
        return;
    }
    if (url) {
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const result = await res.json();
      if (result.status === 'success') {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Updated successfully!',
          showConfirmButton: false,
          timer: 2000,
          background: '#232b3e',
          color: '#fff',
        });
        onSave(value);
      } else {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: result.message || 'Update failed!',
          showConfirmButton: false,
          timer: 2000,
          background: '#232b3e',
          color: '#fff',
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#232b3e] p-6 rounded-lg shadow-lg min-w-[300px]">
        <h2 className="text-lg font-bold mb-4">Edit {tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}</h2>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none"
            required
          />
          <button type="submit" className="px-4 py-2 bg-teal-600 rounded-lg font-semibold hover:bg-teal-700">Save</button>
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded-lg font-semibold hover:bg-gray-700">Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditSettingsModal;
