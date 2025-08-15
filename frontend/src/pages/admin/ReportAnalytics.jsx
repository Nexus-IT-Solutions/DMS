// ReportsAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { FaFileAlt, FaChartBar, FaMapMarkedAlt, FaUser } from 'react-icons/fa';

// Initial dummy data, will be replaced by backend data
const initialBarData = [
  { name: 'Q1', Registered: 0, Assisted: 0 },
  { name: 'Q2', Registered: 0, Assisted: 0 },
  { name: 'Q3', Registered: 0, Assisted: 0 },
  { name: 'Q4', Registered: 0, Assisted: 0 },
];
const initialPieData = [];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const reportCards = [
  {
    icon: <FaFileAlt size={22} className="text-blue-400" />, title: 'Quarterly Registration Report',
    description: 'PWD registrations by quarter with demographic breakdown'
  },
  {
    icon: <FaChartBar size={22} className="text-purple-400" />, title: 'Assistance Distribution Report',
    description: 'Analysis of assistance provided and assessment statuses'
  },
  {
    icon: <FaMapMarkedAlt size={22} className="text-teal-400" />, title: 'Community-based Beneficiary Report',
    description: 'PWD distribution and assistance by community'
  },
  {
    icon: <FaUser size={22} className="text-orange-400" />, title: 'Demographics Summary',
    description: 'Age, occupation, and disability type analysis'
  },
  {
    icon: <FaFileAlt size={22} className="text-blue-500" />, title: 'Annual Registration Report',
    description: 'PWD registrations for the year with demographic breakdown'
  }
];

const ReportsAnalytics = () => {
  const [barData, setBarData] = useState(initialBarData);
  const [pieData, setPieData] = useState(initialPieData);
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    // Fetch quarterly statistics
    fetch('https://disability-management-api.onrender.com/v1/statistics')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && Array.isArray(data.data)) {
          // Map backend data to chart format
          const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
          const chartData = quarters.map((q, i) => ({
            name: q,
            Registered: data.data[i]?.registered || 0,
            Assisted: data.data[i]?.assisted || 0,
          }));
          setBarData(chartData);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
    // Fetch assistance distribution
    fetch('https://disability-management-api.onrender.com/v1/assistance-types/distribution')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && Array.isArray(data.data)) {
          setPieData(data.data.map(item => ({ name: item.type, value: item.count })));
        }
      });
  }, []);

  const handleGenerateReport = (type) => {
    setReportLoading(true);
    let endpoint = '';
    switch (type) {
      case 'Quarterly Registration Report':
        endpoint = 'https://disability-management-api.onrender.com/v1/quarterly-statistics/report';
        break;
      case 'Assistance Distribution Report':
        endpoint = 'https://disability-management-api.onrender.com/v1/assistance-types/report';
        break;
      case 'Community-based Beneficiary Report':
        endpoint = 'https://disability-management-api.onrender.com/v1/communities/report';
        break;
      case 'Demographics Summary':
        endpoint = 'https://disability-management-api.onrender.com/v1/pwd-records/demographics';
        break;
      case 'Annual Registration Report':
        endpoint = 'https://disability-management-api.onrender.com/v1/quarterly-statistics/annual-report';
        break;
      default:
        endpoint = '';
    }
    if (!endpoint) return;
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        setReportLoading(false);
        if (data.status === 'success') {
          window.open(data.data.url, '_blank');
        } else {
          window.Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.message || 'Failed to generate report.',
          });
        }
      })
      .catch(() => {
        setReportLoading(false);
        window.Swal.fire({
          icon: 'error',
          title: 'Network Error',
          text: 'Could not generate report.',
        });
      });
  };

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h2 className="text-xl font-semibold mb-1">Reports & Analytics</h2>
      <p className="mb-4 text-gray-400">Generate a comprehensive report and analyse system data</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {reportCards.map((card, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow hover:shadow-lg transition">
            <div className="flex flex-col gap-3 mb-2">
              <div className="flex items-start gap-3">
                {card.icon}
                <div>
                  <h3 className="font-medium text-lg">{card.title}</h3>
                  <p className="text-sm text-gray-400">{card.description}</p>
                </div>
              </div>
              <button
                className="text-sm bg-purple-600 hover:bg-purple-700 text-white hover:text-purple-400 cursor-pointer px-4 py-2 rounded font-medium w-[150px] md:ml-auto"
                onClick={() => handleGenerateReport(card.title)}
                disabled={reportLoading}
              >
                {reportLoading ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold mb-2">Quarterly Assistance Stats</h3>
          {loading ? (
            <div className="text-center py-12">Loading chart...</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="Registered" fill="#8884d8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Assisted" fill="#00C49F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold mb-2">Assistance Distribution</h3>
          {loading ? (
            <div className="text-center py-12">Loading chart...</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
