import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, X, Loader2, ThumbsUp, ThumbsDown, StopCircle, Edit2, Check } from 'lucide-react';
import Markdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  feedback?: 'up' | 'down' | null;
}

export default function SafetyBot({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: "Hello, I'm the Abhaya Bot. I'm here to offer advice, safety tips, or just listen if you need someone to talk to. How can I support you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const stopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const handleSend = async (overrideMessage?: string, historySlice?: Message[]) => {
    const textToSend = overrideMessage ?? input.trim();
    if (!textToSend || isLoading) return;

    if (!overrideMessage) {
        setInput('');
    }

    const newMessage: Message = { id: generateId(), role: 'user', content: textToSend };
    
    let currentHistory = historySlice || messages;
    
    if (!overrideMessage) {
        setMessages(prev => [...prev, newMessage]);
        currentHistory = [...currentHistory, newMessage];
    } else {
        setMessages(currentHistory);
    }

    setIsLoading(true);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: textToSend,
          history: currentHistory.slice(0, -1).map(m => ({ role: m.role, content: m.content }))
        }),
        signal: abortControllerRef.current.signal
      });

      const data = await response.json();
      
      if (response.ok && data.text) {
        setMessages(prev => [...prev, { id: generateId(), role: 'assistant', content: data.text }]);
      } else {
        setMessages(prev => [...prev, { id: generateId(), role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now. Please try again later." }]);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        // aborted, we appended it already but we can add a system message if needed, skipping for now
      } else {
        setMessages(prev => [...prev, { id: generateId(), role: 'assistant', content: "I'm sorry, an error occurred. Please try again." }]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleFeedback = (id: string, type: 'up' | 'down') => {
    setMessages(prev => prev.map(m => {
        if (m.id === id) {
            return { ...m, feedback: m.feedback === type ? null : type };
        }
        return m;
    }));
  };

  const startEdit = (msg: Message) => {
    setEditingId(msg.id);
    setEditContent(msg.content);
  };

  const saveEdit = (id: string) => {
    if (!editContent.trim()) return;
    
    const msgIndex = messages.findIndex(m => m.id === id);
    if (msgIndex === -1) return;

    const historySlice = messages.slice(0, msgIndex);
    const editedMessage: Message = { id: generateId(), role: 'user', content: editContent.trim() };
    const newHistory = [...historySlice, editedMessage];
    
    setEditingId(null);
    handleSend(editedMessage.content, newHistory);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4"
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className="bg-slate-50 dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden max-h-[90vh] sm:h-[600px] shadow-2xl"
        >
          {/* Header */}
          <div className="bg-white dark:bg-slate-800 px-5 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700 shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 leading-tight">Abhaya Bot</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">AI Companion</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-50 dark:bg-slate-900 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg, idx) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] flex flex-col gap-1`}
                >
                  <div className={`group relative rounded-2xl p-4 ${
                    msg.role === 'user' 
                      ? 'bg-indigo-100 text-slate-900 dark:text-slate-100 rounded-tr-sm' 
                      : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-tl-sm shadow-sm'
                  }`}>
                    {editingId === msg.id ? (
                      <div className="flex flex-col gap-2">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full bg-white dark:bg-slate-800/50 border border-indigo-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                          rows={3}
                          autoFocus
                        />
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setEditingId(null)}
                            className="text-xs font-medium px-2 py-1 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => saveEdit(msg.id)}
                            className="text-xs font-medium px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                          >
                            Save & Send
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-[15px] leading-relaxed whitespace-pre-wrap prose prose-sm max-w-none [&>p]:mb-0 [&>p]:mt-0">
                          <Markdown>{msg.content}</Markdown>
                        </div>
                        {msg.role === 'user' && !isLoading && (
                          <button
                            onClick={() => startEdit(msg)}
                            className="absolute -left-8 top-2 p-1.5 text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-indigo-50"
                            title="Edit message"
                          >
                            <Edit2 size={14} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  
                  {msg.role === 'assistant' && !isLoading && (
                    <div className="flex items-center gap-2 pl-1 mt-1">
                      <button 
                        onClick={() => handleFeedback(msg.id, 'up')}
                        className={`p-1.5 rounded-full transition-colors ${msg.feedback === 'up' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-700'}`}
                      >
                        <ThumbsUp size={14} />
                      </button>
                      <button 
                        onClick={() => handleFeedback(msg.id, 'down')}
                        className={`p-1.5 rounded-full transition-colors ${msg.feedback === 'down' ? 'text-rose-600 bg-rose-50' : 'text-slate-400 hover:text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-700'}`}
                      >
                        <ThumbsDown size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-tl-sm p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Loader2 size={16} className="animate-spin" />
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Abhaya Bot is thinking...</span>
                    </div>
                    <button 
                      onClick={stopGenerating}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                      title="Stop generating"
                    >
                      <StopCircle size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white dark:bg-slate-800 p-4 border-t border-slate-100 dark:border-slate-700">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-end gap-2"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Message Abhaya Bot..."
                className="w-full text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-colors resize-none max-h-32 min-h-[48px]"
                rows={1}
              />
              {isLoading ? (
                <button 
                  type="button"
                  onClick={stopGenerating}
                  className="h-12 w-12 shrink-0 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center hover:bg-rose-200 transition-colors"
                >
                  <StopCircle size={20} />
                </button>
              ) : (
                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="h-12 w-12 shrink-0 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:hover:bg-indigo-600"
                >
                  <Send size={20} className="ml-0.5" />
                </button>
              )}
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
