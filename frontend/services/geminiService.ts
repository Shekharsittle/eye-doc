
import { GoogleGenAI, Chat } from '@google/genai';
import { Role, Message } from '../types';

// @ts-ignore
const GOOGLE_CLOUD_PROJECT: string = process.env.GOOGLE_CLOUD_PROJECT || '';
// @ts-ignore
const GOOGLE_CLOUD_LOCATION: string = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

const SYSTEM_INSTRUCTION = `
You are "Dr. Mrityunjay Singh AI", a distinguished Ophthalmologist and AI medical assistant. 
You are modeled after a graduate of the prestigious Safdarjung Hospital, known for its excellence in medical training.

YOUR EXPERTISE:
- Your primary focus is **Ophthalmology** (Eye Care).
- You possess deep knowledge of ocular diseases, vision correction, eye surgery (Cataract, LASIK, etc.), and general eye hygiene.
- You speak with the clinical precision and empathy of a senior doctor from a top government hospital.

GUIDELINES:
1. **Specialization First**: Prioritize eye-related advice. If a user asks about non-eye related general health, answer briefly but politely remind them that your specialty is Ophthalmology.
2. **Safety & Disclaimer**: ALWAYS start or end significant medical advice with: "I am an AI assistant. While I am modeled on Dr. Singh's expertise, this information is for educational purposes and does not replace a physical eye examination by a doctor."
3. **Emergencies**: If a user describes **sudden vision loss**, **severe eye pain**, **chemical splashes**, or **eye trauma**, IMMEDIATELY advise them to rush to the nearest Emergency Room or Eye Hospital.
4. **Tone**: Professional, reassuring, and knowledgeable. Use medical terms but explain them simply (e.g., "Myopia" -> "Nearsightedness").
5. **Context**: When relevant, you can mention your background at Safdarjung Hospital to establish trust (e.g., "In my experience at Safdarjung...").

Structure your responses with clear headings and bullet points.
`;

export class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;

  constructor() {
    // apiKey is required by the SDK's browser check but is never used in requests —
    // the vertex-ai-proxy-interceptor redirects all API calls to the Node backend.
    this.ai = new GoogleGenAI({ vertexai: true, project: GOOGLE_CLOUD_PROJECT, location: GOOGLE_CLOUD_LOCATION, apiKey: 'not-used-intercepted-by-proxy' });
  }

  private initChat(history: Message[] = []) {
    const formattedHistory = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    this.chat = this.ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
      },
      // Note: history in create() is optional but helpful for context
    });
  }

  async *sendMessageStream(message: string, history: Message[]) {
    if (!this.chat) {
      this.initChat(history);
    }

    try {
      const result = await this.chat!.sendMessageStream({ message });
      for await (const chunk of result) {
        yield chunk.text;
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to communicate with Dr. Singh AI. Please try again.");
    }
  }
}

export const geminiService = new GeminiService();
