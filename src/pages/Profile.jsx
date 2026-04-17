import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getUserProfile, updateUserProfile, deleteUserAccount } from '../apis/userApi';
import { toast } from 'react-hot-toast';
import { User, Mail, Camera, Save, Trash2, Shield } from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            const data = await getUserProfile();
            setUser(data);
            setFormData({ name: data.name, email: data.email });
            setPreview(data.profileImg);
        } catch (error) {
            toast.error('Failed to load profile');
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            if (image) data.append('profileImg', image);

            const updated = await updateUserProfile(data);
            setUser(updated);
            localStorage.setItem('userInfo', JSON.stringify({
                ...JSON.parse(localStorage.getItem('userInfo')),
                name: updated.name,
                profileImg: updated.profileImg
            }));
            toast.success('Profile Updated');
        } catch (error) {
            toast.error('Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
            try {
                await deleteUserAccount();
                toast.success('Account deleted');
                localStorage.removeItem('userInfo');
                navigate('/register');
            } catch (error) {
                toast.error('Delete failed');
            }
        }
    };

    if (!user) return <div className="text-center py-20">Loading profile...</div>;

    return (
        <div className="container mx-auto px-4 max-w-4xl">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
            >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 blur-[100px]" />

                <div className="flex flex-col md:flex-row gap-12 relative z-10">
                    {/* Left: Avatar Section */}
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative group">
                            <div className="w-48 h-48 rounded-[2rem] overflow-hidden border-4 border-white/5 shadow-2xl">
                                {preview ? (
                                    <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                        <User className="w-20 h-20 text-slate-700" />
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-4 right-4 bg-accent hover:bg-accent/80 p-3 rounded-2xl cursor-pointer shadow-xl transition-all active:scale-90">
                                <Camera className="w-6 h-6 text-white" />
                                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                            </label>
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold">{user.name}</h2>
                            <div className="flex items-center justify-center gap-2 text-accent bg-accent/10 px-4 py-1 rounded-full mt-2 border border-accent/20">
                                <Shield className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">{user.role}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Info Section */}
                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-8">Account Settings</h3>
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2 ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -underline-y-1/2 text-slate-500 w-5 h-5" />
                                        <input 
                                            type="text" 
                                            className="input-field w-full pl-12"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2 ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -underline-y-1/2 text-slate-500 w-5 h-5" />
                                        <input 
                                            type="email" 
                                            className="input-field w-full pl-12 bg-white/5 text-slate-500 cursor-not-allowed"
                                            value={formData.email}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 flex flex-col sm:flex-row gap-4">
                                <button 
                                    disabled={loading}
                                    type="submit" 
                                    className="btn-primary flex-1 py-4 flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Saving...' : <><Save className="w-5 h-5" /> Save Changes</>}
                                </button>
                                <button 
                                    type="button"
                                    onClick={handleDelete}
                                    className="px-8 py-4 rounded-full border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-5 h-5" /> Delete Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
