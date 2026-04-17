import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBoardQuestions, createQuestion } from '../apis/qaApi';
import QuestionCard from '../components/QuestionCard';
import { toast } from 'react-hot-toast';
import { Plus, Send, MessageCircle, HelpCircle } from 'lucide-react';

const Home = () => {
    const [questions, setQuestions] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ productName: '', content: '' });
    
    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

    const fetchQuestions = async () => {
        try {
            const data = await getBoardQuestions();
            setQuestions(data);
        } catch (error) {
            console.error('Failed to fetch board');
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userInfo) return toast.error('Please login to ask a question');
        setLoading(true);
        try {
            await createQuestion(formData);
            toast.success('Question submitted! Admin will reply soon.');
            setFormData({ productName: '', content: '' });
            setShowForm(false);
            fetchQuestions();
        } catch (error) {
            toast.error('Failed to submit question');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4">
            {/* Hero Section */}
            <section className="text-center py-20 relative">
                <div className="absolute top-0 left-1/2 -underline-x-1/2 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full -z-10" />
                
                <motion.h1 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight"
                >
                    Have a <span className="text-gradient">Question?</span> <br />
                    Get Expert Answers.
                </motion.h1>
                <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                    The community board where you can ask about our products and receive direct replies from our experts.
                </p>

                <div className="flex justify-center gap-4">
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className="btn-primary flex items-center gap-2 group"
                    >
                        <Plus className={`w-5 h-5 transition-transform duration-300 ${showForm ? 'rotate-45' : ''}`} />
                        {showForm ? 'Close Form' : 'Ask Question'}
                    </button>
                    <a href="#board" className="px-8 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-all font-medium">
                        Explore Board
                    </a>
                </div>
            </section>

            {/* Ask Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mb-20"
                    >
                        <div className="glass max-w-2xl mx-auto p-8 rounded-[2rem] shadow-2xl">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <HelpCircle className="text-accent" />
                                Your Question
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1 ml-1">Product Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Smart Watch Pro" 
                                        className="input-field w-full"
                                        value={formData.productName}
                                        onChange={(e) => setFormData({...formData, productName: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1 ml-1">What's your question?</label>
                                    <textarea 
                                        rows="4" 
                                        placeholder="Type your question in detail..." 
                                        className="input-field w-full resize-none"
                                        value={formData.content}
                                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                                        required
                                    />
                                </div>
                                <button 
                                    disabled={loading}
                                    type="submit" 
                                    className="btn-primary w-full py-4 flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Submitting...' : <><Send className="w-5 h-5" /> Submit Question</>}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Query Board */}
            <section id="board" className="py-20">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <MessageCircle className="text-accent" />
                            Query Board
                        </h2>
                        <p className="text-slate-400">All questions answered by our team</p>
                    </div>
                    <div className="hidden sm:block px-4 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest">
                        {questions.length} Discussions
                    </div>
                </div>

                {questions.length === 0 ? (
                    <div className="text-center py-20 glass rounded-3xl">
                        <p className="text-slate-500">No questions answered yet. Be the first to ask!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {questions.map((q) => (
                            <QuestionCard key={q._id} q={q} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
