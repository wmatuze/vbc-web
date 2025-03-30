import React, { useState } from 'react';
import {
  BuildingOffice2Icon,
  GlobeAltIcon,
  BellIcon,
  KeyIcon,
  UserCircleIcon,
  Cog8ToothIcon
} from '@heroicons/react/24/outline';

const SettingsContent = () => {
  const [activeSection, setActiveSection] = useState('church');
  
  const sections = [
    {
      id: 'church',
      label: 'Church Information',
      icon: BuildingOffice2Icon,
      description: 'Update your church details and contact information'
    },
    {
      id: 'website',
      label: 'Website Settings',
      icon: GlobeAltIcon,
      description: 'Manage website appearance and functionality'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: BellIcon,
      description: 'Configure email and push notification settings'
    },
    {
      id: 'security',
      label: 'Security',
      icon: KeyIcon,
      description: 'Manage security settings and permissions'
    },
    {
      id: 'account',
      label: 'Account Settings',
      icon: UserCircleIcon,
      description: 'Update your account preferences'
    },
    {
      id: 'system',
      label: 'System',
      icon: Cog8ToothIcon,
      description: 'View system information and logs'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Settings Navigation */}
      <nav className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`p-4 text-left rounded-lg border transition-all ${
              activeSection === section.id
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <section.icon className={`h-6 w-6 ${
                activeSection === section.id ? 'text-blue-500' : 'text-gray-400'
              }`} />
              <div>
                <h3 className={`font-medium ${
                  activeSection === section.id ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {section.label}
                </h3>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
            </div>
          </button>
        ))}
      </nav>

      {/* Settings Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {activeSection === 'church' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Church Information</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Church Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  defaultValue="Victory Bible Church"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  defaultValue="123 Church Street, City, State 12345"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  defaultValue="contact@victorybiblechurch.org"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  defaultValue="(555) 123-4567"
                />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'website' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Website Settings</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Site Title</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  defaultValue="Victory Bible Church - Official Website"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                <textarea
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  defaultValue="Welcome to Victory Bible Church. Join us in worship and fellowship as we grow together in faith."
                />
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="enableLivestream"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  defaultChecked
                />
                <label htmlFor="enableLivestream" className="text-sm font-medium text-gray-700">
                  Enable Live Streaming
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="enableDonations"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  defaultChecked
                />
                <label htmlFor="enableDonations" className="text-sm font-medium text-gray-700">
                  Enable Online Donations
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Add other section content here */}
        
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsContent; 