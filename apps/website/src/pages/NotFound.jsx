const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center p-8">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a
        href="/"
        className="inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors duration-300 text-lg font-semibold"
      >
        Return to Home
      </a>
    </div>
  </div>
);

export default NotFound;