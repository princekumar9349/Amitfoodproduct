import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Menu, X, User } from 'lucide-react';
import authService from '../services/authService';
import clsx from 'clsx';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const admin = authService.getCurrentAdmin();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
        window.location.reload();
    };

    const navLinks = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Products', path: '/products', icon: Package },
        { name: 'Orders', path: '/orders', icon: ShoppingCart },
    ];

    if (!admin) return null;

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-primary">AmitFoods Admin</span>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = location.pathname === link.path;
                                return (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={clsx(
                                            isActive
                                                ? 'border-primary text-gray-900'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                            'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors'
                                        )}
                                    >
                                        <Icon size={18} className="mr-2" />
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center text-sm font-medium text-gray-500">
                                <User size={18} className="mr-2" />
                                {admin.name || 'Admin'}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="sm:hidden border-t border-gray-200 bg-white">
                    <div className="pt-2 pb-3 space-y-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={clsx(
                                        isActive
                                            ? 'bg-primary/10 border-primary text-primary'
                                            : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                                        'block pl-3 pr-4 py-2 border-l-4 text-base font-medium flex items-center'
                                    )}
                                >
                                    <Icon size={18} className="mr-3" />
                                    {link.name}
                                </Link>
                            );
                        })}
                        <button
                            onClick={handleLogout}
                            className="w-full text-left block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-600 hover:bg-gray-50 hover:border-red-300 flex items-center"
                        >
                            <LogOut size={18} className="mr-3" />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
