import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem('dms_user'));

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://app.dms-api.com/v1/pwd-records/total', {
          // headers: {
          //   'Authorization': `Bearer ${user.token}`
          // }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const result = await response.json();
        setDashboardData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
        fetchDashboardData();
    }
  }, [user.token]);

  const getIconComponent = (iconName, color = "currentColor") => {
    const iconClasses = "w-6 h-6";
    
    switch (iconName) {
      case 'users':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>
        );
      case 'user-plus':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
          </svg>
        );
      case 'heart':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getColorClasses = (color) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500';
      case 'purple':
        return 'bg-purple-500';
      case 'orange':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="bg-gray-900 min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">No dashboard data found.</div>;
  }

  const { total_pwd, current_quarter_additions, total_assessed_beneficiaries, current_period } = dashboardData;

  const metrics = {
    totalPwd: {
      title: 'Total PWDs',
      value: total_pwd,
      description: `As of ${current_period.quarter} ${current_period.year}`,
      icon: 'users',
      color: 'blue'
    },
    quarterlyAdditions: {
      title: 'Quarterly Additions',
      value: current_quarter_additions,
      description: 'New PWDs this quarter',
      icon: 'user-plus',
      color: 'purple'
    },
    assessedBeneficiaries: {
      title: 'Assessed Beneficiaries',
      value: total_assessed_beneficiaries,
      description: 'Beneficiaries assessed for support',
      icon: 'heart',
      color: 'orange'
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user.username}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Here's an overview of your services and requests. We're here to support you every step of the way.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {Object.entries(metrics).map(([key, metric]) => (
          <div key={key} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm md:flex md:flex-row md:justify-between">
            <div className="flex items-center justify-between mb-4 md:mb-0 md:order-2 md:-mt-10">
              <div className={`p-3 rounded-lg ${getColorClasses(metric.color)}`}>
                {getIconComponent(metric.icon, 'white')}
              </div>
            </div>
            <div className="md:order-1 md:w-[160px]">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {metric.title}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {metric.value}
                </h3>                
                <p className="text-sm text-gray-600 dark:text-gray-300">
                {metric.description}
                </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Common tasks and shortcuts
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <Link
                to="register-pwd"
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                  {getIconComponent('user-plus')}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Register a new PWD
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Add a new person with disability to the records
                  </p>
                </div>
              </Link>
              <Link
                to="records"
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                  {getIconComponent('users')}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    View PWD Records
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Browse and manage all PWD records
                  </p>
                </div>
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;