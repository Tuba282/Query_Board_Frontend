import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resetPassword } from '../apis/authApi';
import { toast } from 'react-hot-toast';
import { Lock, Key, ArrowRight } from 'lucide-react';

const ResetPassword = () => {
    const { state } = useLocation();
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const email = state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return toast.error('Email missing');
        setLoading(true);
        try {
            await resetPassword({ email, token, newPassword });
            toast.success('Password Reset Successful');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Reset failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 -mt-20">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-8 rounded-3xl w-full max-w-md shadow-2xl"
            >
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Key className="text-accent w-8 h-8" />
                </div>

                <h2 className="text-3xl font-bold text-center mb-2">Reset Password</h2>
                <p className="text-slate-400 text-center mb-8 text-sm">
                    Enter the token and your new password
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 transition-transform" />
                        <input 
                            type="text" 
                            placeholder="Reset Token" 
                            className="input-field w-full pl-12"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                            type="password" 
                            placeholder="New Password" 
                            className="input-field w-full pl-12"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        disabled={loading}
                        type="submit" 
                        className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 group"
                    >
                        {loading ? 'Resetting...' : (
                            <>
                                Update Password
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
