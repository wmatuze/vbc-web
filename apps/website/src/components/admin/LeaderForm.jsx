import { ArrowUpTrayIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import placeholderImage from "../../assets/placeholders/default-image.svg";

const Section = ({ title, children, darkMode }) => (
  <div>
    <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 pb-2 border-b ${darkMode ? "text-gray-400 border-gray-700" : "text-gray-400 border-gray-100"}`}>
      {title}
    </h4>
    <div className="space-y-4">{children}</div>
  </div>
);

const Field = ({ label, required, error, hint, children, darkMode }) => (
  <div>
    <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    {!error && hint && <p className={`mt-1 text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{hint}</p>}
  </div>
);

const LeaderForm = ({
  currentLeader,
  formMode,
  isSubmitting,
  formErrors,
  darkMode,
  onSubmit,
  onChange,
  onCancel,
  onImageUpload,
  onMediaBrowse,
  fileInputRef,
  getImageUrl,
}) => {
  const inp = (name) =>
    `w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
      formErrors[name] ? "border-red-500" :
      darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
               : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
    }`;

  const previewUrl = currentLeader.imageUrl
    ? (getImageUrl ? getImageUrl(currentLeader.imageUrl) : currentLeader.imageUrl)
    : null;

  return (
    <>
      {/* Panel header */}
      <div className={`flex items-center justify-between px-6 py-4 border-b flex-shrink-0 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        <div>
          <h3 className={`text-base font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
            {formMode === "add" ? "Add New Leader" : "Edit Leader"}
          </h3>
          <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Fill in the details below</p>
        </div>
        <button type="button" onClick={onCancel}
          className={`p-1.5 rounded-lg transition-colors ${darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-400"}`}>
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Scrollable form body */}
      <form onSubmit={onSubmit} className="flex-1 overflow-y-auto">
        <div className="px-6 py-5 space-y-7">

          {/* ── Profile Photo ── */}
          <Section title="Profile Photo" darkMode={darkMode}>
            <div className="flex items-start gap-5">
              {/* Preview — larger, portrait-friendly */}
              <div className={`flex-shrink-0 w-32 h-36 rounded-xl overflow-hidden border-2 ${darkMode ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-gray-100"}`}>
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover object-top"
                    onError={(e) => { e.target.src = placeholderImage; e.target.onerror = null; }} />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center text-5xl font-bold ${darkMode ? "bg-gray-700 text-gray-500" : "bg-gray-100 text-gray-300"}`}>
                    {currentLeader.name ? currentLeader.name[0].toUpperCase() : "?"}
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2 pt-1">
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                  <ArrowUpTrayIcon className="h-4 w-4" />
                  Upload Photo
                </button>
                {onMediaBrowse && (
                  <button type="button" onClick={onMediaBrowse}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                    <PhotoIcon className="h-4 w-4" />
                    Browse Library
                  </button>
                )}
                <p className={`text-xs leading-relaxed ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  JPG, PNG or GIF<br/>Max 5 MB
                </p>
              </div>
            </div>
          </Section>

          {/* ── Basic Info ── */}
          <Section title="Basic Info" darkMode={darkMode}>
            <Field label="Full Name" required error={formErrors.name} darkMode={darkMode}>
              <input name="name" type="text" value={currentLeader.name} onChange={onChange}
                placeholder="Pastor John Smith" className={inp("name")} required />
            </Field>
            <Field label="Title / Role" required error={formErrors.title} darkMode={darkMode}>
              <input name="title" type="text" value={currentLeader.title} onChange={onChange}
                placeholder="Senior Pastor" className={inp("title")} required />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Department" error={formErrors.department} darkMode={darkMode}>
                <input name="department" type="text" value={currentLeader.department || ""} onChange={onChange}
                  placeholder="e.g. Leadership" className={inp("department")} />
              </Field>
              <Field label="Display Order" hint="0 = first" error={formErrors.order} darkMode={darkMode}>
                <input name="order" type="number" min="0" value={currentLeader.order ?? 0} onChange={onChange}
                  className={inp("order")} />
              </Field>
            </div>
          </Section>

          {/* ── Contact ── */}
          <Section title="Contact" darkMode={darkMode}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email" required error={formErrors.email} darkMode={darkMode}>
                <input name="email" type="email" value={currentLeader.email || ""} onChange={onChange}
                  placeholder="pastor@church.org" className={inp("email")} required />
              </Field>
              <Field label="Phone" error={formErrors.phone} darkMode={darkMode}>
                <input name="phone" type="tel" value={currentLeader.phone || ""} onChange={onChange}
                  placeholder="+1 555 000 0000" className={inp("phone")} />
              </Field>
            </div>
          </Section>

          {/* ── Bio & Ministry ── */}
          <Section title="Bio & Ministry" darkMode={darkMode}>
            <Field label="Biography" required error={formErrors.bio} darkMode={darkMode}>
              <textarea name="bio" value={currentLeader.bio || ""} onChange={onChange}
                rows={4} placeholder="A brief description of this leader's background and heart for ministry…"
                className={inp("bio")} required />
            </Field>
            <Field label="Ministry Focus Areas" hint="Comma-separated, e.g. Youth, Worship, Outreach" error={formErrors.ministryFocus} darkMode={darkMode}>
              <input name="ministryFocus" type="text"
                value={Array.isArray(currentLeader.ministryFocus) ? currentLeader.ministryFocus.join(", ") : ""}
                onChange={onChange} placeholder="e.g. Youth, Prayer, Evangelism" className={inp("ministryFocus")} />
            </Field>
          </Section>

          {/* ── Social Media ── */}
          <Section title="Social Media" darkMode={darkMode}>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "facebook",  placeholder: "facebook.com/…",   label: "Facebook"   },
                { key: "twitter",   placeholder: "twitter.com/…",    label: "X / Twitter" },
                { key: "instagram", placeholder: "instagram.com/…",  label: "Instagram"  },
                { key: "linkedin",  placeholder: "linkedin.com/in/…", label: "LinkedIn"  },
              ].map(({ key, placeholder, label }) => (
                <Field key={key} label={label} darkMode={darkMode}>
                  <input name={`social-${key}`} type="url"
                    value={currentLeader.socialMedia?.[key] || ""}
                    onChange={onChange} placeholder={`https://${placeholder}`}
                    className={inp(`social-${key}`)} />
                </Field>
              ))}
            </div>
          </Section>

        </div>

        {/* Sticky footer */}
        <div className={`flex justify-end gap-3 px-6 py-4 border-t flex-shrink-0 sticky bottom-0 ${darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"}`}>
          <button type="button" onClick={onCancel}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2">
            {isSubmitting && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
            {isSubmitting ? "Saving…" : formMode === "add" ? "Add Leader" : "Save Changes"}
          </button>
        </div>
      </form>
    </>
  );
};

export default LeaderForm;
