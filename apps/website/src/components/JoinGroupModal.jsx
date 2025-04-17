// src/components/JoinGroupModal.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaComment,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const JoinGroupModal = ({ group, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [step, setStep] = useState(1); // 1: Form, 2: Success
  const [consent, setConsent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!consent) return;
    onSubmit(formData);
    setStep(2); // Move to success step
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/95 backdrop-blur-md rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl border border-white/20"
      >
        {step === 1 ? (
          <>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold">Join {group.name}</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Led by {group.leader}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Group Info */}
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg mb-6 shadow-sm">
              <div className="flex items-center mb-2">
                <FaCalendarAlt className="text-gray-500 mr-2" />
                <span className="text-gray-700">
                  {group.meetingDay} at {group.meetingTime}
                </span>
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-gray-500 mr-2" />
                <span className="text-gray-700">{group.location}</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Your request will be sent to the cell leader who will contact
                you with next steps. Please provide your contact information
                below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Your Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    className="w-full pl-10 p-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 shadow-sm"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Full Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Your Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full pl-10 p-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 shadow-sm"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    className="w-full pl-10 p-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 shadow-sm"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="(123) 456-7890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Message (Optional)
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FaComment className="text-gray-400" />
                  </div>
                  <textarea
                    className="w-full pl-10 p-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 shadow-sm"
                    rows="4"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Let the cell leader know why you're interested in joining this group..."
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    className="mt-1 mr-2"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    required
                  />
                  <span className="text-sm text-gray-600">
                    I consent to Victory Bible Church storing my contact
                    information and contacting me about this cell group. My
                    information will be processed in accordance with the
                    church's privacy policy.
                  </span>
                </label>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !consent}
                  className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all duration-300"
                >
                  {isLoading ? "Submitting..." : "Send Request"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Request Sent!</h3>
            <p className="text-gray-600 mb-6">
              Your request to join {group.name} has been sent to {group.leader}.
              You should receive a response within 48 hours.
            </p>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg mb-6 text-left shadow-sm">
              <h4 className="font-medium text-gray-800 mb-2">Next Steps:</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Check your email for a confirmation</li>
                <li>The cell leader will contact you soon</li>
                <li>
                  Prepare to attend your first meeting on {group.meetingDay}
                </li>
              </ol>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 shadow-md transition-all duration-300"
            >
              Close
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default JoinGroupModal;
