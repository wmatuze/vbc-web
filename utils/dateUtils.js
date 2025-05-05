/**
 * Utility functions for handling dates in the application
 */

/**
 * Format a date object to a string in the format "Month Day, Year"
 * @param {Date} date - The date to format
 * @returns {String} - Formatted date string
 */
const formatDateToString = (date) => {
  if (!date) return null;
  
  try {
    if (date instanceof Date && !isNaN(date.getTime())) {
      const month = date.toLocaleString("default", { month: "long" });
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month} ${day}, ${year}`;
    }
    return null;
  } catch (err) {
    console.error("Error formatting date:", err);
    return null;
  }
};

/**
 * Extract the original date from a Mongoose document
 * @param {Object} obj - The object containing the date
 * @param {String} dateField - The name of the date field
 * @returns {Date|null} - The original date or null if not found
 */
const extractOriginalDate = (obj, dateField) => {
  if (!obj || !dateField) return null;
  
  // Check if we have the original date in _doc (Mongoose document)
  if (obj._doc && obj._doc[dateField] && obj._doc[dateField] instanceof Date) {
    return obj._doc[dateField];
  }
  
  // Check if the field itself is a valid date
  if (obj[dateField] instanceof Date && !isNaN(obj[dateField].getTime())) {
    return obj[dateField];
  }
  
  return null;
};

/**
 * Process a date field in an object, ensuring it's properly formatted
 * @param {Object} obj - The object containing the date field
 * @param {String} dateField - The name of the date field
 * @returns {String|null} - Formatted date string or null if date is invalid
 */
const processDateField = (obj, dateField) => {
  if (!obj || !dateField) return null;
  
  try {
    // First try to extract the original date
    const originalDate = extractOriginalDate(obj, dateField);
    
    // If we found a valid date, format it
    if (originalDate) {
      return formatDateToString(originalDate);
    }
    
    // If the field is a string that might be a date, try to parse it
    if (typeof obj[dateField] === 'string') {
      const parsedDate = new Date(obj[dateField]);
      if (!isNaN(parsedDate.getTime())) {
        return formatDateToString(parsedDate);
      }
      // If it's already formatted like "Month Day, Year", just return it
      if (obj[dateField].includes(',') && /[a-zA-Z]/.test(obj[dateField])) {
        return obj[dateField];
      }
    }
    
    // If we couldn't process the date, return a placeholder
    return "Date unavailable";
  } catch (err) {
    console.error(`Error processing date field ${dateField}:`, err);
    return "Date unavailable";
  }
};

/**
 * Check if a field is a date field
 * @param {String} fieldName - The name of the field
 * @returns {Boolean} - True if the field is a date field
 */
const isDateField = (fieldName) => {
  const dateFieldNames = [
    'birthday', 
    'renewalDate', 
    'submittedAt', 
    'registrationDate', 
    'childDateOfBirth',
    'date', 
    'startDate', 
    'endDate', 
    'createdAt', 
    'updatedAt'
  ];
  
  return dateFieldNames.includes(fieldName);
};

module.exports = {
  formatDateToString,
  extractOriginalDate,
  processDateField,
  isDateField
};
