import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dashboardData from '../../data/adminDashboardData.json';

const DashboardHome = () => {
  const [data, setData] = useState(dashboardData);

  // Simulate API call - replace with actual API call later
  useEffect(() => {
    // This would be replaced with actual API call
    // fetch('/api/admin-dashboard')
    //   .then(response => response.json())
    //   .then(data => setData(data))
    //   .catch(error => console.error('Error fetching dashboard data:', error));
  }, []);

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
      case 'hand-heart':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558-.107 1.282.725 1.282m0 0c.61 0 1.029.574.944 1.109a5.514 5.514 0 0 1-2.446 3.986A4.998 4.998 0 0 0 9.75 15.75c0 .195-.022.39-.064.574a.75.75 0 0 1-1.486.235 6.5 6.5 0 0 1-1.5-4.5c0-3.314 2.686-6 6-6Z" />
          </svg>
        );
      case 'graduation-cap':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
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
      case 'green':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {data.adminInfo.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Here's an overview of your services and requests. We're here to support you every step of the way.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {Object.entries(data.metrics).map(([key, metric]) => (
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
        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activities
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Latest system activities
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {data.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getColorClasses(activity.color)}`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.activity}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

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
            {data.quickActions.map((action) => (
              <Link
                key={action.id}
                to={action.link}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                  {getIconComponent(action.icon)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {action.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {action.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome; 