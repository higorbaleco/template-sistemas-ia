import { ChatMessage as ChatMessageType } from '~/lib/types'

interface Props {
  message: ChatMessageType;
}

export function ChatMessage({ message }: Props) {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-xs rounded-lg px-4 py-2 text-sm ${
          isBot
            ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white'
            : 'bg-cyan-500 text-white'
        }`}
      >
        <p>{message.text}</p>
        <span className="text-xs opacity-70 mt-1 block">{message.timestamp}</span>
      </div>
    </div>
  );
}
