// ReportsAnalytics.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { FaFileAlt, FaChartBar, FaMapMarkedAlt, FaUser } from 'react-icons/fa';

const barData = [
  { name: 'Q1', Registered: 22, Assisted: 16 },
  { name: 'Q2', Registered: 18, Assisted: 25 },
  { name: 'Q3', Registered: 35, Assisted: 30 },
  { name: 'Q4', Registered: 30, Assisted: 28 },
];

const pieData = [
  { name: 'Financial Assistance', value: 25 },
  { name: 'Medical Assessment', value: 15 },
  { name: 'Vocational Training', value: 20 },
  { name: 'Assistive Devices', value: 25 },
  { name: 'Others', value: 15 },
];

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
              <button className="text-sm bg-purple-600 hover:bg-purple-700 text-white hover:text-purple-400 cursor-pointer px-4 py-2 rounded font-medium w-[150px] md:ml-auto">Generate Report</button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold mb-2">Quarterly Assistance Stats</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="Registered" fill="#8884d8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Assisted" fill="#00C49F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold mb-2">Assistance Distribution</h3>
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
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
