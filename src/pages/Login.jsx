import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loginUser } from '../apis/authApi';
import { toast } from 'react-hot-toast';
import { Mail, Lock, ArrowRight, LogIn } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await loginUser(formData);
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Login Successful');
            navigate('/');
            window.location.reload(); // Refresh to update navbar
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 -mt-20">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-8 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-[60px]" />
                
                <div className="relative z-10">
                    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <LogIn className="text-accent w-8 h-8" />
                    </div>
                    
                    <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
                    <p className="text-slate-400 text-center mb-8 text-sm">Login to access your board</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                className="input-field w-full pl-12"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input 
                                type="password" 
                                placeholder="Password" 
                                className="input-field w-full pl-12"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required
                            />
                        </div>

                        <div className="flex justify-end">
                            <Link to="/forgot-password" name="forgot" className="text-xs text-accent hover:underline">Forgot Password?</Link>
                        </div>

                        <button 
                            disabled={loading}
                            type="submit" 
                            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 group"
                        >
                            {loading ? 'Logging in...' : (
                                <>
                                    Log In
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-slate-400 text-sm">
                        Don't have an account? <Link to="/register" className="text-accent hover:underline">Register now</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
