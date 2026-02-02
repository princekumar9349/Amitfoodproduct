import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-2xl font-bold text-primary mb-4">AmitFood</h3>
                        <p className="text-gray-400 text-sm">
                            Authentic flavors delivered to your doorstep. Fresh ingredients, handmade with love.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><a href="#" className="hover:text-primary">Home</a></li>
                            <li><a href="#" className="hover:text-primary">Menu</a></li>
                            <li><a href="#" className="hover:text-primary">About Us</a></li>
                            <li><a href="#" className="hover:text-primary">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>123 Foodie Lane</li>
                            <li>Tasty City, IN 400001</li>
                            <li>support@amitfood.in</li>
                            <li>+91 98765 43210</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Instagram size={20} /></a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Amit Food Product. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
