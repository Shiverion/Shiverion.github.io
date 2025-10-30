import { GoogleGenerativeAI } from '@google/generative-ai';

// This is the serverless function that Vercel will run
export default async function handler(request, response) {
  // 1. Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Get the user's message from the request body
  const { message, systemInstruction } = request.body;

  if (!message || !systemInstruction) {
    return response.status(400).json({ error: 'Message and systemInstruction are required.' });
  }

  try {
    // 3. Get your SECRET API key from Vercel's environment variables
    //    We will set this up in the Vercel dashboard later.
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("API key is not configured on the server.");
    }

    // 4. Initialize Gemini on the SERVER, using your secret key
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-09-2025",
      systemInstruction: systemInstruction,
    });

    const chat = model.startChat();
    const result = await chat.sendMessage(message);
    const text = result.response.text();

    // 5. Send the AI's response back to the frontend
    return response.status(200).json({ text: text });

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return response.status(500).json({ error: 'Failed to communicate with the AI agent.' });
  }
}
