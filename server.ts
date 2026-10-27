import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // API endpoints
  app.post('/api/fighter/generate', async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Create an epic arcade fighting game character based on this description/theme: "${prompt}".`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: 'Fighter name' },
              title: { type: Type.STRING, description: 'Fighter title or epithet' },
              element: { type: Type.STRING, description: 'Combat element (e.g., Fire, Lightning, Shadow, Iron)' },
              health: { type: Type.INTEGER, description: 'Base health value between 800 and 1200' },
              attackPower: { type: Type.INTEGER, description: 'Attack power rating between 50 and 100' },
              speed: { type: Type.INTEGER, description: 'Speed rating between 50 and 100' },
              specialMoveName: { type: Type.STRING, description: 'Name of their signature special move' },
              specialMoveDesc: { type: Type.STRING, description: 'Short description of the special move' },
              bio: { type: Type.STRING, description: 'Brief warrior biography' },
            },
            required: ['name', 'title', 'element', 'health', 'attackPower', 'speed', 'specialMoveName', 'specialMoveDesc', 'bio'],
          },
        },
      });

      const fighterData = JSON.parse(response.text || '{}');
      res.json(fighterData);
    } catch (error: any) {
      console.error('Error generating fighter:', error);
      res.status(500).json({ error: error.message || 'Failed to generate fighter' });
    }
  });

  app.post('/api/fighter/commentary', async (req, res) => {
    try {
      const { eventType, fighter1, fighter2, p1Hp, p2Hp } = req.body;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are an iconic arcade fighting game announcer (like Street Fighter or Tekken). 
        Event: ${eventType}. 
        Fighter 1: ${fighter1} (HP: ${p1Hp}%)
        Fighter 2: ${fighter2} (HP: ${p2Hp}%)
        Provide a short, punchy, high-energy announcer shout (max 12 words) in ALL CAPS.`,
      });

      res.json({ commentary: response.text?.trim() || 'FIGHT!' });
    } catch (error: any) {
      console.error('Error generating commentary:', error);
      res.json({ commentary: 'LET\'S GO!' });
    }
  });

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
