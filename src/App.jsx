import React, { useState } from 'react';
import OpenAI from "openai";

console.log('VITE_OPENAI_ORGANIZATION:', import.meta.env.VITE_OPENAI_ORGANIZATION);
console.log('VITE_OPENAI_API_KEY:', import.meta.env.VITE_OPENAI_API_KEY);

const openai = new OpenAI({
  organization: import.meta.env.VITE_OPENAI_ORGANIZATION,
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

function App() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const chat = async (userInput) => {
    setIsTyping(true);

    try {
      const getResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful mean assistant to a user named JoJo.  you would be considered a mean gurl and you serve attitude with every response. but you do give the response that is needed after the snarkyness',
          },
          {
            role: 'user',
            content: userInput,
          },
        ],
      });

      const completionText = getResponse.choices[0].message.content;

      setChats(prevChats => [
        ...prevChats,
        { role: 'user', content: userInput },
        { role: 'assistant', content: completionText }
      ]);

    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    await chat(message);
    setMessage('');
  };

  return (
    <main>
      <h1>JoJos ChatGPT Assistant</h1>
      
      <section className="chat-container">
      {chats.slice(0).map((chat, index) => (
          <div key={index} className={`message ${chat.role}`}>
            {chat.content}
          </div>
        ))}
      </section>
      <div className={isTyping ? "" : "hide"}>
        <p><i>Typing</i></p>
      </div>
      <div className="form-container">
      <form onSubmit={handleFormSubmit} className="input-container">
        <input
          type="text"
          name="message"
          value={message}
          placeholder="Type a message and click send"
          onChange={e => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
      </div>
    </main>
  );
}

export default App;

