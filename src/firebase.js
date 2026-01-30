// Firebase configuration for Portfolio Chat History
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCUDwqDVlt2Hcmrb8r0udYNFeX4vjQ9q0o",
    authDomain: "portfolio-chats-a85d9.firebaseapp.com",
    projectId: "portfolio-chats-a85d9",
    storageBucket: "portfolio-chats-a85d9.firebasestorage.app",
    messagingSenderId: "944642588260",
    appId: "1:944642588260:web:9dfd83676f32ded2d86971",
    measurementId: "G-Q8ST3PJY7H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Auth
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut, onAuthStateChanged };

/**
 * Get visitor's IP and location info
 */
/**
 * Get visitor's IP and location info from our secure backend
 */
const getVisitorInfo = async () => {
    try {
        const response = await fetch('/api/geo');
        const contentType = response.headers.get("content-type");
        if (!response.ok || !contentType || !contentType.includes("application/json")) {
            throw new Error("API not available or not returning JSON");
        }
        const data = await response.json();
        return {
            ip: data.ip || 'unknown',
            city: data.city || 'Unknown City',
            region: data.region || 'Unknown Region',
            country: data.country || 'Unknown Country',
            countryCode: data.countryCode || 'XX',
            latitude: data.latitude || 0,
            longitude: data.longitude || 0,
            timezone: data.timezone || 'UTC'
        };
    } catch (error) {
        console.warn("Visitor info fetch failed (likely local dev), using defaults:", error);
        return {
            ip: '127.0.0.1',
            city: 'Localhost',
            region: 'Dev',
            country: 'Local Development',
            countryCode: 'XX',
            latitude: 0,
            longitude: 0,
            timezone: 'UTC'
        };
    }
};

/**
 * Log a new visitor to Firestore
 * @returns {Promise<void>}
 */
export const logVisitor = async () => {
    try {
        const currentUrl = window.location.href;
        const storageKey = `logged_${currentUrl}`;

        // Prevent duplicate logging for the exact same URL in this session
        if (sessionStorage.getItem(storageKey)) return;

        const info = await getVisitorInfo();

        await addDoc(collection(db, "visitor_logs"), {
            ip: info.ip,
            location: {
                city: info.city,
                region: info.region,
                country: info.country,
                countryCode: info.countryCode,
                latitude: info.latitude,
                longitude: info.longitude,
                timezone: info.timezone
            },
            device: {
                userAgent: navigator.userAgent,
                platform: navigator.platform || 'unknown',
                language: navigator.language || 'unknown',
                screenSize: `${window.screen.width}x${window.screen.height}`,
                isMobile: /Mobi|Android/i.test(navigator.userAgent)
            },
            page: {
                url: currentUrl,
                referrer: document.referrer || 'direct'
            },
            timestamp: serverTimestamp()
        });

        sessionStorage.setItem(storageKey, 'true');
        console.log("Visitor log saved for:", currentUrl);
    } catch (error) {
        console.error("Error logging visitor:", error);
    }
};

/**
 * Save a chat conversation to Firestore
 * @param {Array} messages - Array of message objects {role, text}
 */
export const saveChatToFirebase = async (messages) => {
    try {
        // Only save if there are user messages (not just the initial greeting)
        const userMessages = messages.filter(m => m.role === 'user');
        if (userMessages.length === 0) return;

        // Get visitor info (IP, location)
        const visitorInfo = await getVisitorInfo();

        await addDoc(collection(db, "agentChats"), {
            messages: messages,
            messageCount: messages.length,
            userMessageCount: userMessages.length,
            createdAt: serverTimestamp(),
            // Device info
            userAgent: navigator.userAgent,
            platform: navigator.platform || 'unknown',
            language: navigator.language || 'unknown',
            screenSize: `${window.screen.width}x${window.screen.height}`,
            // Visitor location
            ip: visitorInfo.ip,
            city: visitorInfo.city,
            region: visitorInfo.region,
            country: visitorInfo.country,
            countryCode: visitorInfo.countryCode,
            timezone: visitorInfo.timezone,
            // Source
            referrer: document.referrer || 'direct',
            pageUrl: window.location.href
        });
        console.log("Chat saved to Firebase");
    } catch (error) {
        console.error("Error saving chat to Firebase:", error);
    }
};

export { db };
