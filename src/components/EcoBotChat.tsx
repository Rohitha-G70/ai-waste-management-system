import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Trash2,
  X,
  User,
  Info,
  CornerDownLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api';
import { ChatMessage } from '../types';

interface EcoBotChatProps {
  isOpenAsModal?: boolean;
  onClose?: () => void;
  hasAiKey: boolean;
}

export const EcoBotChat: React.FC<EcoBotChatProps> = ({
  isOpenAsModal = false,
  onClose,
  hasAiKey,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      content: `Hello! I am **EcoBot** ♻️, your smart AI Recycling & Waste Management Assistant.\n\nAsk me how to classify, clean, or dispose of any household item, unpack municipal segregation rules, or learn about environmental impacts.`,
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(!hasAiKey);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'How should I dispose of a plastic bottle?',
    'Can I recycle greasy pizza boxes?',
    'How do I safely discard lithium-ion batteries?',
    'What goes in the Green Organic Bin?',
    'Where should old smartphones and electronics go?',
    'What items are classified as hazardous waste?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const response = await api.chatEcoBot(text, history);

      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDemo: response.isDemoMode,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsDemoMode(response.isDemoMode);
      setDemoNotice(response.demoNotice || null);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: 'Sorry, I encountered an error connecting to the AI backend. Please try again.',
          timestamp: 'Now',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const clearChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setMessages([
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: `Chat history cleared. What waste material would you like to check next?`,
        timestamp: 'Just now',
      },
    ]);
  };

  // Simple Markdown renderer for bolding, bullet points, and numbered lists
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;

          // Bold processing
          const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <li
                key={idx}
                className="ml-3 list-disc"
                dangerouslySetInnerHTML={{ __html: formatted.substring(2) }}
              />
            );
          }

          if (/^\d+\.\s/.test(line)) {
            return (
              <div
                key={idx}
                className="pl-2 font-medium"
                dangerouslySetInnerHTML={{ __html: formatted }}
              />
            );
          }

          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: formatted }} />
          );
        })}
      </div>
    );
  };

  const content = (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-800 via-emerald-800 to-emerald-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-base font-bold text-white">EcoBot AI</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-emerald-200">
              Intelligent Recycling Assistant
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 transition-colors cursor-pointer text-xs flex items-center gap-1"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {isOpenAsModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Demo Notice Banner */}
      {isDemoMode && (
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 text-amber-900 text-[11px] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>
              <strong>Demo Mode:</strong> Predefined verified waste guidelines. Connect <code className="font-mono font-semibold">GEMINI_API_KEY</code> for open-domain Gemini reasoning.
            </span>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isBot = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              {isBot && (
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-2xs ${
                  isBot
                    ? 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-sm'
                    : 'bg-emerald-700 text-white rounded-tr-sm'
                }`}
              >
                {renderFormattedContent(msg.content)}

                <div
                  className={`mt-2 flex items-center justify-between text-[10px] ${
                    isBot ? 'text-slate-400' : 'text-emerald-200'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {isBot && (
                    <button
                      onClick={() => handleSpeak(msg.content)}
                      className="hover:text-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
                      title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                    >
                      {isSpeaking ? <VolumeX className="w-3 h-3 text-rose-500" /> : <Volume2 className="w-3 h-3" />}
                      <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
                    </button>
                  )}
                </div>
              </div>

              {!isBot && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <span>EcoBot is formulating recycling guidance...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Pills */}
      <div className="p-3 bg-white border-t border-slate-100 overflow-x-auto">
        <div className="flex items-center gap-2 text-xs whitespace-nowrap">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 text-[11px] font-medium transition-colors border border-slate-200/80 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask EcoBot anything (e.g. How do I dispose of a fluorescent bulb?)..."
            className="flex-1 p-3 rounded-2xl border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-emerald-500 bg-slate-50/50"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="p-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold disabled:opacity-40 transition-colors shadow-sm cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );

  if (isOpenAsModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
        <div className="w-full max-w-2xl h-[85vh] max-h-[700px]">
          {content}
        </div>
      </div>
    );
  }

  return <div className="h-[700px] max-w-4xl mx-auto pb-16">{content}</div>;
};
