import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/authService";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, LogIn, ShieldCheck } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await authService.login(email, password);
      toast.success("Welcome back, Admin!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        {/* Header Section */}
        <div className="bg-gray-900 px-8 py-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-transparent pointer-events-none" />
            
            <div className="inline-flex bg-white/10 p-3 rounded-xl mb-4 backdrop-blur-sm border border-white/10">
                <ShieldCheck size={32} className="text-orange-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Admin Portal</h2>
            <p className="text-gray-400 text-sm">Sign in to manage AmitFood</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Email */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                            placeholder="admin@amitfood.com"
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <div className="flex justify-between items-center mb-1.5 ml-1">
                        <label className="block text-sm font-semibold text-gray-700">Password</label>
                        <a href="#" className="text-xs font-semibold text-orange-600 hover:text-orange-700">Forgot?</a>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center">
                    <input
                        id="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer select-none">
                        Keep me logged in
                    </label>
                </div>

                {/* Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-orange-600 shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
                    {loading ? 'Signing In...' : 'Sign In'}
                </button>
            </form>

            <div className="mt-8 text-center">
                <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
                    ← Back to Website
                </Link>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;