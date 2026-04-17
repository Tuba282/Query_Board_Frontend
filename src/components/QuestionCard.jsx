import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, User, CheckCircle2 } from 'lucide-react';

const QuestionCard = ({ q }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass p-6 rounded-3xl relative overflow-hidden group hover:border-accent/30 transition-all duration-500"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-accent group-hover:w-2 transition-all" />
            
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {q.user?.profileImg ? (
                        <img src={q.user.profileImg} alt={q.user.name} className="w-10 h-10 rounded-full border border-white/10" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                            <User className="text-slate-400 w-5 h-5" />
                        </div>
                    )}
                    <div>
                        <h4 className="font-semibold text-slate-200">{q.user?.name}</h4>
                        <span className="text-[10px] uppercase tracking-wider text-accent font-bold px-2 py-0.5 bg-accent/10 rounded-full">
                            {q.productName}
                        </span>
                    </div>
                </div>
                <span className="text-xs text-slate-500">{new Date(q.createdAt).toLocaleDateString()}</span>
            </div>

            <p className="text-slate-300 mb-6 leading-relaxed">
                {q.content}
            </p>

            {q.answer && (
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 mt-4">
                    <div className="flex items-center gap-2 mb-2 text-accent">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Admin Reply</span>
                    </div>
                    <p className="text-sm text-slate-400 italic">
                        "{q.answer.content}"
                    </p>
                    <div className="mt-2 text-[10px] text-slate-500 text-right">
                        — Answered by {q.answer.admin?.name}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default QuestionCard;
