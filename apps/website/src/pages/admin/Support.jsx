import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import AdminFooter from "../../components/admin/AdminFooter";
import axios from "axios";

const Support = ({ darkMode }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "medium",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Send the support request to our API endpoint
      // Use the full URL to the API server
      const response = await axios.post(
        "http://localhost:3000/api/support",
        formData
      );

      console.log("Support request submitted:", response.data);

      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        priority: "medium",
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting support request:", error);
      setIsSubmitting(false);
      setSubmitError(
        error.response?.data?.error ||
          "Failed to send support request. Please try again later."
      );
    }
  };

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/admin")}
            className={`mr-4 p-2 rounded-full ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">Support</h1>
        </div>

        <div
          className={`rounded-xl shadow-sm p-6 mb-6 ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="md:col-span-1">
              <h2 className="text-xl font-semibold mb-4">
                Contact Information
              </h2>
              <p
                className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                Our support team is here to help you with any questions or
                issues you may have with the CMS.
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div
                    className={`p-2 rounded-full mr-3 ${darkMode ? "bg-indigo-900/30 text-indigo-300" : "bg-indigo-100 text-indigo-600"}`}
                  >
                    <EnvelopeIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email Support</h3>
                    <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                      <a
                        href="mailto:watu.matuze@hotmail.com"
                        className={`hover:underline ${darkMode ? "text-indigo-300" : "text-indigo-600"}`}
                      >
                        watu.matuze@hotmail.com
                      </a>
                    </p>
                    <p
                      className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Response within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className={`p-2 rounded-full mr-3 ${darkMode ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-600"}`}
                  >
                    <PhoneIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone Support</h3>
                    <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                      <a
                        href="tel:+260976072699"
                        className={`hover:underline ${darkMode ? "text-green-300" : "text-green-600"}`}
                      >
                        +260 976 072 699
                      </a>
                    </p>
                    <p
                      className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Monday-Friday, 9AM-5PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className={`p-2 rounded-full mr-3 ${darkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-600"}`}
                  >
                    <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Live Chat</h3>
                    <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                      Available during office hours
                    </p>
                    <button
                      className={`text-sm mt-1 px-3 py-1 rounded ${
                        darkMode
                          ? "bg-blue-900/50 text-blue-300 hover:bg-blue-900/70"
                          : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                      }`}
                    >
                      Start Chat
                    </button>
                  </div>
                </div>
              </div>

              <div
                className={`mt-8 p-4 rounded-lg ${darkMode ? "bg-gray-700/50" : "bg-gray-100"}`}
              >
                <h3 className="font-medium mb-2">Support Hours</h3>
                <p
                  className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  <strong>Monday-Friday:</strong> 9:00 AM - 5:00 PM
                  <br />
                  <strong>Saturday:</strong> 9:00 AM - 12:00 PM
                  <br />
                  <strong>Sunday:</strong> Closed
                </p>
              </div>
            </div>

            {/* Support Request Form */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">
                Submit a Support Request
              </h2>

              <div
                className={`mb-6 p-4 rounded-lg ${darkMode ? "bg-blue-900/30 border border-blue-800 text-blue-300" : "bg-blue-50 border border-blue-200 text-blue-700"}`}
              >
                <p className="text-sm">
                  <strong>Note:</strong> Support requests submitted through this
                  form will be sent directly to Watu Matuze
                  (watu.matuze@hotmail.com).
                </p>
              </div>

              {submitSuccess && (
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    darkMode
                      ? "bg-green-900/30 border border-green-800 text-green-300"
                      : "bg-green-50 border border-green-200 text-green-800"
                  }`}
                >
                  Your support request has been sent successfully to Watu Matuze
                  (watu.matuze@hotmail.com). We'll get back to you as soon as
                  possible.
                </div>
              )}

              {submitError && (
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    darkMode
                      ? "bg-red-900/30 border border-red-800 text-red-300"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}
                >
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="priority"
                    className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option
                      value="low"
                      className={darkMode ? "bg-gray-700" : ""}
                    >
                      Low - General question
                    </option>
                    <option
                      value="medium"
                      className={darkMode ? "bg-gray-700" : ""}
                    >
                      Medium - Need assistance
                    </option>
                    <option
                      value="high"
                      className={darkMode ? "bg-gray-700" : ""}
                    >
                      High - System issue
                    </option>
                    <option
                      value="urgent"
                      className={darkMode ? "bg-gray-700" : ""}
                    >
                      Urgent - Critical problem
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    data-gramm="false"
                    data-gramm_editor="false"
                    data-enable-grammarly="false"
                    className={`w-full px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full md:w-auto px-6 py-3 rounded-lg font-medium text-white ${
                      isSubmitting
                        ? "bg-indigo-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    } transition-colors duration-200`}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Support Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <AdminFooter darkMode={darkMode} />
    </div>
  );
};

export default Support;
