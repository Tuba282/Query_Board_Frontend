import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { registerUser } from '../apis/authApi';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await registerUser(formData);
            toast.success(res.message);
            navigate('/verify-otp', { state: { email: formData.email } });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 -mt-20">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-8 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden"
            >
                {/* Background Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 blur-[100px]" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/20 blur-[100px]" />

                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
                    <p className="text-slate-400 text-center mb-8 text-sm">Join our product community today</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input 
                                type="text" 
                                placeholder="Full Name" 
                                className="input-field w-full pl-12"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>
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

                        <button 
                            disabled={loading}
                            type="submit" 
                            className="btn-primary w-full py-4 text-lg mt-4 flex items-center justify-center gap-2 group"
                        >
                            {loading ? 'Creating...' : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-slate-400 text-sm">
                        Already have an account? <Link to="/login" className="text-accent hover:underline">Login here</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
