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
    // 4. Initialize Gemini on the SERVER
    const genAI = new GoogleGenerativeAI(apiKey);

    // User requested "gemini 3 flash" - using verified preview ID (Jan 2026)
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      systemInstruction,
    });

    // 5. Build conversation history
    const chatHistory = (history || [])
      .filter(msg => msg.role === 'user' || msg.role === 'agent')
      .map(msg => ({
        role: msg.role === 'agent' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

    const chat = model.startChat({
      history: chatHistory
    });

    const result = await chat.sendMessageStream(message);

    // 6. Stream the response back to client
    response.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    });

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      response.write(chunkText);
    }

    response.end();

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // If headers haven't been sent, send error JSON
    if (!response.headersSent) {
      return response.status(502).json({ error: `Failed to communicate with the AI agent. (Details: ${error.message})` });
    } else {
      // If streaming started, we can't send JSON. End string.
      response.end();
    }
  }
}
