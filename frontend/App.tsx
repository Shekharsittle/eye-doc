
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Eye, 
  Send, 
  Plus, 
  History, 
  Settings, 
  ShieldAlert, 
  Menu, 
  X,
  Activity,
  Info
} from 'lucide-react';
import { Role, Message, ChatSession } from './types';
import { geminiService } from './services/geminiService';
import ChatWindow from './components/ChatWindow';
import MedicalDisclaimer from './components/MedicalDisclaimer';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDisclaimerVisible, setIsDisclaimerVisible] = useState(true);

  // Initialize first session if none exists
  useEffect(() => {
    if (sessions.length === 0) {
      const newSession: ChatSession = {
        id: crypto.randomUUID(),
        title: 'New Eye Consultation',
        messages: [],
        lastUpdated: new Date(),
      };
      setSessions([newSession]);
      setCurrentSessionId(newSession.id);
    }
  }, [sessions.length]);

  const currentSession = sessions.find(s => s.id === currentSessionId);

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: 'New Eye Consultation',
      messages: [],
      lastUpdated: new Date(),
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleSendMessage = async (content: string) => {
    if (!currentSessionId || !content.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: Role.USER,
      content,
      timestamp: new Date(),
    };

    // Update session with user message
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        const updatedMessages = [...s.messages, userMessage];
        // Update title if it's the first message
        const title = s.messages.length === 0 ? content.slice(0, 30) + (content.length > 30 ? '...' : '') : s.title;
        return { ...s, messages: updatedMessages, title, lastUpdated: new Date() };
      }
      return s;
    }));

    const assistantMessageId = crypto.randomUUID();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: Role.MODEL,
      content: '',
      timestamp: new Date(),
    };

    // Add empty assistant message for streaming
    setSessions(prev => prev.map(s => 
      s.id === currentSessionId ? { ...s, messages: [...s.messages, assistantMessage] } : s
    ));

    try {
      let fullContent = '';
      const stream = geminiService.sendMessageStream(content, currentSession?.messages || []);
      
      for await (const chunk of stream) {
        fullContent += chunk;
        setSessions(prev => prev.map(s => {
          if (s.id === currentSessionId) {
            return {
              ...s,
              messages: s.messages.map(m => 
                m.id === assistantMessageId ? { ...m, content: fullContent } : m
              )
            };
          }
          return s;
        }));
      }
    } catch (error) {
      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return {
            ...s,
            messages: s.messages.map(m => 
              m.id === assistantMessageId ? { ...m, content: "I'm sorry, I encountered an error. Please check your connection and try again." } : m
            )
          };
        }
        return s;
      }));
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-lg">
            <div className="p-1.5 bg-blue-50 rounded-lg shrink-0">
              <Eye size={24} />
            </div>
            <div className="flex flex-col">
              <span className="truncate leading-tight">Dr. Singh AI</span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Ophthalmologist</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 hover:bg-slate-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl font-medium transition-colors shadow-sm shadow-blue-200"
          >
            <Plus size={18} />
            New Consultation
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Recent Consultations
          </div>
          {sessions.map(session => (
            <button
              key={session.id}
              onClick={() => {
                setCurrentSessionId(session.id);
                if (window.innerWidth < 768) setIsSidebarOpen(false);
              }}
              className={`
                w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 transition-all group
                ${currentSessionId === session.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-600'}
              `}
            >
              <History size={16} className={currentSessionId === session.id ? 'text-blue-500' : 'text-slate-400'} />
              <div className="flex-1 truncate">
                <div className="text-sm font-medium truncate">{session.title}</div>
                <div className="text-[10px] opacity-60">{new Date(session.lastUpdated).toLocaleDateString()}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 space-y-2">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            <Settings size={18} />
            Settings
          </button>
          <button 
            onClick={() => setIsDisclaimerVisible(true)}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <ShieldAlert size={18} />
            Medical Disclaimer
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="font-semibold text-slate-800 truncate max-w-[200px] md:max-w-none">
                {currentSession?.title || 'Eye Consultation'}
              </h1>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-medium uppercase tracking-wider">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                Ophthalmologist Active
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-600">
              <Activity size={14} className="text-blue-500" />
              System Status: Optimal
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
              DS
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {currentSession && (
            <ChatWindow 
              messages={currentSession.messages} 
              onSendMessage={handleSendMessage} 
            />
          )}
        </div>

        {/* Floating Disclaimer Overlay */}
        {isDisclaimerVisible && (
          <MedicalDisclaimer onClose={() => setIsDisclaimerVisible(false)} />
        )}
      </main>
    </div>
  );
};

export default App;
