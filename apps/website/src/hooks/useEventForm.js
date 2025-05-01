import { useState } from 'react';
import { createEvent, updateEvent } from '../services/api';
import { validateEvent, validateField } from '../utils/validationUtils';
import { prepareEventForAPI } from '../utils/dateUtils';
import { INITIAL_EVENT_STATE, EVENT_VALIDATION_RULES } from '../constants/eventConstants';

/**
 * Custom hook for managing event form state and operations
 * @param {Object} options - Configuration options
 * @param {Function} options.onSuccess - Callback after successful save
 * @param {Function} options.onError - Callback for error handling
 * @returns {Object} Form state and event handlers
 */
export const useEventForm = ({ onSuccess, onError }) => {
  const [currentEvent, setCurrentEvent] = useState(INITIAL_EVENT_STATE);
  const [formErrors, setFormErrors] = useState({});
  const [formMode, setFormMode] = useState('add');
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  /**
   * Reset the form to initial state
   */
  const resetForm = () => {
    setCurrentEvent(INITIAL_EVENT_STATE);
    setFormMode('add');
    setFormErrors({});
    setShowForm(false);
  };
  
  /**
   * Handle input changes for form fields
   * @param {Object} e - Event object
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEvent((prev) => ({ ...prev, [name]: value }));

    // Validate the field if it has validation rules
    if (EVENT_VALIDATION_RULES[name]) {
      validateField(
        name,
        value,
        EVENT_VALIDATION_RULES[name],
        formErrors,
        setFormErrors
      );
    }
  };
  
  /**
   * Handle checkbox changes
   * @param {Object} e - Event object
   */
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    console.log(`Checkbox ${name} changed to ${checked}`);
    setCurrentEvent((prev) => ({ ...prev, [name]: checked }));
  };
  
  /**
   * Handle tags input with validation
   * @param {Object} e - Event object
   */
  const handleTagsChange = (e) => {
    const tags = e.target.value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    setCurrentEvent((prev) => ({ ...prev, tags }));

    // Validate tags
    validateField(
      'tags',
      tags,
      {
        type: 'array',
        maxLength: 10,
        itemValidator: (tag) =>
          validateField(
            'tag',
            tag,
            { type: 'string', maxLength: 20, fieldName: 'Tag' },
            {},
            () => {}
          ),
        fieldName: 'Tags',
      },
      formErrors,
      setFormErrors
    );
  };
  
  /**
   * Set up the form for editing an existing event
   * @param {Object} event - Event data to edit
   */
  const editEvent = (event) => {
    // Make sure we preserve the ID for updates
    const eventWithId = {
      ...event,
      id: event.id || event._id, // Normalize ID field
    };
    
    console.log("Setting up form for editing:", eventWithId);
    setCurrentEvent(eventWithId);
    setFormMode('edit');
    setShowForm(true);
  };
  
  /**
   * Set up the form for creating a new event
   */
  const addEvent = () => {
    resetForm();
    setFormMode('add');
    setShowForm(true);
  };
  
  /**
   * Create a duplicate of an event for editing
   * @param {Object} event - Event to duplicate
   */
  const duplicateEvent = (event) => {
    // Create a clean copy without ID fields
    const duplicatedEvent = {
      ...event,
      id: undefined,
      _id: undefined,
      title: `Copy of ${event.title}`,
    };
    
    console.log("Creating duplicate event:", duplicatedEvent);
    setCurrentEvent(duplicatedEvent);
    setFormMode('add');
    setShowForm(true);
  };
  
  /**
   * Submit the event form
   * @returns {Promise<Object|null>} The saved event or null if validation fails
   */
  const submitForm = async () => {
    // Validate all fields before submission
    const { isValid, errors } = validateEvent(currentEvent);

    if (!isValid) {
      // Update form errors and stop submission
      setFormErrors(errors);
      
      if (onError) {
        onError(new Error('Please fix the form errors before submitting'));
      }
      return null;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare the event data for API submission
      const serverEvent = prepareEventForAPI(currentEvent);
      
      // Log what we're sending to the server for debugging
      console.log(`Submitting event in ${formMode} mode:`, serverEvent);
      
      let savedEvent;
      if (formMode === 'add') {
        // Create a new event
        savedEvent = await createEvent(serverEvent);
        console.log("Event created successfully:", savedEvent);
      } else {
        // Update an existing event
        const eventId = currentEvent.id || currentEvent._id;
        
        if (!eventId) {
          throw new Error('Cannot update event: Missing event ID');
        }

        console.log(`Updating event with ID: ${eventId}`);
        savedEvent = await updateEvent(eventId, serverEvent);
        console.log("Event updated successfully:", savedEvent);
      }
      
      // Reset form state after successful save
      resetForm();
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(savedEvent, formMode === 'add' ? 'added' : 'updated');
      }
      
      return savedEvent;
    } catch (error) {
      console.error("Error submitting event:", error);
      if (onError) {
        onError(error);
      }
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    // State
    currentEvent,
    formErrors,
    formMode,
    showForm,
    isSubmitting,
    
    // Setters
    setCurrentEvent,
    setFormErrors,
    setShowForm,
    
    // Event handlers
    handleInputChange,
    handleCheckboxChange,
    handleTagsChange,
    
    // Form operations
    resetForm,
    editEvent,
    addEvent,
    duplicateEvent,
    submitForm,
  };
}; 