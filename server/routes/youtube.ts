// server/routes/chat.ts
import { Request, Response, Router } from 'express';
import { Configuration, OpenAIApi } from 'openai';

const router = Router();

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const response = await openai.createCompletion({
      model: "text-davinci-003", // Or another suitable model
      prompt: message,
      max_tokens: 150,
    });
    res.json({ message: response.data.choices[0].text });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

export default router;


// client/src/components/chat-interface.tsx
import React, { useState } from 'react';

interface ChatInterfaceProps { }

const ChatInterface: React.FC<ChatInterfaceProps> = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput) return;

    setMessages([...messages, userInput]);
    setUserInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();
      setMessages([...messages, userInput, data.message]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      setMessages([...messages, userInput, 'Error: Could not get response from AI']);
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatInterface;


// server/index.ts (Partial example - adapt to your existing server setup)
import express from 'express';
import youtubeRoutes from './routes/youtube';
import chatRoutes from './routes/chat';


const app = express();
const port = 3000;

app.use(express.json());
app.use('/api/youtube', youtubeRoutes);
app.use('/api/chat', chatRoutes);


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// client/src/pages/wellness.tsx (Partial example - adapt to your existing wellness page)
import React from 'react';
import ChatInterface from '../components/chat-interface';

const WellnessPage: React.FC = () => {
  return (
    <div>
      <h1>AI Wellness Coach</h1>
      <ChatInterface />
    </div>
  );
};

export default WellnessPage;


//server/routes/index.ts (example)
import { Router } from 'express';
import youtubeRoutes from './youtube';
import chatRoutes from './chat';

const router = Router();

router.use('/youtube', youtubeRoutes);
router.use('/chat', chatRoutes);

export default router;