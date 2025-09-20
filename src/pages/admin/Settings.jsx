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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [isAdding, setIsAdding] = useState(false); // <-- New state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let url = '';
      switch (activeTab) {
        case 'communities':
          url = 'https://disability-management-api.onrender.com/v1/communities';
          break;
        case 'category':
          url = 'https://disability-management-api.onrender.com/v1/disability-categories';
          break;
        case 'type':
          if (selectedCategory) {
            url = `https://disability-management-api.onrender.com/v1/disability-types/category/${selectedCategory}`;
          } else {
            setData(prev => ({ ...prev, type: [] }));
            setLoading(false);
            return;
          }
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
          setLoading(false);
          return;
        default:
          setLoading(false);
          return;
      }
      if (url) {
        const res = await fetch(url);
        const result = await res.json();
        if (result.status === 'success' && result.data) {
          setData(prev => ({ ...prev, [activeTab]: result.data }));
        }
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, selectedCategory]);

  const handleAdd = async (tabKey, value) => {
    setIsAdding(true); // <-- Set loading state
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
        if (!selectedCategory) {
          Swal.fire({
            icon: 'error',
            title: 'Select Category',
            text: 'Please select a disability category first.',
          });
          setIsAdding(false);
          return;
        }
        url = 'https://disability-management-api.onrender.com/v1/disability-types';
        body = { category_id: Number(selectedCategory), type_name: value };
        break;
      case 'assistance':
        url = 'https://disability-management-api.onrender.com/v1/assistance-types';
        body = { assistance_type_name: value };
        break;
      default:
        setIsAdding(false);
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
    setIsAdding(false); // <-- Reset loading state
  };

  const handleEdit = (item) => {
  setEditItem(item);
  };
  const handleModalClose = () => setEditItem(null);
  const handleModalSave = async (newValue, newCategoryId) => {
    let url = '';
    let body = {};
    const id = editItem.id || editItem.type_id;
    if (activeTab === 'type') {
      url = `https://disability-management-api.onrender.com/v1/disability-types/${id}`;
      body = {};
      if (newCategoryId) body.category_id = Number(newCategoryId);
      if (newValue) body.type_name = newValue;
    } else if (activeTab === 'communities') {
      url = `https://disability-management-api.onrender.com/v1/communities/${editItem.community_id || editItem.id}`;
      body = { community_name: newValue };
    } else if (activeTab === 'category') {
      url = `https://disability-management-api.onrender.com/v1/disability-categories/${editItem.category_id || editItem.id}`;
      body = { category_name: newValue };
    } else if (activeTab === 'assistance') {
      url = `https://disability-management-api.onrender.com/v1/assistance-types/${editItem.assistance_type_id || editItem.id}`;
      body = { assistance_type_name: newValue };
    }
    if (url) {
      const res = await fetch(url, {
        method: activeTab === 'type' ? 'PATCH' : 'PUT',
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
        setData(prev => ({
          ...prev,
          [activeTab]: prev[activeTab].map(i => {
            const itemId = i.id || i.community_id || i.category_id || i.type_id || i.assistance_type_id;
            if (itemId === id) {
              if (activeTab === 'communities') return { ...i, community_name: newValue };
              if (activeTab === 'category') return { ...i, category_name: newValue };
              if (activeTab === 'type') return { ...i, ...result.data };
              if (activeTab === 'assistance') return { ...i, assistance_type_name: newValue };
              return { ...i, name: newValue };
            }
            return i;
          })
        }));
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
          url = `https://disability-management-api.onrender.com/v1/disability-categories/${selectedCategory}/types/${id}`;
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
    <div className='text-white'>
      <div className="flex gap-2 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3 font-semibold rounded-t-lg focus:outline-none transition-colors duration-200 ${activeTab === tab.key ? 'bg-[#232b3e] dark:bg-[#1a2233] text-white' : 'bg-transparent text-gray-400 hover:bg-[#232b3e] hover:text-white'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Add new item section */}
        <div className="flex-1 bg-gray-800 rounded-xl shadow p-6 flex flex-col justify-between gap-4 min-h-[220px]">
          <h2 className="text-lg font-bold mb-2">Add New {tabs.find(t => t.key === activeTab).label}</h2>
          {activeTab === 'type' ? (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Disability Category</label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none w-full"
              >
                <option value="">Select Category</option>
                {data.category.map(cat => (
                  <option key={cat.category_id || cat.id} value={cat.category_id || cat.id}>{cat.category_name}</option>
                ))}
              </select>
            </div>
          ) : null}
          <form
            onSubmit={async e => {
              e.preventDefault();
              const value = e.target.elements.newItem.value;
              if (value) await handleAdd(activeTab, value);
              e.target.reset();
            }}
            className="flex gap-3 items-center"
          >
            <input
              name="newItem"
              type="text"
              placeholder={`Enter new ${activeTab}`}
              className="px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none flex-1"
              required
              disabled={isAdding}
            />
            <button
              type="submit"
              className="px-6 py-3 bg-teal-600 rounded-lg font-semibold hover:bg-teal-700"
              disabled={isAdding}
            >
              {isAdding ? 'Adding...' : 'Add'}
            </button>
          </form>
        </div>
        {/* List all items section */}
        {loading ? (
          <div className="flex-1 items-center justify-center bg-gray-800 rounded-xl shadow p-6 min-h-[220px] text-center py-8 md:pt-28">Loading...</div>
        ) : (
          <div className="flex-1 bg-gray-800 rounded-xl shadow p-6 min-h-[220px]">
            <h2 className="text-lg font-bold mb-4">All {tabs.find(t => t.key === activeTab).label}s</h2>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-3 px-2">Name</th>
                  <th className="py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody className="relative">
                {data[activeTab].length === 0 ? (
                  <tr><td colSpan={2} className="text-gray-400 py-6 text-center">No data found.</td></tr>
                ) : (
                  data[activeTab].map((item, idx) => {
                    let displayName = '';
                    if (activeTab === 'type') {
                      displayName = item.type_name;
                    } else if (activeTab === 'communities') {
                      displayName = item.community_name;
                    } else if (activeTab === 'category') {
                      displayName = item.category_name;
                    } else if (activeTab === 'assistance') {
                      displayName = item.assistance_type_name;
                    } else {
                      displayName = item.name || item;
                    }
                    return (
                      <tr
                        key={item.id || item.community_id || item.category_id || item.type_id || item.assistance_type_id || idx}
                        className="mb-4"
                      >
                        <td className="bg-[#232b3e] dark:bg-[#1a2233] px-6 py-3 rounded-lg">
                          {displayName}
                        </td>
                        <td className="px-6 py-3 flex gap-2">
                          <button className="text-blue-400 hover:text-blue-600" onClick={() => handleEdit(item)}><FaEdit /></button>
                          <button className="text-red-400 hover:text-red-600" onClick={() => handleDelete(item)}><FaTrash /></button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
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
