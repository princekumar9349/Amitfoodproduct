import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-background font-sans text-gray-900">
            <Toaster position="top-right" />
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
