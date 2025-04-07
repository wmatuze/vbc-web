import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import AdminFooter from '../../components/admin/AdminFooter';

// FAQ Accordion Component
const FaqItem = ({ question, answer, isOpen, toggle }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        className="flex justify-between items-center w-full py-4 px-2 text-left focus:outline-none"
        onClick={toggle}
      >
        <span className="font-medium text-gray-900 dark:text-white">{question}</span>
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 px-2 text-gray-600 dark:text-gray-300">
          {answer}
        </div>
      )}
    </div>
  );
};

const AdminGuide = ({ darkMode }) => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I approve a membership renewal request?",
      answer: (
        <div>
          <p>To approve a membership renewal request:</p>
          <ol className="list-decimal ml-5 mt-2 space-y-2">
            <li>Navigate to the <strong>Membership</strong> tab in the admin dashboard</li>
            <li>Find the renewal request in the "Membership Renewals" table</li>
            <li>Click the <strong>Approve & Notify</strong> button</li>
            <li>The system will automatically update the member's status and send them a confirmation email</li>
          </ol>
        </div>
      )
    },
    {
      question: "How do I manage foundation class enrollments?",
      answer: (
        <div>
          <p>Foundation class enrollments can be managed in two stages:</p>
          <ol className="list-decimal ml-5 mt-2 space-y-2">
            <li>When a new enrollment comes in, approve it and send the schedule by clicking the <strong>Approve & Send Schedule</strong> button</li>
            <li>After the member completes all classes, mark them as completed by clicking the <strong>Mark as Completed & Notify</strong> button</li>
            <li>This will automatically send them a congratulatory email and officially register them as a church member</li>
          </ol>
        </div>
      )
    },
    {
      question: "How do I add a new sermon to the website?",
      answer: (
        <div>
          <p>To add a new sermon:</p>
          <ol className="list-decimal ml-5 mt-2 space-y-2">
            <li>Go to the <strong>Sermons</strong> tab in the admin dashboard</li>
            <li>Click the <strong>Add New Sermon</strong> button</li>
            <li>Fill in all required fields (title, speaker, date, etc.)</li>
            <li>Add the YouTube video ID if available</li>
            <li>Upload a sermon thumbnail image (optional)</li>
            <li>Click <strong>Save</strong> to publish the sermon</li>
          </ol>
        </div>
      )
    },
    {
      question: "How do I create a new event?",
      answer: (
        <div>
          <p>To create a new church event:</p>
          <ol className="list-decimal ml-5 mt-2 space-y-2">
            <li>Navigate to the <strong>Events</strong> tab in the admin dashboard</li>
            <li>Click the <strong>Add New Event</strong> button</li>
            <li>Fill in the event details (title, date, time, location, description)</li>
            <li>Upload an event image</li>
            <li>Set the event category and any registration requirements</li>
            <li>Click <strong>Save</strong> to publish the event</li>
          </ol>
        </div>
      )
    },
    {
      question: "How do I delete unnecessary requests?",
      answer: (
        <div>
          <p>You can delete membership renewal requests or foundation class enrollments that are no longer needed:</p>
          <ol className="list-decimal ml-5 mt-2 space-y-2">
            <li>Go to the <strong>Membership</strong> tab in the admin dashboard</li>
            <li>Find the request you want to delete</li>
            <li>Click the trash icon button</li>
            <li>Confirm the deletion when prompted</li>
            <li>The request will be permanently removed from the system</li>
          </ol>
          <p className="mt-2 text-yellow-600 dark:text-yellow-400"><strong>Note:</strong> Deletion is permanent and cannot be undone. Only delete requests that are truly no longer needed.</p>
        </div>
      )
    },
    {
      question: "How do I update church leadership information?",
      answer: (
        <div>
          <p>To update leadership information:</p>
          <ol className="list-decimal ml-5 mt-2 space-y-2">
            <li>Go to the <strong>Leadership</strong> tab in the admin dashboard</li>
            <li>To edit an existing leader, click the <strong>Edit</strong> button next to their name</li>
            <li>To add a new leader, click the <strong>Add New Leader</strong> button</li>
            <li>Fill in their details (name, position, bio, etc.)</li>
            <li>Upload or update their photo</li>
            <li>Click <strong>Save</strong> to update the information</li>
          </ol>
        </div>
      )
    },
    {
      question: "How do I manage cell groups?",
      answer: (
        <div>
          <p>To manage cell groups:</p>
          <ol className="list-decimal ml-5 mt-2 space-y-2">
            <li>Navigate to the <strong>Cell Groups</strong> tab in the admin dashboard</li>
            <li>To add a new group, click the <strong>Add New Group</strong> button</li>
            <li>To edit an existing group, click the <strong>Edit</strong> button next to the group name</li>
            <li>Fill in the group details (name, leader, meeting time, location, etc.)</li>
            <li>Click <strong>Save</strong> to update the information</li>
          </ol>
        </div>
      )
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/admin')}
            className={`mr-4 p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">Admin Guide</h1>
        </div>

        <div className={`rounded-xl shadow-sm p-6 mb-6 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
          <div className="prose max-w-none dark:prose-invert">
            <h2>Welcome to the Victory Bible Church CMS</h2>
            <p>
              This guide will help you navigate and use the Church Content Management System (CMS) effectively.
              The CMS allows you to manage various aspects of the church website, including membership, events,
              sermons, leadership information, and more.
            </p>

            <h3>Getting Started</h3>
            <p>
              The admin dashboard is organized into several sections, accessible from the sidebar navigation.
              Each section focuses on a specific aspect of the church website:
            </p>

            <ul>
              <li><strong>Dashboard</strong> - Overview of website activity and quick access to common tasks</li>
              <li><strong>Sermons</strong> - Manage sermon recordings, videos, and related content</li>
              <li><strong>Events</strong> - Create and manage church events and calendar</li>
              <li><strong>Leadership</strong> - Update information about church leaders and staff</li>
              <li><strong>Cell Groups</strong> - Manage cell group information and leaders</li>
              <li><strong>Membership</strong> - Handle membership renewals and foundation class enrollments</li>
              <li><strong>Media Library</strong> - Upload and organize images and other media files</li>
              <li><strong>Settings</strong> - Configure system settings and preferences</li>
            </ul>

            <h3>Frequently Asked Questions</h3>
          </div>

          <div className="mt-6">
            {faqs.map((faq, index) => (
              <FaqItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === index}
                toggle={() => toggleFaq(index)}
              />
            ))}
          </div>

          <div className={`mt-8 p-4 rounded-lg ${darkMode ? 'bg-blue-900/30 border border-blue-800' : 'bg-blue-50 border border-blue-100'}`}>
            <h3 className={`font-medium ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>Need More Help?</h3>
            <p className="mt-2">
              If you can't find the information you need in this guide, please visit our <Link to="/admin/support" className={`font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>Support Page</Link> for additional assistance.
            </p>
          </div>
        </div>
      </div>
      <AdminFooter darkMode={darkMode} />
    </div>
  );
};

export default AdminGuide;
