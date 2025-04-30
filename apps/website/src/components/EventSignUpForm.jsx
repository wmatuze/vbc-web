import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { submitEventSignupRequest } from '../services/api';
import FormField from './common/FormField';

const EventSignUpForm = ({ event, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
    // Baptism-specific fields
    testimony: '',
    previousReligion: '',
    // Baby dedication-specific fields
    childName: '',
    childDateOfBirth: '',
    parentNames: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Form, 2: Success
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Determine which fields to show based on event type
  const isBaptism = event?.type === 'baptism';
  const isBabyDedication = event?.type === 'babyDedication';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Required fields for all event types
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    
    // Baptism-specific validation
    if (isBaptism && !formData.testimony.trim()) {
      errors.testimony = 'Please share your testimony';
    }
    
    // Baby dedication-specific validation
    if (isBabyDedication) {
      if (!formData.childName.trim()) errors.childName = 'Child\'s name is required';
      if (!formData.childDateOfBirth.trim()) errors.childDateOfBirth = 'Child\'s date of birth is required';
      if (!formData.parentNames.trim()) errors.parentNames = 'Parent names are required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // Prepare the request data
      const requestData = {
        eventId: event.id,
        eventType: event.type,
        ...formData
      };
      
      // Submit the request to the API
      await submitEventSignupRequest(requestData);
      
      // Call the onSubmit callback if provided
      if (onSubmit) {
        onSubmit(formData);
      }
      
      // Move to success step
      setStep(2);
    } catch (error) {
      console.error('Error submitting signup request:', error);
      setError('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
                <h3 className="text-2xl font-bold">Sign Up for {event?.title}</h3>
                <p className="text-gray-600 text-sm mt-1">
                  {event?.date} at {event?.time}
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

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required={true}
                errors={formErrors}
                setErrors={setFormErrors}
              />

              <FormField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required={true}
                errors={formErrors}
                setErrors={setFormErrors}
              />

              <FormField
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required={true}
                errors={formErrors}
                setErrors={setFormErrors}
              />

              {/* Baptism-specific fields */}
              {isBaptism && (
                <>
                  <FormField
                    label="Your Testimony"
                    name="testimony"
                    type="textarea"
                    value={formData.testimony}
                    onChange={handleChange}
                    placeholder="Please share your testimony and why you want to be baptized"
                    required={true}
                    errors={formErrors}
                    setErrors={setFormErrors}
                    rows="3"
                  />

                  <FormField
                    label="Previous Religious Background (if any)"
                    name="previousReligion"
                    value={formData.previousReligion}
                    onChange={handleChange}
                    placeholder="Enter your previous religious background"
                    errors={formErrors}
                    setErrors={setFormErrors}
                  />
                </>
              )}

              {/* Baby dedication-specific fields */}
              {isBabyDedication && (
                <>
                  <FormField
                    label="Child's Full Name"
                    name="childName"
                    value={formData.childName}
                    onChange={handleChange}
                    placeholder="Enter child's full name"
                    required={true}
                    errors={formErrors}
                    setErrors={setFormErrors}
                  />

                  <FormField
                    label="Child's Date of Birth"
                    name="childDateOfBirth"
                    type="date"
                    value={formData.childDateOfBirth}
                    onChange={handleChange}
                    required={true}
                    errors={formErrors}
                    setErrors={setFormErrors}
                  />

                  <FormField
                    label="Parents' Full Names"
                    name="parentNames"
                    value={formData.parentNames}
                    onChange={handleChange}
                    placeholder="Enter parents' full names"
                    required={true}
                    errors={formErrors}
                    setErrors={setFormErrors}
                  />
                </>
              )}

              {/* General message field for all event types */}
              <FormField
                label="Additional Message (Optional)"
                name="message"
                type="textarea"
                value={formData.message}
                onChange={handleChange}
                placeholder="Any additional information you'd like to share"
                errors={formErrors}
                setErrors={setFormErrors}
                rows="3"
              />

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </>
        ) : (
          // Success message
          <>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            
            <div className="text-center mb-6">
              <svg
                className="w-16 h-16 text-green-500 mx-auto mb-4"
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
              <h3 className="text-2xl font-bold mb-2">Request Submitted!</h3>
              <p className="text-gray-600 mb-6">
                Your sign-up request for {event?.title} has been submitted successfully.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg mb-6 text-left shadow-sm">
              <h4 className="font-medium text-gray-800 mb-2">Next Steps:</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Check your email for a confirmation</li>
                <li>Our team will review your request</li>
                <li>You'll receive further instructions once approved</li>
              </ol>
            </div>
            
            <div className="text-center">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default EventSignUpForm;
