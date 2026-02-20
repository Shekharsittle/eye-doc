
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Info } from 'lucide-react';
import { Message, Role } from '../types';
import MessageItem from './MessageItem';

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50">
      {/* Messages List */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-6"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 animate-bounce-slow">
              <Sparkles size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Dr. Mrityunjay Singh AI</h2>
              <p className="text-slate-500">
                I am an Ophthalmologist and Safdarjung Hospital alumni. 
                I specialize in eye care, vision problems, and ocular health.
                How can I help your eyes today?
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {[
                "My eyes are red and itchy",
                "Symptoms of cataracts",
                "Treatment for dry eyes",
                "Is LASIK safe for me?"
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => onSendMessage(suggestion)}
                  className="p-3 text-sm text-left bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-slate-600"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageItem key={msg.id} message={msg} />
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-white border-t border-slate-200">
        <form 
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto relative flex items-end gap-2"
        >
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Describe your eye symptoms or ask a vision question..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none min-h-[56px] max-h-32 custom-scrollbar"
              rows={1}
            />
            <div className="absolute right-3 bottom-3 text-[10px] text-slate-400 font-medium">
              Press Enter to send
            </div>
          </div>
          <button
            type="submit"
            disabled={!input.trim()}
            className={`
              p-3.5 rounded-xl transition-all shrink-0
              ${input.trim() 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
            `}
          >
            <Send size={20} />
          </button>
        </form>
        <div className="max-w-4xl mx-auto mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <Info size={12} />
          <span>Dr. Singh AI can make mistakes. Always consult a doctor for eye emergencies.</span>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
