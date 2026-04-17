import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, User, Menu, X, MessageSquare } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    
    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[90%] max-w-5xl ${isScrolled ? 'top-4' : 'top-6'}`}>
            <div className="glass px-6 py-3 rounded-full flex items-center justify-between shadow-2xl shadow-accent/10">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-accent p-2 rounded-lg group-hover:rotate-12 transition-transform">
                        <MessageSquare className="text-white w-5 h-5" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white hidden sm:block">
                        QA<span className="text-accent">Board</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-sm font-medium hover:text-accent transition-colors">Home</Link>
                    {userInfo?.role === 'admin' && (
                        <Link to="/admin" className="text-sm font-medium hover:text-accent transition-colors">Admin Panel</Link>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {userInfo ? (
                        <div className="flex items-center gap-4">
                            <Link to="/profile" className="flex items-center gap-2 group">
                                {userInfo.profileImg ? (
                                    <img src={userInfo.profileImg} alt="Profile" className="w-8 h-8 rounded-full object-cover border-2 border-accent/20" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                                        <User className="w-4 h-4 text-accent" />
                                    </div>
                                )}
                                <span className="text-sm font-medium hidden lg:block">{userInfo.name}</span>
                            </Link>
                            <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn-primary py-2 px-6">Login</Link>
                    )}
                    
                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-20 left-0 right-0 glass rounded-3xl p-6 md:hidden flex flex-col gap-4 shadow-2xl"
                >
                    <Link to="/" onClick={() => setIsOpen(false)} className="py-2 border-b border-white/5">Home</Link>
                    {userInfo?.role === 'admin' && (
                        <Link to="/admin" onClick={() => setIsOpen(false)} className="py-2 border-b border-white/5">Admin Panel</Link>
                    )}
                    <Link to="/profile" onClick={() => setIsOpen(false)} className="py-2">Profile</Link>
                </motion.div>
            )}
        </nav>
    );
};

export default Navbar;
