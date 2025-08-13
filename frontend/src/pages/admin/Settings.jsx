import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import EditSettingsModal from '../../components/admin/EditSettingsModal';

const tabs = [
  { label: 'Communities', key: 'communities' },
  { label: 'Disability Category', key: 'category' },
  { label: 'Disability Type', key: 'type' },
  { label: 'Assistance Type', key: 'assistance' },
  { label: 'Gender', key: 'gender' },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('communities');
  const [data, setData] = useState({
    communities: [],
    category: [],
    type: [],
    assistance: [],
    gender: [],
  });
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let url = '';
      switch (activeTab) {
        case 'communities':
          url = 'https://disability-management-api.onrender.com/v1/communities';
          break;
        case 'category':
          url = 'https://disability-management-api.onrender.com/v1/disability-categories';
          break;
        case 'type':
          url = 'https://disability-management-api.onrender.com/v1/disability-types';
          break;
        case 'assistance':
          url = 'https://disability-management-api.onrender.com/v1/assistance-types';
          break;
        case 'gender':
          setData(prev => ({
            ...prev,
            gender: [
              { id: 1, name: 'Male' },
              { id: 2, name: 'Female' }
            ]
          }));
          return;
        default:
          return;
      }
      if (url) {
        const res = await fetch(url);
        const result = await res.json();
        if (result.status === 'success' && result.data) {
          setData(prev => ({ ...prev, [activeTab]: result.data }));
        }
      }
    };
    fetchData();
  }, [activeTab]);

  const handleAdd = async (tabKey, value) => {
    let url = '';
    let body = {};
    switch (tabKey) {
      case 'communities':
        url = 'https://disability-management-api.onrender.com/v1/communities';
        body = { community_name: value };
        break;
      case 'category':
        url = 'https://disability-management-api.onrender.com/v1/disability-categories';
        body = { category_name: value };
        break;
      case 'type':
        url = 'https://disability-management-api.onrender.com/v1/disability-types';
        body = { type_name: value, category_id: 1 };
        break;
      case 'assistance':
        url = 'https://disability-management-api.onrender.com/v1/assistance-types';
        body = { assistance_type_name: value };
        break;
      default:
        return;
    }
    if (url) {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const result = await res.json();
      if (result.status === 'success') {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Added successfully!',
          showConfirmButton: false,
          timer: 2000,
          background: '#232b3e',
          color: '#fff',
        });
        setData(prev => ({ ...prev, [tabKey]: [...prev[tabKey], result.data] }));
      } else {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: result.message || 'Add failed!',
          showConfirmButton: false,
          timer: 2000,
          background: '#232b3e',
          color: '#fff',
        });
      }
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
  };
  const handleModalClose = () => setEditItem(null);
  const handleModalSave = (newValue) => {
    setData(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(i => {
        const id = i.id || i.community_id || i.category_id || i.type_id || i.assistance_type_id;
        const editId = editItem.id || editItem.community_id || editItem.category_id || editItem.type_id || editItem.assistance_type_id;
        if (id === editId) {
          if (activeTab === 'communities') return { ...i, community_name: newValue };
          if (activeTab === 'category') return { ...i, category_name: newValue };
          if (activeTab === 'type') return { ...i, type_name: newValue };
          if (activeTab === 'assistance') return { ...i, assistance_type_name: newValue };
          return { ...i, name: newValue };
        }
        return i;
      })
    }));
    setEditItem(null);
  };

  const handleDelete = async (item) => {
    const confirmed = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      background: '#232b3e',
      color: '#fff',
    });
    if (confirmed.isConfirmed) {
      let url = '';
      let id = item.id || item.community_id || item.category_id || item.type_id || item.assistance_type_id;
      switch (activeTab) {
        case 'communities':
          url = `https://disability-management-api.onrender.com/v1/communities/${id}`;
          break;
        case 'category':
          url = `https://disability-management-api.onrender.com/v1/disability-categories/${id}`;
          break;
        case 'type':
          url = `https://disability-management-api.onrender.com/v1/disability-types/${id}`;
          break;
        case 'assistance':
          url = `https://disability-management-api.onrender.com/v1/assistance-types/${id}`;
          break;
        default:
          return;
      }
      if (url) {
        const res = await fetch(url, { method: 'DELETE' });
        const result = await res.json();
        if (result.status === 'success') {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Deleted successfully!',
            showConfirmButton: false,
            timer: 2000,
            background: '#232b3e',
            color: '#fff',
          });
          setData(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].filter(i => (i.id || i.community_id || i.category_id || i.type_id || i.assistance_type_id) !== id)
          }));
        } else {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: result.message || 'Delete failed!',
            showConfirmButton: false,
            timer: 2000,
            background: '#232b3e',
            color: '#fff',
          });
        }
      }
    }
  };

  return (
    <div className="bg-[#151c2c] dark:bg-[#101624] text-white rounded-lg shadow-lg p-6 min-h-[500px]">
      <div className="flex gap-2 border-b border-gray-700 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-semibold rounded-t-lg focus:outline-none transition-colors duration-200 ${activeTab === tab.key ? 'bg-[#232b3e] dark:bg-[#1a2233] text-white' : 'bg-transparent text-gray-400 hover:bg-[#232b3e] hover:text-white'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {/* Add new item section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2">Add New {tabs.find(t => t.key === activeTab).label}</h2>
          <form
            onSubmit={e => {
              e.preventDefault();
              const value = e.target.elements.newItem.value;
              if (value) handleAdd(activeTab, value);
              e.target.reset();
            }}
            className="flex gap-2"
          >
            <input
              name="newItem"
              type="text"
              placeholder={`Enter new ${activeTab}`}
              className="px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none"
              required
            />
            <button type="submit" className="px-4 py-2 bg-teal-600 rounded-lg font-semibold hover:bg-teal-700">Add</button>
          </form>
        </div>
        {/* List all items section */}
        <div>
          <h2 className="text-lg font-bold mb-2">All {tabs.find(t => t.key === activeTab).label}s</h2>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data[activeTab].length === 0 ? (
                <tr><td colSpan={2} className="text-gray-400">No data found.</td></tr>
              ) : (
                data[activeTab].map((item, idx) => (
                  <tr key={item.id || item.community_id || item.category_id || item.type_id || item.assistance_type_id || idx}>
                    <td className="bg-[#232b3e] dark:bg-[#1a2233] px-4 py-2 rounded-lg">
                      {item.community_name || item.category_name || item.type_name || item.assistance_type_name || item.name || item}
                    </td>
                    <td className="px-4 py-2">
                      <button className="mr-2 text-blue-400 hover:text-blue-600" onClick={() => handleEdit(item)}><FaEdit /></button>
                      <button className="text-red-400 hover:text-red-600" onClick={() => handleDelete(item)}><FaTrash /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {editItem && (
          <EditSettingsModal
            tabKey={activeTab}
            item={editItem}
            onClose={handleModalClose}
            onSave={handleModalSave}
          />
        )}
      </div>
    </div>
  );
};

export default Settings;
