import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth, provider, signInWithPopup, signOut, onAuthStateChanged } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Lock, Smartphone, Monitor, Globe, Clock, ShieldCheck, X, LogOut, MessageSquare, List, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AdminDashboard = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState('visitors'); // 'visitors' | 'chats'
    const [logs, setLogs] = useState([]);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [selectedChat, setSelectedChat] = useState(null);

    // 🔒 Authorized Emails
    const ALLOWED_EMAILS = [
        'miqbal.hilmy@gmail.com',
        'shiverion@gmail.com',
        'miqbal.hilmy@ui.ac.id'
    ];

    // Monitor Auth State
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser && ALLOWED_EMAILS.includes(currentUser.email)) {
                setUser(currentUser);
            } else if (currentUser) {
                setError("Access Denied: Email not authorized.");
                signOut(auth);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    // Fetch Data based on active tab
    useEffect(() => {
        if (!user) return;

        setLoading(true);
        let unsubscribe;

        if (activeTab === 'visitors') {
            const q = query(collection(db, "visitor_logs"), orderBy("timestamp", "desc"), limit(50));
            unsubscribe = onSnapshot(q, (snapshot) => {
                setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setLoading(false);
            });
        } else {
            const q = query(collection(db, "agentChats"), orderBy("createdAt", "desc"), limit(50));
            unsubscribe = onSnapshot(q, (snapshot) => {
                setChats(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setLoading(false);
            });
        }

        return () => unsubscribe && unsubscribe();
    }, [user, activeTab]);

    const handleGoogleLogin = async () => {
        try {
            setError('');
            await signInWithPopup(auth, provider);
        } catch (err) {
            setError("Login failed. Try again.");
        }
    };

    const getTime = (timestamp) => {
        if (!timestamp) return 'Just now';
        return new Intl.DateTimeFormat('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        }).format(timestamp.toDate());
    };

    // --- Auth Screen ---
    if (!user) {
        return (
            <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-sm bg-cyber-darker border border-neon-cyan/30 rounded-2xl p-8 shadow-2xl text-center"
                >
                    <div className="flex justify-between absolute top-4 right-4">
                        <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
                    </div>
                    <ShieldCheck className="w-12 h-12 text-neon-green mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
                    <p className="text-gray-400 mb-6 text-sm">Sign in securely to view visitors & chats.</p>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                        <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="G" />
                        Sign in with Google
                    </button>
                    {error && <p className="text-neon-pink text-sm mt-4">{error}</p>}
                </motion.div>
            </div>
        );
    }

    // --- Dashboard ---
    return (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-800 bg-cyber-darker/90 flex justify-between items-center sticky top-0 z-10">
                <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-neon-green" /> Admin Panel
                    </h2>
                    <p className="text-xs text-neon-cyan">{user.email}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => signOut(auth)} className="text-gray-400 hover:text-white"><LogOut className="w-5 h-5" /></button>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-800">
                <button
                    onClick={() => setActiveTab('visitors')}
                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'visitors' ? 'text-neon-cyan bg-neon-cyan/10 border-b-2 border-neon-cyan' : 'text-gray-500 hover:text-white'}`}
                >
                    <Globe className="w-4 h-4" /> Visitors
                </button>
                <button
                    onClick={() => setActiveTab('chats')}
                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'chats' ? 'text-neon-pink bg-neon-pink/10 border-b-2 border-neon-pink' : 'text-gray-500 hover:text-white'}`}
                >
                    <MessageSquare className="w-4 h-4" /> Chats
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-20">
                {loading ? (
                    <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan"></div></div>
                ) : activeTab === 'visitors' ? (
                    // VISITOR LOGS
                    <AnimatePresence>
                        {logs.map(log => (
                            <motion.div key={log.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:border-neon-blue/30">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{log.location?.countryCode ? getFlagEmoji(log.location.countryCode) : '🌍'}</span>
                                        <div>
                                            <p className="text-sm font-bold text-white">{log.location?.city || 'Unknown'}, {log.location?.country}</p>
                                            <p className="text-xs text-neon-cyan/80 font-mono mt-0.5">{log.ip}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {getTime(log.timestamp)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-gray-400 mt-2 pt-2 border-t border-gray-800/50">
                                    <span className="flex items-center gap-1">{log.device?.isMobile ? <Smartphone className="w-3 h-3 text-neon-pink" /> : <Monitor className="w-3 h-3 text-neon-blue" />} {log.device?.platform}</span>
                                    <span className="bg-white/5 px-2 py-0.5 rounded text-[10px] truncate max-w-[120px]">{new URL(log.page?.url || 'https://site.com').pathname}</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                ) : (
                    // CHAT LOGS
                    <AnimatePresence>
                        {chats.map(chat => (
                            <motion.div
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:border-neon-pink/30 cursor-pointer active:scale-98 transition-all"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-neon-pink/10 flex items-center justify-center text-neon-pink font-bold border border-neon-pink/20">
                                            {chat.userMessageCount || 0}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">Conversation</p>
                                            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[150px]">
                                                {chat.messages?.find(m => m.role === 'user')?.text || 'No messages'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-gray-500 block mb-1">{getTime(chat.createdAt)}</span>
                                        <span className="text-xs text-neon-cyan block">{chat.city}, {chat.countryCode}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Chat Detail Modal */}
            <AnimatePresence>
                {selectedChat && (
                    <div className="fixed inset-0 z-[70] bg-black/95 flex flex-col animate-in fade-in duration-200">
                        <div className="px-4 py-3 border-b border-gray-800 flex justify-between items-center bg-gray-900">
                            <div>
                                <h3 className="text-white font-bold flex items-center gap-2">
                                    <User className="w-4 h-4 text-neon-pink" /> Visitor Chat
                                </h3>
                                <p className="text-xs text-gray-500">{getTime(selectedChat.createdAt)} • {selectedChat.city}</p>
                            </div>
                            <button onClick={() => setSelectedChat(null)} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"><X className="w-5 h-5 text-white" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {selectedChat.messages?.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-neon-blue/20 text-white rounded-br-none border border-neon-blue/30' : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
                                        }`}>
                                        <ReactMarkdown className="prose prose-invert text-sm">{msg.text}</ReactMarkdown>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const getFlagEmoji = (code) => {
    if (!code || code === 'XX') return '🌍';
    return String.fromCodePoint(...code.split('').map(c => 127397 + c.charCodeAt()));
};

export default AdminDashboard;
