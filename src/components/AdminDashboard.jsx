import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Lock, MapPin, Smartphone, Monitor, Globe, Clock, ShieldCheck, X } from 'lucide-react';

const AdminDashboard = ({ onClose }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pin, setPin] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState('');

    // Simple client-side PIN for MVP (In production, use real Auth)
    const ADMIN_PIN = "2026";

    useEffect(() => {
        if (isAuthenticated) {
            const q = query(
                collection(db, "visitor_logs"),
                orderBy("timestamp", "desc"),
                limit(50)
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const visitorData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setLogs(visitorData);
                setLoading(false);
            });

            return () => unsubscribe();
        }
    }, [isAuthenticated]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (pin === ADMIN_PIN) {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Invalid PIN');
            setPin('');
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return 'Just now';
        // Firestore timestamp to JS Date
        const date = timestamp.toDate();
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            day: 'numeric',
            month: 'short',
            year: 'numeric' // Added year for clarity
        }).format(date);
    };

    const getDeviceIcon = (device) => {
        if (device?.isMobile) return <Smartphone className="w-4 h-4 text-neon-pink" />;
        return <Monitor className="w-4 h-4 text-neon-blue" />;
    };

    if (!isAuthenticated) {
        return (
            <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-sm bg-cyber-darker border border-neon-cyan/30 rounded-2xl p-6 shadow-2xl shadow-neon-blue/20"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-neon-green" /> Admin Access
                        </h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                placeholder="Enter PIN"
                                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-center text-white text-lg tracking-widest focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none transition-all"
                                autoFocus
                            />
                        </div>
                        {error && <p className="text-neon-pink text-sm text-center">{error}</p>}
                        <button
                            type="submit"
                            className="w-full py-3 bg-neon-blue text-white font-bold rounded-xl hover:bg-neon-blue/90 transition-all shadow-lg shadow-neon-blue/20"
                        >
                            Unlock Dashboard
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-4 py-4 border-b border-gray-800 bg-cyber-darker/90 flex justify-between items-center sticky top-0 z-10">
                <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Globe className="w-5 h-5 text-neon-cyan" /> Visitor Logs
                    </h2>
                    <p className="text-xs text-gray-400">Live Traffic Monitor • {logs.length} Recent</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 bg-gray-800/50 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Logs List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-20">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan"></div>
                    </div>
                ) : (
                    <AnimatePresence>
                        {logs.map((log) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:border-neon-blue/30 transition-all"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{log.location?.countryCode ? getFlagEmoji(log.location.countryCode) : '🌍'}</span>
                                        <div>
                                            <p className="text-sm font-bold text-white leading-tight">
                                                {log.location?.city || 'Unknown City'}, {log.location?.country || 'Unknown'}
                                            </p>
                                            <p className="text-xs text-neon-cyan font-mono mt-0.5">{log.ip}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {formatTime(log.timestamp)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800/50">
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        {getDeviceIcon(log.device)}
                                        <span className="truncate max-w-[150px]">{log.device?.platform}</span>
                                    </div>
                                    <div className="px-2 py-1 bg-neon-blue/10 rounded text-[10px] text-neon-blue truncate max-w-[120px]">
                                        {new URL(log.page?.url).pathname}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

// Helper: Convert country code to flag emoji
const getFlagEmoji = (countryCode) => {
    if (!countryCode || countryCode === 'XX') return '🌍';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
};

export default AdminDashboard;
