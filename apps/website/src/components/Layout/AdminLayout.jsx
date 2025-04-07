import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import AdminFooter from '../admin/AdminFooter';

const AdminLayout = ({ children, darkMode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <AdminFooter darkMode={darkMode} />
    </div>
  );
};

export default AdminLayout;
