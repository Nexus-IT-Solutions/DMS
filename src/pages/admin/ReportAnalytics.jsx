// ReportsAnalytics.jsx
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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
  const [activeReport, setActiveReport] = useState(null);
  const [demographicsData, setDemographicsData] = useState({ age_groups: [], genders: [], disability_types: [] });

  // Helper: PDF download
  const downloadPDF = (title, columns, rows) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(title, 14, 18);
    doc.autoTable({
      startY: 28,
      head: [columns],
      body: rows,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [44,62,80] },
    });
    doc.save(title.replace(/\s+/g, '_').toLowerCase() + '_report.pdf');
  };

  // Helper: PDF for Demographics Summary
  const generateDemographicsPDF = (data) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Demographics Summary Report', 14, 18);
    let y = 28;
    // Age Groups
    doc.setFontSize(13);
    doc.text('A. Age Group Analysis', 14, y);
    y += 4;
    doc.autoTable({
      startY: y + 2,
      head: [['Age Group', 'Count']],
      body: (data.age_groups || []).map(row => [row.age_group, row.count]),
      styles: { fontSize: 10 },
    });
    y = doc.lastAutoTable.finalY + 8;
    doc.text('B. Gender Analysis', 14, y);
    doc.autoTable({
      startY: y + 2,
      head: [['Gender', 'Count']],
      body: (data.genders || []).map(row => [row.gender, row.count]),
      styles: { fontSize: 10 },
    });
    y = doc.lastAutoTable.finalY + 8;
    doc.text('C. Disability Type Analysis', 14, y);
    doc.autoTable({
      startY: y + 2,
      head: [['Disability Type', 'Count']],
      body: (data.disability_types || []).map(row => [row.disability_type, row.count]),
      styles: { fontSize: 10 },
    });
    doc.save('demographics_summary_report.pdf');
  };

  // Helper: PDF for Annual Registration
  const generateAnnualRegistrationPDF = (data) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Annual Registration Report', 14, 18);
    doc.autoTable({
      startY: 28,
      head: [['Metric', 'Value']],
      body: [
        ['Total Registrations (Current Year)', data.total_registrations ?? data.totalRegistrations ?? data.total_registered ?? 0],
        ['Total Assisted (Current Year)', data.total_assisted ?? data.totalAssisted ?? data.total_assisted_pwd ?? 0],
        ['Pending Assistance Requests', data.pending_requests ?? data.pendingAssistanceRequests ?? data.pending_requests_count ?? 0],
      ],
      styles: { fontSize: 10 },
    });
    doc.save('annual_registration_report.pdf');
  };
  useEffect(() => {
    setLoading(true);
    // Fetch quarterly statistics
    fetch('https://disability-management-api.onrender.com/v1/statistics')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && Array.isArray(data.data)) {
          const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
          const chartData = quarters.map((q, i) => ({
            name: q,
            Registered: data.data[i]?.registered || 0,
            Assisted: data.data[i]?.assisted || 0,
          }));
          setBarData(chartData);
        } else {
          window.Swal && window.Swal.fire({ icon: 'error', title: 'Quarterly Stats Error', text: data.message || 'No data for quarterly stats.' });
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        window.Swal && window.Swal.fire({ icon: 'error', title: 'Network Error', text: 'Could not fetch quarterly stats.' });
      });

    // Fetch assistance distribution
    fetch('https://disability-management-api.onrender.com/v1/assistance-types/report')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && Array.isArray(data.data)) {
          setPieData(data.data.map(item => ({ name: item.type, value: item.count })));
        } else {
          window.Swal && window.Swal.fire({ icon: 'error', title: 'Assistance Report Error', text: data.message || 'No data for assistance report.' });
        }
      })
      .catch(() => {
        window.Swal && window.Swal.fire({ icon: 'error', title: 'Network Error', text: 'Could not fetch assistance report.' });
      });

    // Fetch demographics summary for graphs
    fetch('https://disability-management-api.onrender.com/v1/pwd-records/demographics')
      .then(res => {
        if (!res.ok) throw new Error('Endpoint not found');
        return res.json();
      })
      .then(data => {
        if (data.status === 'success' && data.data) {
          setDemographicsData({
            age_groups: data.data.age_groups || [],
            genders: data.data.genders || [],
            disability_types: data.data.disability_types || [],
          });
        } else {
          window.Swal && window.Swal.fire({ icon: 'error', title: 'Demographics Error', text: data.message || 'No data for demographics.' });
        }
      })
      .catch(() => {
        window.Swal && window.Swal.fire({ icon: 'error', title: 'Demographics Endpoint Error', text: 'Demographics endpoint not found or failed.' });
      });
  }, []);

  const handleGenerateReport = (type) => {
    setReportLoading(true);
    setActiveReport(type);
    let endpoint = '';
    // Ensure endpoints match backend
    switch (type) {
      case 'Quarterly Registration Report':
        endpoint = '/v1/quarterly-statistics/report';
        break;
      case 'Assistance Distribution Report':
        endpoint = '/v1/assistance-types/report';
        break;
      case 'Community-based Beneficiary Report':
        endpoint = '/v1/communities/report';
        break;
      case 'Demographics Summary':
        endpoint = '/v1/pwd-records/demographics';
        break;
      case 'Annual Registration Report':
        endpoint = '/v1/statistics/current-year';
        break;
      default:
        endpoint = '';
    }
    if (!endpoint) {
      window.Swal && window.Swal.fire({ icon: 'error', title: 'Report Error', text: 'No endpoint for this report.' });
      setReportLoading(false);
      setActiveReport(null);
      return;
    }
    const apiBase = 'https://disability-management-api.onrender.com';
    fetch(apiBase + endpoint)
      .then(res => {
        if (!res.ok) throw new Error('Endpoint not found');
        return res.json();
      })
      .then(data => {
        setReportLoading(false);
        setActiveReport(null);
        if (data.status === 'success') {
          // PDF generation for each report type (all 5)
          if (type === 'Quarterly Registration Report') {
            const columns = ['Quarter', 'Total Registered', 'Total Assessed', 'Pending'];
            const rows = (data.data || []).map(row => [row.quarter, row.total_registered_pwd, row.total_assessed, row.pending]);
            downloadPDF('Quarterly Registration Report', columns, rows);
            window.Swal && window.Swal.fire({ icon: 'success', title: 'Report Generated', text: 'Quarterly Registration Report generated.' });
          } else if (type === 'Assistance Distribution Report') {
            const columns = ['Assistance Type', 'Total Usage'];
            const rows = (data.data || []).map(row => [row.assistance_type_name, row.total_usage]);
            downloadPDF('Assistance Distribution Report', columns, rows);
            window.Swal && window.Swal.fire({ icon: 'success', title: 'Report Generated', text: 'Assistance Distribution Report generated.' });
          } else if (type === 'Community-based Beneficiary Report') {
            const columns = ['Community', 'Beneficiary Count'];
            const rows = (data.data || []).map(row => [row.community_name, row.beneficiary_count]);
            downloadPDF('Community-based Beneficiary Report', columns, rows);
            window.Swal && window.Swal.fire({ icon: 'success', title: 'Report Generated', text: 'Community-based Beneficiary Report generated.' });
          } else if (type === 'Demographics Summary') {
            generateDemographicsPDF(data.data || {});
            window.Swal && window.Swal.fire({ icon: 'success', title: 'Report Generated', text: 'Demographics Summary Report generated.' });
          } else if (type === 'Annual Registration Report') {
            generateAnnualRegistrationPDF(data.data || {});
            window.Swal && window.Swal.fire({ icon: 'success', title: 'Report Generated', text: 'Annual Registration Report generated.' });
          } else {
            // fallback: show JSON as PDF
            const doc = new jsPDF();
            doc.text(type, 14, 18);
            doc.setFontSize(10);
            doc.text(JSON.stringify(data.data, null, 2), 14, 28);
            doc.save(type.replace(/\s+/g, '_').toLowerCase() + '_report.pdf');
            window.Swal && window.Swal.fire({ icon: 'success', title: 'Report Generated', text: `${type} generated.` });
          }
        } else {
          window.Swal && window.Swal.fire({ icon: 'error', title: 'Report Error', text: data.message || 'Failed to generate report.' });
        }
      })
      .catch((err) => {
        setReportLoading(false);
        setActiveReport(null);
        window.Swal && window.Swal.fire({ icon: 'error', title: 'Endpoint Error', text: `Could not generate report. ${err.message}` });
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
                disabled={reportLoading && activeReport !== card.title}
                type="button"
                aria-label={`Generate ${card.title} PDF`}
              >
                {reportLoading && activeReport === card.title ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div> */}

      {/* Demographics Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold mb-2">Age Group Analysis</h3>
          {demographicsData.age_groups.length === 0 ? (
            <div className="text-center py-12">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={demographicsData.age_groups}>
                <XAxis dataKey="age_group" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="count" fill="#FFBB28" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold mb-2">Gender Analysis</h3>
          {demographicsData.genders.length === 0 ? (
            <div className="text-center py-12">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={demographicsData.genders}
                  dataKey="count"
                  nameKey="gender"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {demographicsData.genders.map((entry, index) => (
                    <Cell key={`cell-gender-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold mb-2">Disability Type Analysis</h3>
          {demographicsData.disability_types.length === 0 ? (
            <div className="text-center py-12">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={demographicsData.disability_types}
                  dataKey="count"
                  nameKey="disability_type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {demographicsData.disability_types.map((entry, index) => (
                    <Cell key={`cell-disability-${index}`} fill={COLORS[index % COLORS.length]} />
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
