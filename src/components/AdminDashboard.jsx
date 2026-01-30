import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth, provider, signInWithPopup, signOut, onAuthStateChanged } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Lock, Smartphone, Monitor, Globe, Clock, ShieldCheck, X, LogOut, MessageSquare, List, User, ChevronRight, ChevronDown, MapPin, Search } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AdminDashboard = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState('visitors'); // 'visitors' | 'chats'
    const [logs, setLogs] = useState([]);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [selectedChat, setSelectedChat] = useState(null);

    // Search and Expansion State
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedIps, setExpandedIps] = useState(new Set());

    const toggleIpExpansion = (ipKey) => {
        setExpandedIps(prev => {
            const next = new Set(prev);
            if (next.has(ipKey)) next.delete(ipKey);
            else next.add(ipKey);
            return next;
        });
    };

    // 🔒 Authorized Emails
    const ALLOWED_EMAILS = [
        'miqbal.hilmy@gmail.com',
        'shiverion@gmail.com',
        'miqbal.hilmy@ui.ac.id',
        'miqbal.izzulhaq@gmail.com'
    ];

    // Monitor Auth State
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser && ALLOWED_EMAILS.includes(currentUser.email)) {
                setUser(currentUser);
            } else if (currentUser) {
                setError(`Access Denied: ${currentUser.email} is not authorized.`);
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
            const q = query(collection(db, "visitor_logs"), orderBy("timestamp", "desc"), limit(100)); // Increased limit for better grouping
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

    // Helper to group data
    const groupData = (data, type) => {
        const grouped = {};
        data.forEach(item => {
            // Helper to get field from either location object (Visitor) or root (Chat)
            const getField = (field) => item.location?.[field] || item[field];

            const country = getField('country') || 'Unknown Country';
            const city = getField('city') || 'Unknown City';
            const ip = item.ip || 'Unknown IP';
            const countryCode = getField('countryCode') || 'XX';

            if (!grouped[country]) grouped[country] = { code: countryCode, cities: {} };
            if (!grouped[country].cities[city]) grouped[country].cities[city] = { ips: {} };
            if (!grouped[country].cities[city].ips[ip]) grouped[country].cities[city].ips[ip] = [];

            grouped[country].cities[city].ips[ip].push(item);
        });
        return grouped;
    };

    // Filter Logic
    const getFilteredData = (data) => {
        if (!searchTerm) return data;
        const lowerTerm = searchTerm.toLowerCase();
        return data.filter(item => {
            // Helper to get field
            const getField = (field) => item.location?.[field] || item[field] || '';

            const country = (getField('country')).toLowerCase();
            const city = (getField('city')).toLowerCase();
            const ip = (item.ip || '').toLowerCase();
            const text = activeTab === 'chats'
                ? (item.messages?.map(m => m.text).join(' ') || '').toLowerCase()
                : (item.page?.url || '').toLowerCase();

            return country.includes(lowerTerm) ||
                city.includes(lowerTerm) ||
                ip.includes(lowerTerm) ||
                text.includes(lowerTerm);
        });
    };

    const filteredLogs = getFilteredData(activeTab === 'visitors' ? logs : chats);
    const groupedLogs = groupData(filteredLogs, activeTab);

    // Recursive component for rendering groups (Sorted by Count)
    const GroupedView = ({ data }) => {
        // Sort countries by total activity (descending)
        const sortedCountries = Object.entries(data).sort(([, a], [, b]) => {
            const countA = Object.values(a.cities).reduce((acc, city) =>
                acc + Object.values(city.ips).reduce((sum, ip) => sum + ip.length, 0), 0);
            const countB = Object.values(b.cities).reduce((acc, city) =>
                acc + Object.values(city.ips).reduce((sum, ip) => sum + ip.length, 0), 0);
            return countB - countA;
        });

        return (
            <div className="space-y-4">
                {sortedCountries.length === 0 && (
                    <div className="text-center text-gray-500 py-10">No results found matching "{searchTerm}"</div>
                )}
                {sortedCountries.map(([country, countryData]) => {
                    const totalCount = Object.values(countryData.cities).reduce((acc, city) =>
                        acc + Object.values(city.ips).reduce((sum, ip) => sum + ip.length, 0), 0);

                    return (
                        <div key={country} className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900/30">
                            {/* Country Header */}
                            <div className="bg-gray-800/50 px-4 py-3 flex items-center justify-between font-bold text-white">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{getFlagEmoji(countryData.code)}</span>
                                    <span>{country}</span>
                                </div>
                                <span className="text-xs bg-neon-cyan/10 text-neon-cyan px-2 py-1 rounded-full">{totalCount} events</span>
                            </div>

                            <div className="p-2 space-y-2">
                                {Object.entries(countryData.cities).map(([city, cityData]) => (
                                    <div key={city} className="ml-2 pl-2 border-l-2 border-neon-cyan/20">
                                        <div className="text-sm font-semibold text-neon-cyan mb-2 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> {city}
                                        </div>

                                        <div className="space-y-2">
                                            {Object.entries(cityData.ips).map(([ip, items]) => {
                                                const ipKey = `${country}-${city}-${ip}`;
                                                const isExpanded = expandedIps.has(ipKey);

                                                return (
                                                    <div key={ip} className="ml-2 bg-black/40 rounded-lg overflow-hidden border border-gray-800">
                                                        {/* IP Header - Collapsible */}
                                                        <div
                                                            onClick={() => toggleIpExpansion(ipKey)}
                                                            className="text-xs font-mono text-gray-500 flex justify-between items-center bg-gray-900/50 p-2.5 cursor-pointer hover:bg-gray-800/50 transition-colors"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {isExpanded ? <ChevronDown className="w-3 h-3 text-neon-cyan" /> : <ChevronRight className="w-3 h-3 text-gray-600" />}
                                                                <span className={isExpanded ? 'text-neon-cyan' : ''}>IP: {ip}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] text-gray-600 italic">{isExpanded ? 'Click to collapse' : 'Click to expand'}</span>
                                                                <span className="bg-neon-blue/10 text-neon-blue px-1.5 rounded">{items.length} {activeTab === 'visitors' ? 'Visits' : 'Chats'}</span>
                                                            </div>
                                                        </div>

                                                        {isExpanded && (
                                                            <div className="p-3 space-y-2 border-t border-gray-800/50 animate-in slide-in-from-top-1 duration-200">
                                                                {items.map(item => (
                                                                    <div key={item.id} onClick={() => activeTab === 'chats' && setSelectedChat(item)} className={`flex justify-between items-start text-sm ${activeTab === 'chats' ? 'cursor-pointer hover:bg-white/5 p-2 rounded transition-colors' : ''}`}>
                                                                        <div className="flex-1">
                                                                            {activeTab === 'visitors' ? (
                                                                                <div className="flex flex-col gap-0.5">
                                                                                    <div className="flex items-center gap-2 text-white/90">
                                                                                        {item.device?.isMobile ? <Smartphone className="w-3 h-3 text-neon-pink" /> : <Monitor className="w-3 h-3 text-neon-blue" />}
                                                                                        <span className="font-medium truncate max-w-[200px]">{new URL(item.page?.url || 'https://site.com').pathname}</span>
                                                                                    </div>
                                                                                    <span className="text-[10px] text-gray-500">{item.device?.platform}</span>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="flex items-center gap-2">
                                                                                    <MessageSquare className="w-3 h-3 text-neon-green" />
                                                                                    <span className="truncate max-w-[200px] text-gray-300">
                                                                                        {item.messages?.find(m => m.role === 'user')?.text || 'No msg'}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2 flex items-center gap-1">
                                                                            {getTime(item.timestamp || item.createdAt)}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
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

            {/* Search Bar */}
            <div className="px-4 pb-3 pt-3 bg-cyber-darker/90 border-b border-gray-800 sticky top-[57px] z-10">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search IP, City, Country, URL, or Message..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-neon-cyan transition-colors"
                    />
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
            <div className="flex-1 overflow-y-auto p-4 pb-20">
                {loading ? (
                    <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan"></div></div>
                ) : (
                    <GroupedView data={groupedLogs} />
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
