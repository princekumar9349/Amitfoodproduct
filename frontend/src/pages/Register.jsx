import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Loader2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [address, setAddress] = useState('');
    
    const { register } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        setIsSubmitting(true);
        try {
            await register({ name, email, password, address });
            toast.success('Account created successfully! Welcome aboard.');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            
            {/* --- LEFT SIDE: IMAGE & BRANDING --- */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 to-red-900/90 z-10" />
                <img 
                    src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop" 
                    alt="Delicious Food Spread" 
                    className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
                />
                
                <div className="relative z-20 flex flex-col justify-center px-12 text-white h-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                            Join the <br/> <span className="text-yellow-400">Food Revolution</span>
                        </h1>
                        <p className="text-xl text-orange-100 max-w-md leading-relaxed">
                            Create an account to unlock exclusive deals, track your orders, and enjoy faster checkout.
                        </p>
                    </motion.div>

                    {/* Stats Snippet */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 flex gap-8"
                    >
                        <div>
                            <p className="text-3xl font-bold text-white">50k+</p>
                            <p className="text-sm text-orange-200">Happy Users</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">100+</p>
                            <p className="text-sm text-orange-200">Cities</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">4.8</p>
                            <p className="text-sm text-orange-200">App Rating</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* --- RIGHT SIDE: REGISTER FORM --- */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-gray-50 overflow-y-auto">
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100 my-8"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                        <p className="text-gray-500 mt-2">Sign up to start your food journey</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        
                        {/* Name Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Address Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Delivery Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                    placeholder="Street, City, Pincode"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Confirm Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                    placeholder="Repeat password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-orange-700 shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Create Account'} 
                            {!isSubmitting && <ArrowRight size={20} />}
                        </button>
                    </form>

                    <div className="text-center mt-8">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-orange-600 hover:text-orange-700 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;