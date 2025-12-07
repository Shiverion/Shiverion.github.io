import { GoogleGenerativeAI } from '@google/generative-ai';

// This is the serverless function that Vercel will run
export default async function handler(request, response) {
  // 1. Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Ensure JSON body - now accepts history for conversation memory
  const { message, systemInstruction, history } = request.body || {};

  if (!message || !systemInstruction) {
    return response.status(400).json({ error: 'Message and systemInstruction are required.' });
  }

  try {
    // 3. Get your SECRET API key from Vercel's environment variables
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return response.status(500).json({ error: 'Server is not configured with GEMINI_API_KEY.' });
    }

    // 4. Initialize Gemini on the SERVER, using your secret key
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction,
    });

    // 5. Build conversation history for multi-turn context
    // Convert our format {role: 'user'|'agent', text} to Gemini format {role: 'user'|'model', parts}
    const chatHistory = (history || [])
      .filter(msg => msg.role === 'user' || msg.role === 'agent')
      .map(msg => ({
        role: msg.role === 'agent' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

    // Start chat with history for context memory
    const chat = model.startChat({
      history: chatHistory
    });

    const result = await chat.sendMessage(message);
    const text = result.response?.text?.();

    if (!text) {
      return response.status(502).json({ error: 'Empty response from AI provider.' });
    }

    // 6. Send the AI's response back to the frontend
    return response.status(200).json({ text });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return response.status(502).json({ error: `Failed to communicate with the AI agent. (Details: ${error.message})` });
  }
}
