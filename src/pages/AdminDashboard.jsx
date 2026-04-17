import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPendingQuestions, answerQuestion, deleteQuestion } from '../apis/qaApi';
import { toast } from 'react-hot-toast';
import { LayoutDashboard, MessageSquare, Send, Trash2, ShieldCheck, X } from 'lucide-react';

const AdminDashboard = () => {
    const [pending, setPending] = useState([]);
    const [selectedQ, setSelectedQ] = useState(null);
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);

    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

    const fetchPending = async () => {
        try {
            const data = await getPendingQuestions();
            setPending(data);
        } catch (error) {
            toast.error('Failed to load pending questions');
        }
    };

    useEffect(() => {
        if (userInfo?.role !== 'admin') {
            toast.error('Access Denied');
            return;
        }
        fetchPending();
    }, []);

    const handleAnswer = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await answerQuestion(selectedQ._id, { content: answer });
            toast.success('Reply submitted');
            setAnswer('');
            setSelectedQ(null);
            fetchPending();
        } catch (error) {
            toast.error('Failed to submit reply');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this question?')) {
            try {
                await deleteQuestion(id);
                toast.success('Question deleted');
                fetchPending();
            } catch (error) {
                toast.error('Delete failed');
            }
        }
    };

    if (userInfo?.role !== 'admin') return <div className="text-center py-20">Unauthorized Access</div>;

    return (
        <div className="container mx-auto px-4">
            <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold flex items-center gap-3">
                        <LayoutDashboard className="text-accent w-10 h-10" />
                        Admin Dashboard
                    </h1>
                    <p className="text-slate-400 mt-2 ml-1">Manage product queries and community interactions</p>
                </div>
                <div className="flex gap-4">
                    <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3 border-accent/20">
                        <ShieldCheck className="text-accent" />
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Active Admin</p>
                            <p className="font-semibold text-sm">{userInfo.name}</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Pending List */}
                <div className="lg:col-span-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <MessageSquare className="text-slate-500" />
                            Pending Questions ({pending.length})
                        </h2>
                    </div>

                    {pending.length === 0 ? (
                        <div className="text-center py-20 glass rounded-3xl border-dashed border-white/5">
                            <p className="text-slate-500">All caught up! No pending questions.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pending.map((q) => (
                                <motion.div 
                                    key={q._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="glass p-6 rounded-3xl border border-white/5 hover:border-accent/20 transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-accent/10 px-3 py-1 rounded-full border border-accent/10">
                                            <span className="text-[10px] font-bold text-accent uppercase tracking-tighter">{q.productName}</span>
                                        </div>
                                        <button 
                                            onClick={() => handleDelete(q._id)}
                                            className="text-slate-600 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-slate-300 text-sm mb-6 line-clamp-3">
                                        "{q.content}"
                                    </p>
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                                        <div className="text-xs text-slate-500">
                                            By {q.user?.name}
                                        </div>
                                        <button 
                                            onClick={() => setSelectedQ(q)}
                                            className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                                        >
                                            Reply Now <Send className="w-3 h-3" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Reply Modal */}
            <AnimatePresence>
                {selectedQ && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedQ(null)}
                            className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, y: 100, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.9 }}
                            className="bg-[#0f172a] border border-white/10 w-full max-w-xl rounded-[2.5rem] p-8 relative z-[110] shadow-3xl"
                        >
                            <button 
                                onClick={() => setSelectedQ(null)}
                                className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-slate-500" />
                            </button>

                            <h3 className="text-2xl font-bold mb-2">Reply to Question</h3>
                            <p className="text-slate-400 text-sm mb-6">User: {selectedQ.user?.name} | Product: {selectedQ.productName}</p>
                            
                            <div className="bg-white/5 p-4 rounded-2xl mb-6 border border-white/5">
                                <p className="text-sm italic text-slate-300">"{selectedQ.content}"</p>
                            </div>

                            <form onSubmit={handleAnswer} className="space-y-4">
                                <textarea 
                                    rows="5"
                                    placeholder="Type your expert reply here..."
                                    className="input-field w-full resize-none"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    required
                                />
                                <button 
                                    disabled={loading}
                                    type="submit" 
                                    className="btn-primary w-full py-4 flex items-center justify-center gap-2 group"
                                >
                                    {loading ? 'Sending...' : (
                                        <>
                                            Send Expert Reply
                                            <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
