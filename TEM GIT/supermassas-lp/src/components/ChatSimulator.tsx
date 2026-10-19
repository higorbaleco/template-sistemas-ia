import { useRef, useEffect } from 'react'
import { chatConversation } from '~/lib/chatData'
import { ChatMessage } from './ChatMessage'

export function ChatSimulator() {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col h-96">
      {/* Header */}
      <div className="bg-blue-900 text-white px-4 py-3 flex justify-between items-center">
        <div>
          <h3 className="font-semibold">{chatConversation.agentName}</h3>
          <p className="text-xs opacity-75">IA comercial no WhatsApp</p>
        </div>
        <div className="text-xs font-bold bg-cyan-500 px-2 py-1 rounded">
          {chatConversation.status}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {chatConversation.messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area (fake) */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex gap-2">
        <input
          type="text"
          placeholder="Escreva uma pergunta..."
          disabled
          className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm opacity-50 cursor-default"
        />
        <button className="p-2 opacity-50 cursor-default">📎</button>
        <button className="p-2 opacity-50 cursor-default">🎤</button>
      </div>
    </div>
  );
}
