import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth, provider, signInWithPopup, signOut, onAuthStateChanged } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Lock, Smartphone, Monitor, Globe, Clock, ShieldCheck, X, LogOut, MessageSquare, List, User, ChevronLeft, ChevronRight, ChevronDown, MapPin, Search, Filter, Calendar, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const CalendarPicker = ({ startDate, endDate, onSelect, onClose }) => {
    const [viewDate, setViewDate] = useState(new Date());
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();

    const days = useMemo(() => {
        const totalDays = getDaysInMonth(currentYear, currentMonth);
        const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
        const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);

        const dateArr = [];
        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            dateArr.push({ day: prevMonthDays - i, month: currentMonth - 1, year: currentYear, current: false });
        }
        // Current month days
        for (let i = 1; i <= totalDays; i++) {
            dateArr.push({ day: i, month: currentMonth, year: currentYear, current: true });
        }
        // Next month days
        const remaining = 42 - dateArr.length;
        for (let i = 1; i <= remaining; i++) {
            dateArr.push({ day: i, month: currentMonth + 1, year: currentYear, current: false });
        }
        return dateArr;
    }, [currentYear, currentMonth]);

    const handleDateClick = (d) => {
        const clicked = new Date(d.year, d.month, d.day);
        if (!startDate || (startDate && endDate)) {
            onSelect(clicked, null);
        } else if (clicked >= startDate) {
            onSelect(startDate, clicked);
        } else {
            onSelect(clicked, null);
        }
    };

    const isSelected = (d) => {
        const current = new Date(d.year, d.month, d.day);
        return (startDate && current.toDateString() === startDate.toDateString()) ||
            (endDate && current.toDateString() === endDate.toDateString());
    };

    const isInRange = (d) => {
        if (!startDate || !endDate) return false;
        const current = new Date(d.year, d.month, d.day);
        return current > startDate && current < endDate;
    };

    const changeMonth = (offset) => {
        setViewDate(new Date(currentYear, currentMonth + offset, 1));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 z-[100] bg-cyber-darker border border-gray-800 rounded-2xl p-4 shadow-2xl w-[300px]"
        >
            <div className="flex justify-between items-center mb-4 px-1">
                <h4 className="text-white font-bold text-sm">
                    {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(viewDate)}
                </h4>
                <div className="flex gap-1">
                    <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                    <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 transition-colors"><ChevronRight className="w-4 h-4" /></button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
                {daysOfWeek.map(d => (
                    <div key={d} className="text-center text-[10px] text-gray-600 font-bold py-1 uppercase">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {days.map((d, i) => {
                    const selected = isSelected(d);
                    const inRange = isInRange(d);
                    return (
                        <button
                            key={i}
                            onClick={() => handleDateClick(d)}
                            className={`
                                aspect-square rounded-lg text-xs transition-all relative flex items-center justify-center
                                ${d.current ? 'text-gray-300' : 'text-gray-600'}
                                ${selected ? 'bg-neon-cyan text-black font-bold shadow-[0_0_15px_rgba(0,255,255,0.3)]' : 'hover:bg-white/5'}
                                ${inRange ? 'bg-neon-cyan/10 text-neon-cyan' : ''}
                            `}
                        >
                            {d.day}
                        </button>
                    );
                })}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
                <div className="text-[10px] text-gray-500">
                    {startDate ? (
                        <span>{startDate.toLocaleDateString()} {endDate ? `→ ${endDate.toLocaleDateString()}` : '...'}</span>
                    ) : 'Select range'}
                </div>
                <button onClick={onClose} className="px-3 py-1 bg-neon-cyan/10 text-neon-cyan rounded-lg text-[10px] font-bold hover:bg-neon-cyan/20 transition-all border border-neon-cyan/20">DONE</button>
            </div>
        </motion.div>
    );
};

const AdminDashboard = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState('visitors'); // 'visitors' | 'chats'
    const [logs, setLogs] = useState([]);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [selectedChat, setSelectedChat] = useState(null);

    // UI State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDevice, setFilterDevice] = useState('all'); // 'all' | 'mobile' | 'desktop'
    const [filterTime, setFilterTime] = useState('all'); // 'all' | 'today' | '24h' | 'custom'
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [filterCity, setFilterCity] = useState('all');
    const [expandedIps, setExpandedIps] = useState(new Set());
    const [showCalendar, setShowCalendar] = useState(false);

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

    // Fetch Data
    useEffect(() => {
        if (!user) return;

        setLoading(true);
        let unsubscribe;

        if (activeTab === 'visitors') {
            const q = query(collection(db, "visitor_logs"), orderBy("timestamp", "desc"), limit(200));
            unsubscribe = onSnapshot(q, (snapshot) => {
                setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setLoading(false);
            });
        } else {
            const q = query(collection(db, "agentChats"), orderBy("createdAt", "desc"), limit(100));
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
        }).format(typeof timestamp.toDate === 'function' ? timestamp.toDate() : new Date(timestamp));
    };

    // Derived Data for Filters
    const availableCities = useMemo(() => {
        const data = activeTab === 'visitors' ? logs : chats;
        const cities = new Set();
        data.forEach(item => {
            const city = item.location?.city || item.city;
            if (city) cities.add(city);
        });
        return Array.from(cities).sort();
    }, [logs, chats, activeTab]);

    const groupData = (data) => {
        const grouped = {};
        data.forEach(item => {
            const getField = (f) => item.location?.[f] || item[f];
            const country = getField('country') || 'Unknown Country';
            const city = getField('city') || 'Unknown City';
            const ip = item.ip || 'Unknown IP';
            const code = getField('countryCode') || 'XX';

            if (!grouped[country]) grouped[country] = { code, cities: {} };
            if (!grouped[country].cities[city]) grouped[country].cities[city] = { ips: {} };
            if (!grouped[country].cities[city].ips[ip]) grouped[country].cities[city].ips[ip] = [];

            grouped[country].cities[city].ips[ip].push(item);
        });
        return grouped;
    };

    const getIsMobile = (item) => {
        if (item.device?.isMobile !== undefined) return item.device.isMobile;
        const ua = (item.device?.userAgent || item.userAgent || '').toLowerCase();
        return /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
    };

    const getPlatform = (item) => {
        return item.device?.platform || item.platform || 'unknown';
    };

    const getFilteredData = (data) => {
        let filtered = data;

        // 1. Search Filter
        if (searchTerm) {
            const low = searchTerm.toLowerCase();
            filtered = filtered.filter(item => {
                const getField = (f) => item.location?.[f] || item[f] || '';
                const country = getField('country').toLowerCase();
                const city = getField('city').toLowerCase();
                const ip = (item.ip || '').toLowerCase();
                const txt = activeTab === 'chats'
                    ? (item.messages?.map(m => m.text).join(' ') || '').toLowerCase()
                    : (item.page?.url || '').toLowerCase();
                return country.includes(low) || city.includes(low) || ip.includes(low) || txt.includes(low);
            });
        }

        // 2. Device Filter
        if (filterDevice !== 'all') {
            filtered = filtered.filter(item => {
                const isMobile = getIsMobile(item);
                return filterDevice === 'mobile' ? isMobile : !isMobile;
            });
        }

        // 3. Time Filter
        if (filterTime !== 'all') {
            const now = new Date();
            filtered = filtered.filter(item => {
                const ts = item.timestamp?.toDate() || item.createdAt?.toDate() || new Date(item.timestamp || item.createdAt || 0);

                if (filterTime === 'custom') {
                    if (!startDate && !endDate) return true;
                    // Clone dates to avoid mutation and set time
                    const start = startDate ? new Date(startDate) : new Date(0);
                    start.setHours(0, 0, 0, 0);
                    const end = endDate ? new Date(endDate) : new Date();
                    end.setHours(23, 59, 59, 999);
                    return ts >= start && ts <= end;
                }

                const diffMs = now - ts;
                if (filterTime === 'today') {
                    return ts.toDateString() === now.toDateString();
                }
                if (filterTime === '24h') {
                    return diffMs <= 24 * 60 * 60 * 1000;
                }
                return true;
            });
        }

        // 4. City Filter
        if (filterCity !== 'all') {
            filtered = filtered.filter(item => {
                const city = item.location?.city || item.city;
                return city === filterCity;
            });
        }

        return filtered;
    };

    const filteredLogs = getFilteredData(activeTab === 'visitors' ? logs : chats);
    const groupedLogs = groupData(filteredLogs);

    // Recursive component for rendering groups
    const GroupedView = ({ data }) => {
        const sortedCountries = Object.entries(data).sort(([, a], [, b]) => {
            const countA = Object.values(a.cities).reduce((acc, c) => acc + Object.values(c.ips).reduce((s, i) => s + i.length, 0), 0);
            const countB = Object.values(b.cities).reduce((acc, c) => acc + Object.values(c.ips).reduce((s, i) => s + i.length, 0), 0);
            return countB - countA;
        });

        return (
            <div className="space-y-4">
                {sortedCountries.length === 0 && (
                    <div className="text-center text-gray-500 py-10 flex flex-col items-center gap-4">
                        <Search className="w-12 h-12 opacity-20" />
                        <p>No matches found with current filters.</p>
                        <button onClick={() => { setSearchTerm(''); setFilterDevice('all'); setFilterTime('all'); setFilterCity('all'); setStartDate(null); setEndDate(null); }} className="text-neon-cyan text-sm underline">Clear all filters</button>
                    </div>
                )}
                {sortedCountries.map(([country, countryData]) => {
                    const totalCount = Object.values(countryData.cities).reduce((acc, c) => acc + Object.values(c.ips).reduce((s, i) => s + i.length, 0), 0);
                    return (
                        <div key={country} className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900/30">
                            <div className="bg-gray-800/50 px-4 py-3 flex items-center justify-between font-bold text-white">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{getFlagEmoji(countryData.code)}</span>
                                    <span>{country}</span>
                                </div>
                                <span className="text-xs bg-neon-cyan/10 text-neon-cyan px-2 py-1 rounded-full">{totalCount} items</span>
                            </div>

                            <div className="p-2 space-y-2">
                                {Object.entries(countryData.cities).map(([city, cityData]) => (
                                    <div key={city} className="ml-2 pl-2 border-l-2 border-neon-cyan/20">
                                        <div className="text-sm font-semibold text-neon-cyan mb-2 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> {city}
                                        </div>

                                        <div className="space-y-2">
                                            {Object.entries(cityData.ips).sort(([, a], [, b]) => b.length - a.length).map(([ip, items]) => {
                                                const ipKey = `${country}-${city}-${ip}`;
                                                const isExpanded = expandedIps.has(ipKey);

                                                return (
                                                    <div key={ip} className="ml-2 bg-black/40 rounded-lg overflow-hidden border border-gray-800">
                                                        <div
                                                            onClick={() => toggleIpExpansion(ipKey)}
                                                            className="text-xs font-mono text-gray-500 flex justify-between items-center bg-gray-900/50 p-2.5 cursor-pointer hover:bg-gray-800/50 transition-colors"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {isExpanded ? <ChevronDown className="w-3 h-3 text-neon-cyan" /> : <ChevronRight className="w-3 h-3 text-gray-600" />}
                                                                <span className={isExpanded ? 'text-neon-cyan' : ''}>{ip}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="bg-neon-blue/10 text-neon-blue px-1.5 rounded">{items.length} sessions</span>
                                                            </div>
                                                        </div>

                                                        <AnimatePresence>
                                                            {isExpanded && (
                                                                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                                                    <div className="p-3 space-y-2 border-t border-gray-800/50">
                                                                        {items.map(item => (
                                                                            <div key={item.id} onClick={() => activeTab === 'chats' && setSelectedChat(item)} className={`flex justify-between items-start text-sm ${activeTab === 'chats' ? 'cursor-pointer hover:bg-white/5 p-2 rounded transition-colors' : ''}`}>
                                                                                <div className="flex-1">
                                                                                    <div className="flex flex-col gap-0.5">
                                                                                        <div className="flex items-center gap-2 text-white/90">
                                                                                            {getIsMobile(item) ? <Smartphone className="w-3 h-3 text-neon-pink" /> : <Monitor className="w-3 h-3 text-neon-blue" />}
                                                                                            <span className="font-medium truncate max-w-[200px]">
                                                                                                {activeTab === 'visitors' ? new URL(item.page?.url || 'https://site.com').pathname : (item.messages?.find(m => m.role === 'user')?.text || 'No message')}
                                                                                            </span>
                                                                                        </div>
                                                                                        <span className="text-[10px] text-gray-500">{getPlatform(item)}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2">
                                                                                    {getTime(item.timestamp || item.createdAt)}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
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

    if (!user) {
        return (
            <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm bg-cyber-darker border border-neon-cyan/30 rounded-2xl p-8 shadow-2xl text-center relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
                    <ShieldCheck className="w-12 h-12 text-neon-green mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
                    <p className="text-gray-400 mb-6 text-sm">Sign in securely to view visitors & chats.</p>
                    <button onClick={handleGoogleLogin} className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2" >
                        <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="G" /> Sign in with Google
                    </button>
                    {error && <p className="text-neon-pink text-sm mt-4">{error}</p>}
                </motion.div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex flex-col">
            <div className="px-4 py-3 border-b border-gray-800 bg-cyber-darker/90 flex justify-between items-center sticky top-0 z-20">
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

            <div className="px-4 py-3 bg-cyber-darker/90 border-b border-gray-800 sticky top-[57px] z-10 space-y-4 shadow-xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search anything..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-neon-cyan transition-colors" />
                </div>

                <div className="flex flex-col gap-3">
                    {/* Device & Time Filters */}
                    <div className="flex gap-2 items-center flex-wrap">
                        <div className="flex gap-1 bg-black/40 p-1 rounded-lg border border-gray-800">
                            {['all', 'mobile', 'desktop'].map(d => (
                                <button key={d} onClick={() => setFilterDevice(d)} className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${filterDevice === d ? 'bg-neon-cyan text-black' : 'text-gray-500 hover:text-gray-300'}`}>
                                    {d === 'all' ? <Globe className="w-3 h-3" /> : d === 'mobile' ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-1 bg-black/40 p-1 rounded-lg border border-gray-800">
                            {['all', 'today', '24h', 'custom'].map(t => (
                                <button key={t} onClick={() => setFilterTime(t)} className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${filterTime === t ? 'bg-neon-blue text-white shadow-[0_0_10px_rgba(0,100,255,0.3)]' : 'text-gray-500 hover:text-gray-300'}`}>
                                    {t === 'all' ? <Calendar className="w-3 h-3" /> : t}
                                </button>
                            ))}
                        </div>

                        {/* Custom Date Range Trigger */}
                        {filterTime === 'custom' && (
                            <div className="relative ml-auto sm:ml-0">
                                <button
                                    onClick={() => setShowCalendar(!showCalendar)}
                                    className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-gray-800 hover:border-neon-cyan transition-all text-[10px] font-bold text-white whitespace-nowrap"
                                >
                                    <Calendar className="w-3 h-3 text-neon-cyan" />
                                    {startDate ? (
                                        <span>{startDate.toLocaleDateString()} {endDate ? `→ ${endDate.toLocaleDateString()}` : '...'}</span>
                                    ) : 'Pick Dates'}
                                    <ChevronDown className={`w-3 h-3 transition-transform ${showCalendar ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {showCalendar && (
                                        <CalendarPicker
                                            startDate={startDate}
                                            endDate={endDate}
                                            onSelect={(start, end) => { setStartDate(start); setEndDate(end); }}
                                            onClose={() => setShowCalendar(false)}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* City Filter Chips */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                        <span className="text-[10px] text-gray-600 font-bold shrink-0">REGIONS:</span>
                        <button onClick={() => setFilterCity('all')} className={`px-3 py-1 rounded-full text-[10px] font-bold shrink-0 transition-all ${filterCity === 'all' ? 'bg-white text-black' : 'bg-gray-800/50 text-gray-500 border border-gray-800'}`}>ALL</button>
                        {availableCities.map(city => (
                            <button key={city} onClick={() => setFilterCity(city)} className={`px-3 py-1 rounded-full text-[10px] font-bold shrink-0 transition-all ${filterCity === city ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan' : 'bg-black/40 text-gray-500 border border-gray-800'}`}>{city}</button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex border-b border-gray-800">
                {['visitors', 'chats'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === tab ? (tab === 'visitors' ? 'text-neon-cyan bg-neon-cyan/10 border-b-2 border-neon-cyan' : 'text-neon-pink bg-neon-pink/10 border-b-2 border-neon-pink') : 'text-gray-500 hover:text-white'}`}>
                        {tab === 'visitors' ? <Globe className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />} {tab.charAt(0).toUpperCase() + tab.slice(1)} ({tab === 'visitors' ? logs.length : chats.length})
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 pb-20">
                {loading ? <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan"></div></div> : <GroupedView data={groupedLogs} />}
            </div>

            <AnimatePresence>
                {selectedChat && (
                    <div className="fixed inset-0 z-[70] bg-black/95 flex flex-col animate-in fade-in duration-200">
                        <div className="px-4 py-3 border-b border-gray-800 flex justify-between items-center bg-gray-900">
                            <div><h3 className="text-white font-bold flex items-center gap-2"><User className="w-4 h-4 text-neon-pink" /> Visitor Chat</h3><p className="text-xs text-gray-500">{getTime(selectedChat.createdAt)} • {selectedChat.city}</p></div>
                            <button onClick={() => setSelectedChat(null)} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"><X className="w-5 h-5 text-white" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {selectedChat.messages?.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-neon-blue/20 text-white rounded-br-none border border-neon-blue/30' : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'}`}><ReactMarkdown className="prose prose-invert text-sm">{msg.text}</ReactMarkdown></div></div>
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
