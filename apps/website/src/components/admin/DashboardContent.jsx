import React from 'react';
import {
  ChartBarIcon,
  UsersIcon,
  VideoCameraIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const DashboardContent = () => {
  const stats = [
    {
      title: 'Total Members',
      value: '1,234',
      change: '+12%',
      changeType: 'increase',
      icon: UsersIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Sermons',
      value: '156',
      change: '+3',
      changeType: 'increase',
      icon: VideoCameraIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Events',
      value: '24',
      change: '+2',
      changeType: 'increase',
      icon: CalendarIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'Cell Groups',
      value: '45',
      change: '+5',
      changeType: 'increase',
      icon: ChartBarIcon,
      color: 'bg-yellow-500'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'sermon',
      title: 'Sunday Service - "Walking in Faith"',
      time: '2 hours ago',
      status: 'Published'
    },
    {
      id: 2,
      type: 'event',
      title: 'Youth Conference 2024',
      time: '5 hours ago',
      status: 'Updated'
    },
    {
      id: 3,
      type: 'member',
      title: 'New Member Registration - John Smith',
      time: '1 day ago',
      status: 'Pending'
    },
    {
      id: 4,
      type: 'cellGroup',
      title: 'New Cell Group Created - "Young Professionals"',
      time: '2 days ago',
      status: 'Active'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className={`ml-2 text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          <div className="mt-6 flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="py-5">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <ClockIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircleIcon className="mr-1 h-4 w-4" />
                        {activity.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent; 