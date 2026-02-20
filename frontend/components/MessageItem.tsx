
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Eye, User, Copy, Check } from 'lucide-react';
import { Message, Role } from '../types';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isModel = message.role === Role.MODEL;
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-4 ${isModel ? 'max-w-4xl' : 'max-w-4xl ml-auto flex-row-reverse'}`}>
      <div className={`
        w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm
        ${isModel ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}
      `}>
        {isModel ? <Eye size={20} /> : <User size={20} />}
      </div>

      <div className={`flex flex-col gap-1 ${isModel ? 'items-start' : 'items-end'}`}>
        <div className={`
          px-5 py-4 rounded-3xl text-sm leading-relaxed shadow-sm
          ${isModel 
            ? 'bg-white border border-slate-100 text-slate-800 rounded-tl-none' 
            : 'bg-blue-600 text-white rounded-tr-none'}
        `}>
          {isModel ? (
            <div className="prose prose-slate prose-sm max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:mb-4 prose-li:mb-1">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
        </div>
        
        <div className="flex items-center gap-3 mt-1 px-1">
          <span className="text-[10px] text-slate-400 font-medium">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isModel && message.content && (
            <button 
              onClick={handleCopy}
              className="text-slate-400 hover:text-blue-500 transition-colors"
              title="Copy response"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
