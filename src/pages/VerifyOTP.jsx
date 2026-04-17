import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { verifyOTP } from '../apis/authApi';
import { toast } from 'react-hot-toast';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const VerifyOTP = () => {
    const { state } = useLocation();
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const email = state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return toast.error('Email missing');
        setLoading(true);
        try {
            const data = await verifyOTP({ email, otp });
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Email Verified Successfully');
            navigate('/');
            window.location.reload();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 -mt-20">
            <motion.div 
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-8 rounded-3xl w-full max-w-md shadow-2xl text-center"
            >
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="text-accent w-8 h-8" />
                </div>

                <h2 className="text-3xl font-bold mb-2">Verify OTP</h2>
                <p className="text-slate-400 mb-8 text-sm px-4">
                    Enter the 6-digit code sent to <span className="text-white font-medium">{email}</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <input 
                        type="text" 
                        maxLength="6"
                        placeholder="000000" 
                        className="input-field w-full text-center text-3xl tracking-[1rem] py-5"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />

                    <button 
                        disabled={loading}
                        type="submit" 
                        className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 group"
                    >
                        {loading ? 'Verifying...' : (
                            <>
                                Verify & Continue
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default VerifyOTP;
