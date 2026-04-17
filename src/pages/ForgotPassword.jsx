import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { forgetPassword } from '../apis/authApi';
import { toast } from 'react-hot-toast';
import { Mail, ArrowRight, HelpCircle } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await forgetPassword(email);
            toast.success('Reset token sent to email');
            navigate('/reset-password', { state: { email } });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Request failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 -mt-20">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass p-8 rounded-3xl w-full max-w-md shadow-2xl"
            >
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <HelpCircle className="text-accent w-8 h-8" />
                </div>

                <h2 className="text-3xl font-bold text-center mb-2">Forgot Password</h2>
                <p className="text-slate-400 text-center mb-8 text-sm px-4">
                    Enter your email to receive a password reset token
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            className="input-field w-full pl-12"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        disabled={loading}
                        type="submit" 
                        className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 group"
                    >
                        {loading ? 'Sending...' : (
                            <>
                                Send Token
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
