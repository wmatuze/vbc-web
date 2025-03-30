import React from 'react';
import { ArrowUpTrayIcon as UploadIcon } from '@heroicons/react/24/outline';

const LeaderForm = ({
  currentLeader,
  formMode,
  loading,
  formErrors,
  onSubmit,
  onChange,
  onCancel,
  onImageUpload,
  fileInputRef
}) => {
  return (
    <form onSubmit={onSubmit} className="bg-white shadow-sm rounded-lg p-6">
      <h3 className="text-lg font-medium mb-6">
        {formMode === 'add' ? 'Add New Leader' : 'Edit Leader'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={currentLeader.name}
              onChange={onChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                formErrors.name ? 'border-red-300' : 'border-gray-300'
              } focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              required
              aria-describedby={formErrors.name ? 'name-error' : undefined}
            />
            {formErrors.name && (
              <p className="mt-2 text-sm text-red-600" id="name-error">
                {formErrors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={currentLeader.title}
              onChange={onChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                formErrors.title ? 'border-red-300' : 'border-gray-300'
              } focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              required
              aria-describedby={formErrors.title ? 'title-error' : undefined}
            />
            {formErrors.title && (
              <p className="mt-2 text-sm text-red-600" id="title-error">
                {formErrors.title}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={currentLeader.department}
              onChange={onChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-700">
              Display Order
            </label>
            <input
              type="number"
              id="order"
              name="order"
              value={currentLeader.order}
              onChange={onChange}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <p className="mt-2 text-sm text-gray-500">
              Lower numbers appear first (0 is highest priority)
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={currentLeader.email}
              onChange={onChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                formErrors.email ? 'border-red-300' : 'border-gray-300'
              } focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              required
              aria-describedby={formErrors.email ? 'email-error' : undefined}
            />
            {formErrors.email && (
              <p className="mt-2 text-sm text-red-600" id="email-error">
                {formErrors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={currentLeader.phone}
              onChange={onChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                formErrors.phone ? 'border-red-300' : 'border-gray-300'
              } focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              aria-describedby={formErrors.phone ? 'phone-error' : undefined}
            />
            {formErrors.phone && (
              <p className="mt-2 text-sm text-red-600" id="phone-error">
                {formErrors.phone}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Image
            </label>
            <div className="mt-1 flex items-center">
              {currentLeader.imageUrl ? (
                <div className="relative">
                  <img
                    src={currentLeader.imageUrl}
                    alt="Profile"
                    className="h-32 w-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      fileInputRef.current?.click();
                    }}
                    className="absolute bottom-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-50"
                  >
                    <UploadIcon className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                  className="h-32 w-32 border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <UploadIcon className="h-8 w-8 text-gray-400" />
                </button>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Upload a square image (JPG, PNG, GIF). Max 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="mt-6">
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          Bio *
        </label>
        <textarea
          id="bio"
          name="bio"
          value={currentLeader.bio}
          onChange={onChange}
          rows="4"
          className={`mt-1 block w-full rounded-md shadow-sm ${
            formErrors.bio ? 'border-red-300' : 'border-gray-300'
          } focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          required
          aria-describedby={formErrors.bio ? 'bio-error' : undefined}
        />
        {formErrors.bio && (
          <p className="mt-2 text-sm text-red-600" id="bio-error">
            {formErrors.bio}
          </p>
        )}
      </div>

      {/* Ministry Focus */}
      <div className="mt-6">
        <label htmlFor="ministryFocus" className="block text-sm font-medium text-gray-700">
          Ministry Focus Areas
        </label>
        <input
          type="text"
          id="ministryFocus"
          name="ministryFocus"
          value={currentLeader.ministryFocus.join(', ')}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="e.g. Youth, Worship, Outreach"
        />
        <p className="mt-2 text-sm text-gray-500">
          Separate multiple areas with commas
        </p>
      </div>

      {/* Social Media */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Social Media</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="social-facebook" className="block text-sm font-medium text-gray-700">
              Facebook URL
            </label>
            <input
              type="url"
              id="social-facebook"
              name="social-facebook"
              value={currentLeader.socialMedia.facebook}
              onChange={onChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="https://facebook.com/username"
            />
          </div>

          <div>
            <label htmlFor="social-twitter" className="block text-sm font-medium text-gray-700">
              Twitter URL
            </label>
            <input
              type="url"
              id="social-twitter"
              name="social-twitter"
              value={currentLeader.socialMedia.twitter}
              onChange={onChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="https://twitter.com/username"
            />
          </div>

          <div>
            <label htmlFor="social-linkedin" className="block text-sm font-medium text-gray-700">
              LinkedIn URL
            </label>
            <input
              type="url"
              id="social-linkedin"
              name="social-linkedin"
              value={currentLeader.socialMedia.linkedin}
              onChange={onChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div>
            <label htmlFor="social-instagram" className="block text-sm font-medium text-gray-700">
              Instagram URL
            </label>
            <input
              type="url"
              id="social-instagram"
              name="social-instagram"
              value={currentLeader.socialMedia.instagram}
              onChange={onChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="https://instagram.com/username"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="mt-6 flex items-center justify-end space-x-3">
        {formMode === 'edit' && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : formMode === 'add' ? 'Add Leader' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default LeaderForm; 