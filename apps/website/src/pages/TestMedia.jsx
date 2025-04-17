import React, { useState, useEffect } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery";

const TestMedia = () => {
  // Use React Query for fetching media
  const {
    data: media = [],
    isLoading: loading,
    error,
    refetch: refetchMedia,
  } = useMediaQuery();

  const API_URL = "http://localhost:3000";

  // Log media data when it changes
  useEffect(() => {
    if (media && media.length > 0) {
      console.log("Media data:", media);
    }
  }, [media]);

  // Test various image URL formats
  const testImageFormats = (mediaItem) => {
    const urls = [];

    // Format 1: Direct filename
    urls.push({
      name: "Direct filename",
      url: `${API_URL}/uploads/${mediaItem.filename}`,
    });

    // Format 2: Using path property
    if (mediaItem.path) {
      urls.push({
        name: "Using path",
        url: `${API_URL}${mediaItem.path.startsWith("/") ? "" : "/"}${mediaItem.path}`,
      });
    }

    // Format 3: Absolute URL in path
    if (mediaItem.path) {
      urls.push({
        name: "Absolute URL in path",
        url: mediaItem.path.includes("http")
          ? mediaItem.path
          : `http://localhost:3000${mediaItem.path}`,
      });
    }

    return urls;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Media Test Page</h1>
      <p className="mb-4">
        This page tests different ways to display uploaded media files.
      </p>

      {loading && <p>Loading media...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 gap-6">
        {media.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <div className="mb-2">
              <p>
                <strong>ID:</strong> {item.id}
              </p>
              <p>
                <strong>Filename:</strong> {item.filename}
              </p>
              <p>
                <strong>Path:</strong> {item.path}
              </p>
            </div>

            <h3 className="font-medium mb-2">Testing different URL formats:</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {testImageFormats(item).map((test, index) => (
                <div key={index} className="border p-2 rounded">
                  <h4 className="font-medium mb-1">{test.name}</h4>
                  <p className="text-xs mb-2 break-all">{test.url}</p>
                  <div className="bg-gray-100 h-48 flex items-center justify-center">
                    <img
                      src={test.url}
                      alt={`${item.title} - ${test.name}`}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        console.error(`Failed to load image: ${test.url}`);
                        e.target.src =
                          "https://via.placeholder.com/150?text=Load+Failed";
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <hr className="my-4" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestMedia;
