import React, { useState, useRef, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { useChat } from '../hooks/useChat';

const SUGGESTED = [
  { label: 'Compliance summary', prompt: 'Give me a full compliance summary' },
  { label: 'MFA status', prompt: 'What is our MFA compliance rate?' },
  { label: 'NSG vulnerabilities', prompt: 'Are there any open NSG vulnerabilities?' },
  { label: 'Access control evidence', prompt: 'Give me evidence for AC.L2-3.1.1' },
  { label: 'Audit log evidence', prompt: 'Show me audit log evidence with hash' },
  { label: 'Active issues', prompt: 'What are the current compliance issues?' },
];

export default function AssistantPage() {
  const { messages, loading, sendMessage, clearChat } = useChat();
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    sendMessage(trimmed);
    setInput('');
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit(input);
    }
  };

  const empty = messages.length === 0;

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-64px)] max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-navy-600 mb-4 flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold">AI Compliance Assistant</h1>
            <p className="text-xs text-slate-400 mt-0.5">Powered by CMMC 2.0 control data &bull; Contoso Defense Corp</p>
          </div>
          {!empty && (
            <button
              onClick={clearChat}
              className="text-xs text-slate-500 hover:text-slate-300 border border-navy-600 px-3 py-1.5 rounded-lg transition-colors"
            >
              New chat
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-6 pb-4">
          {empty && (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold mb-2">CMMC Compliance Assistant</h2>
              <p className="text-sm text-slate-400 mb-8 max-w-sm">
                Ask about compliance status, request evidence with SHA-256 hashes, or get guidance on remediation steps.
              </p>
              <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                {SUGGESTED.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => submit(s.prompt)}
                    className="text-left text-xs bg-navy-700 hover:bg-navy-600 border border-navy-600 rounded-xl p-3 transition-colors group"
                  >
                    <span className="text-slate-400 group-hover:text-slate-200 transition-colors">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                  <span className="text-[10px] text-blue-400 font-bold">AI</span>
                </div>
              )}
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-navy-700 text-slate-200 rounded-bl-sm border border-navy-600'
                }`}
              >
                <pre className="whitespace-pre-wrap font-sans leading-relaxed">{msg.content}</pre>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                <span className="text-[10px] text-blue-400 font-bold">AI</span>
              </div>
              <div className="bg-navy-700 border border-navy-600 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="flex-shrink-0 border-t border-navy-600 pt-4">
          <div className="flex gap-3 items-end bg-navy-700 border border-navy-600 rounded-2xl px-4 py-3 focus-within:border-blue-500 transition-colors">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about a control, request evidence, or ask for remediation guidance..."
              rows={1}
              className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
              style={{ maxHeight: '120px' }}
              onInput={(e) => {
                const t = e.currentTarget;
                t.style.height = 'auto';
                t.style.height = Math.min(t.scrollHeight, 120) + 'px';
              }}
              disabled={loading}
            />
            <button
              onClick={() => submit(input)}
              disabled={loading || !input.trim()}
              className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-600 flex items-center justify-center flex-shrink-0 transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-600 mt-2">
            Press Enter to send &bull; Shift+Enter for new line
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
