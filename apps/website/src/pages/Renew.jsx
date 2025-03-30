import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import PlaceHolderbanner from "../assets/ministry-banners/ph.png";
import FallbackImage from "../assets/fallback-image.png";
import { 
  FaSync, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaCalendarCheck,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaChurch,
  FaClipboardCheck,
  FaBirthdayCake
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Renew = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    birthday: "",
    memberSince: "",
    ministryInvolvement: "",
    addressChange: false,
    newAddress: "",
    agreeToTerms: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when field is being edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    }
    
    if (!formData.birthday) {
      errors.birthday = "Birthday is required";
    }
    
    if (!formData.memberSince.trim()) {
      errors.memberSince = "Please select when you became a member";
    }
    
    if (formData.addressChange && !formData.newAddress.trim()) {
      errors.newAddress = "Please provide your new address";
    }
    
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = "You must agree to the renewal terms";
    }
    
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setSubmitting(true);
    setSubmitError("");
    
    // Log form data for debugging
    console.log('Submitting form data:', formData);
    
    // Use the absolute URL to ensure correct server is targeted
    fetch('http://localhost:3000/api/membership/renew', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors', // Use CORS mode for cross-origin requests
      credentials: 'omit', // Don't send cookies for cross-origin requests
      body: JSON.stringify(formData),
    })
    .then(response => {
      console.log('Response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: [...response.headers.entries()].reduce((obj, [key, val]) => {
          obj[key] = val;
          return obj;
        }, {})
      });
      
      // Check if response is ok and has content
      const contentType = response.headers.get('content-type');
      console.log('Content type:', contentType);
      
      if (!response.ok) {
        // If it's JSON, parse the error message
        if (contentType && contentType.includes('application/json')) {
          return response.json().then(errorData => {
            console.log('Error data:', errorData);
            throw new Error(errorData.error || 'Server error');
          });
        }
        // If it's not JSON or empty response
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      
      // For successful responses, ensure we have JSON
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Received non-JSON response from server');
      }
      
      return response.json();
    })
    .then(data => {
      console.log('Renewal submitted successfully:', data);
      setFormSubmitted(true);
      setSubmitting(false);
    })
    .catch(error => {
      console.error('Error submitting renewal form:', error);
      setSubmitting(false);
      setSubmitError(error.message || 'There was a problem submitting your form. Please try again.');
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Membership Renewal - Victory Bible Church Kitwe</title>
        <meta
          name="description"
          content="Renew your membership at Victory Bible Church Kitwe. Complete the renewal form to maintain your membership benefits and privileges."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-b-3xl h-[40vh] md:h-[50vh]">
        <motion.div
          className={`absolute inset-0 ${
            !isImageLoaded ? "animate-pulse bg-gray-200" : ""
          }`}
          style={{
            backgroundImage: `url(${
              isImageLoaded ? PlaceHolderbanner : FallbackImage
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }}
          onLoad={() => setIsImageLoaded(true)}
          aria-label="Hero background image"
        >
          <img
            src={PlaceHolderbanner}
            alt="Victory Bible Church banner"
            className="hidden"
            onLoad={() => setIsImageLoaded(true)}
            onError={() => setIsImageLoaded(true)}
          />
        </motion.div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/85 via-pink-900/75 to-purple-900/85"></div>

        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-block mb-4"
            >
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                <FaSync className="text-purple-300 text-3xl md:text-4xl" />
              </div>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Membership <span className="text-purple-300">Renewal</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto">
              Complete the form below to renew your membership by January 1st
            </p>
          </motion.div>
        </div>
      </section>

      {/* Renewal Form Section */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {formSubmitted ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-6">
              <FaCheckCircle className="text-green-600 dark:text-green-400 text-3xl" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Renewal Submitted!</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Thank you for renewing your membership with Victory Bible Church. We've received your renewal form and will process it shortly.
            </p>
            <p className="text-md text-gray-600 dark:text-gray-400 mb-4">
              A confirmation email has been sent to <strong>{formData.email}</strong>. Your information has been securely submitted to our church administration team.
            </p>
            <p className="text-md text-gray-600 dark:text-gray-400 mb-8">
              If you have any questions, please contact the church office at (123) 456-7890.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/membership"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
              >
                Return to Membership Page
              </Link>
              <Link
                to="/"
                className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold px-6 py-3 rounded-lg transition-all duration-300"
              >
                Go to Homepage
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Form */}
            <div className="md:col-span-2">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                  <h2 className="text-2xl font-bold">Renewal Form</h2>
                  <p className="mt-1 opacity-80">
                    Please provide accurate information to process your renewal
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      <span className="flex items-center gap-2">
                        <FaUser className="text-purple-600 dark:text-purple-400" />
                        Full Name
                      </span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 ${
                        formErrors.fullName ? "border-red-500 dark:border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.fullName && (
                      <p className="mt-2 text-red-500 text-sm">{formErrors.fullName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      <span className="flex items-center gap-2">
                        <FaEnvelope className="text-purple-600 dark:text-purple-400" />
                        Email Address
                      </span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 ${
                        formErrors.email ? "border-red-500 dark:border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.email && (
                      <p className="mt-2 text-red-500 text-sm">{formErrors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      <span className="flex items-center gap-2">
                        <FaPhone className="text-purple-600 dark:text-purple-400" />
                        Phone Number
                      </span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 ${
                        formErrors.phone ? "border-red-500 dark:border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="mt-2 text-red-500 text-sm">{formErrors.phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      <span className="flex items-center gap-2">
                        <FaBirthdayCake className="text-purple-600 dark:text-purple-400" />
                        Birthday
                      </span>
                    </label>
                    <input
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 ${
                        formErrors.birthday ? "border-red-500 dark:border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.birthday && (
                      <p className="mt-2 text-red-500 text-sm">{formErrors.birthday}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      <span className="flex items-center gap-2">
                        <FaCalendarAlt className="text-purple-600 dark:text-purple-400" />
                        Member Since
                      </span>
                    </label>
                    <select
                      name="memberSince"
                      value={formData.memberSince}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 ${
                        formErrors.memberSince ? "border-red-500 dark:border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Year</option>
                      {Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    {formErrors.memberSince && (
                      <p className="mt-2 text-red-500 text-sm">{formErrors.memberSince}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      <span className="flex items-center gap-2">
                        <FaChurch className="text-purple-600 dark:text-purple-400" />
                        Ministry Involvement
                      </span>
                    </label>
                    <textarea
                      name="ministryInvolvement"
                      value={formData.ministryInvolvement}
                      onChange={handleChange}
                      placeholder="List any ministries you're currently involved with (optional)"
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
                    ></textarea>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="checkbox"
                        id="addressChange"
                        name="addressChange"
                        checked={formData.addressChange}
                        onChange={handleChange}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <label htmlFor="addressChange" className="text-gray-700 dark:text-gray-300">
                        My address has changed since last renewal
                      </label>
                    </div>
                    
                    {formData.addressChange && (
                      <div className="mt-3 ml-6">
                        <textarea
                          name="newAddress"
                          value={formData.newAddress}
                          onChange={handleChange}
                          placeholder="Enter your new address"
                          rows={2}
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 ${
                            formErrors.newAddress ? "border-red-500 dark:border-red-500" : "border-gray-300"
                          }`}
                        ></textarea>
                        {formErrors.newAddress && (
                          <p className="mt-2 text-red-500 text-sm">{formErrors.newAddress}</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="agreeToTerms"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        className={`w-4 h-4 mt-1 text-purple-600 rounded focus:ring-purple-500 ${
                          formErrors.agreeToTerms ? "border-red-500" : ""
                        }`}
                      />
                      <label htmlFor="agreeToTerms" className="text-gray-700 dark:text-gray-300">
                        I confirm that I continue to adhere to the values and statement of faith of Victory Bible Church, and wish to renew my membership for the coming year.
                      </label>
                    </div>
                    {formErrors.agreeToTerms && (
                      <p className="mt-2 text-red-500 text-sm ml-6">{formErrors.agreeToTerms}</p>
                    )}
                  </div>
                  
                  {submitError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                      <div className="flex items-center">
                        <FaExclamationTriangle className="text-red-500 mr-2" />
                        <span className="font-medium">Submission Error:</span>
                        <span className="ml-2">{submitError}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>Submit Renewal</>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
            
            {/* Important Information */}
            <div className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="sticky top-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden h-fit"
              >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <FaCalendarCheck className="text-yellow-300" />
                    Important Information
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Renewal Deadline</span>
                      <span className="font-bold text-red-600 dark:text-red-400">January 1st</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      All renewals must be completed by this date to maintain active membership status.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                        <FaClipboardCheck className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">Renewal Benefits</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Maintain your voting rights and leadership eligibility
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center flex-shrink-0">
                        <FaExclamationTriangle className="text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">Late Renewals</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Renewals after the deadline require additional processing time
                        </p>
                      </div>
                    </div>
                    
                    {/* <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                        <FaBirthdayCake className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">Birthday Celebrations</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          We celebrate member birthdays and need your date for our registry
                        </p>
                      </div>
                    </div> */}
                  </div>
                  
                  <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Need help with your renewal? Contact the church office at <strong>(123) 456-7890</strong> or email <strong>renewal@vbc.info</strong>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Renew;