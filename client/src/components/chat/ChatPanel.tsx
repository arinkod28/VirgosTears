import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../../types';

interface Props {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  onSend: (message: string) => void;
  onClear: () => void;
}

export default function ChatPanel({ messages, loading, error, onSend, onClear }: Props) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSend(input.trim());
    setInput('');
  };

  const quickPrompts = [
    'Give me evidence for AC.L2-3.1.1',
    'What is our MFA compliance rate?',
    'Are there any open NSG vulnerabilities?',
    'Show me audit log evidence with hash',
  ];

  return (
    <div className="bg-navy-800 border border-navy-600 rounded-lg flex flex-col h-[600px]">
      <div className="flex items-center justify-between p-4 border-b border-navy-600">
        <div>
          <h3 className="text-sm font-semibold">AI Compliance Assistant</h3>
          <p className="text-xs text-slate-500">Ask for evidence, explanations, or control status</p>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-slate-500 mb-4">Try asking:</p>
            <div className="space-y-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => onSend(prompt)}
                  className="block w-full text-left text-xs text-blue-400 hover:text-blue-300 bg-navy-700 rounded-lg p-3 transition-colors"
                >
                  &ldquo;{prompt}&rdquo;
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600/20 text-blue-100'
                  : 'bg-navy-700 text-slate-200'
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-navy-700 rounded-lg p-3 text-sm text-slate-400">
              <span className="animate-pulse">Analyzing compliance data...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-navy-600">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a control, request evidence..."
            className="flex-1 bg-navy-700 border border-navy-600 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg text-sm font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
