import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Masonry from "react-masonry-css";
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import PropTypes from 'prop-types';

const galleryImages = [
  { id: 1, src: "/images/gallery1.jpg", alt: "Sunday Service Worship" },
  { id: 2, src: "/images/gallery2.jpg", alt: "Community Outreach" },
  { id: 3, src: "/images/gallery3.jpg", alt: "Youth Ministry Event" },
  { id: 4, src: "/images/gallery4.jpg", alt: "Baptism Ceremony" },
  { id: 5, src: "/images/gallery5.jpg", alt: "Prayer Session" },
  { id: 6, src: "/images/gallery6.jpg", alt: "Christmas Celebration" },
  { id: 7, src: "/images/gallery7.jpg", alt: "Easter Celebration" },
  { id: 8, src: "/images/gallery8.jpg", alt: "Bible Study Group" },
  { id: 9, src: "/images/gallery9.jpg", alt: "Choir Practice" },
  { id: 10, src: "/images/gallery10.jpg", alt: "Volunteer Work" },
  { id: 11, src: "/images/gallery11.jpg", alt: "Church Picnic" },
  { id: 12, src: "/images/gallery12.jpg", alt: "New Year Service" }
];

const GalleryImage = ({ src, alt, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.03 }}
    transition={{ duration: 0.2 }}
    className="cursor-pointer relative group"
    onClick={onClick}
    role="img"
    aria-label={alt}
    tabIndex={0}
  >
    <img
      src={src}
      alt={alt}
      className="w-full h-auto rounded-lg shadow-md transition-opacity duration-200"
      loading="lazy"
    />
    <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      {alt}
    </div>
  </motion.div>
);

GalleryImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const Modal = ({ selectedImage, onClose, onNavigate }) => {
  const handleKeyDown = useCallback((event) => {
    if (event.key === "Escape") onClose();
    if (event.key === "ArrowLeft") onNavigate("prev");
    if (event.key === "ArrowRight") onNavigate("next");
  }, [onClose, onNavigate]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <AnimatePresence>
      {selectedImage && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-w-4xl max-h-[90vh]"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-[70vh] rounded-lg shadow-lg object-contain"
              loading="lazy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <div className="mt-2 text-center text-white">{selectedImage.alt}</div>
            <button onClick={onClose} className="absolute top-4 right-4 text-white bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-600 focus:outline-none">
              <FaTimes />
            </button>
            <button onClick={() => onNavigate('prev')} className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-600 focus:outline-none">
              <FaChevronLeft />
            </button>
            <button onClick={() => onNavigate('next')} className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-600 focus:outline-none">
              <FaChevronRight />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleImageClick = (image, index) => {
    setSelectedImage(image);
    setSelectedIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setSelectedIndex(null);
  };

  const handleNavigate = (direction) => {
    if (selectedIndex === null) return;
    let newIndex = (selectedIndex + (direction === "prev" ? -1 : 1) + galleryImages.length) % galleryImages.length;
    setSelectedImage(galleryImages[newIndex]);
    setSelectedIndex(newIndex);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-6">Gallery</h1>
      <Masonry
        breakpointCols={{ default: 3, 1100: 2, 700: 1 }}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {galleryImages.map((image, index) => (
          <GalleryImage key={image.id} {...image} onClick={() => handleImageClick(image, index)} />
        ))}
      </Masonry>
      <Modal selectedImage={selectedImage} onClose={handleCloseModal} onNavigate={handleNavigate} />
    </div>
  );
};

export default Gallery;
