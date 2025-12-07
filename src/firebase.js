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

/**
 * Save a chat conversation to Firestore
 * @param {Array} messages - Array of message objects {role, text}
 */
export const saveChatToFirebase = async (messages) => {
    try {
        // Only save if there are user messages (not just the initial greeting)
        const userMessages = messages.filter(m => m.role === 'user');
        if (userMessages.length === 0) return;

        await addDoc(collection(db, "agentChats"), {
            messages: messages,
            messageCount: messages.length,
            userMessageCount: userMessages.length,
            createdAt: serverTimestamp(),
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'direct'
        });
        console.log("Chat saved to Firebase");
    } catch (error) {
        console.error("Error saving chat to Firebase:", error);
    }
};

export { db };
