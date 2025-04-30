import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { submitEventSignupRequest } from '../services/api';
import FormField from './common/FormField';

const EventSignUpForm = ({ event, onClose, onSubmit }) => {
  console.log("EventSignUpForm rendered with event:", event);

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
  
  console.log("Event type detection:", { 
    type: event?.type,
    isBaptism,
    isBabyDedication
  });

  // Add a useEffect hook to log event props when the component loads
  useEffect(() => {
    console.log("EventSignUpForm mounted with event:", event);
    
    if (!event) {
      console.error("EventSignUpForm received null/undefined event");
      setError("Event information is missing. Please try again.");
      return;
    }
    
    if (!event.id) {
      console.warn("Event is missing ID:", event);
    }
    
    // Alert about event type for debugging
    if (event.type === 'baptism') {
      console.log("This is a baptism event - baptism fields will be shown");
    } else if (event.type === 'babyDedication') {
      console.log("This is a baby dedication event - dedication fields will be shown");
    } else {
      console.log("This is a standard event with type:", event.type);
    }
  }, [event]);

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
    console.log("Form submitted with data:", formData);
    
    if (!validateForm()) {
      console.log("Form validation failed with errors:", formErrors);
      return;
    }
    
    if (!event || !event.id) {
      setError("Event information is incomplete. Unable to submit your request.");
      console.error("Can't submit form - event or event.id is missing:", event);
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // Prepare the request data
      const requestData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message || '',
        eventId: String(event.id),
        eventType: event.type || 'event',
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };
      
      // Add event-specific fields
      if (event.type === 'baptism') {
        requestData.testimony = formData.testimony || '';
        requestData.previousReligion = formData.previousReligion || '';
      }
      
      if (event.type === 'babyDedication') {
        requestData.childName = formData.childName || '';
        requestData.childDateOfBirth = formData.childDateOfBirth || '';
        requestData.parentNames = formData.parentNames || '';
      }
      
      console.log("Submitting event signup request:", requestData);
      
      // Submit the request to the API
      const response = await submitEventSignupRequest(requestData);
      console.log("Event signup API response:", response);
      
      // Call the onSubmit callback if provided
      if (onSubmit) {
        onSubmit(formData);
      }
      
      // Move to success step
      setStep(2);
    } catch (error) {
      console.error('Error submitting signup request:', error);
      setError(`There was an error submitting your request: ${error.message || 'Unknown error'}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/95 backdrop-blur-md rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl border border-white/20"
        onClick={e => e.stopPropagation()}
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
            
            <div className="text-center py-4">
              <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-2">Registration Successful!</h4>
              <p className="text-gray-600 mb-6">
                Thank you for signing up for this event. We'll be in touch with more details soon.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
