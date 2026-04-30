import React, { useEffect, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import StatsBar from '../components/dashboard/StatsBar';
import ControlGrid from '../components/controls/ControlGrid';
import ChatPanel from '../components/chat/ChatPanel';
import EvidencePanel from '../components/evidence/EvidencePanel';
import { useAzureConnection, useDashboard } from '../hooks/useDashboard';
import { useChat } from '../hooks/useChat';

export default function DashboardPage() {
  const azure = useAzureConnection();
  const dashboard = useDashboard();
  const chat = useChat();

  const [evidenceControlId, setEvidenceControlId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    azure.checkStatus();
    dashboard.fetchStats();
    dashboard.fetchLatest();
  }, []);

  return (
    <AppLayout tenant={azure.status.tenant || 'Contoso Defense Corp'}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Compliance Dashboard</h1>
            <p className="text-sm text-slate-400 mt-1">
              CMMC Level 2 &mdash; 6 Controls &mdash; Microsoft Azure
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowChat(!showChat)}
              className="px-4 py-2 bg-navy-700 hover:bg-navy-600 border border-navy-600 rounded-lg text-sm transition-colors"
            >
              {showChat ? 'Hide' : 'Show'} AI Assistant
            </button>
            <button
              onClick={dashboard.runScan}
              disabled={dashboard.scanning}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg text-sm font-medium transition-colors"
            >
              {dashboard.scanning ? 'Scanning...' : 'Run Scan'}
            </button>
          </div>
        </div>

        <StatsBar stats={dashboard.stats} />

        <div className={`grid gap-6 ${showChat ? 'grid-cols-3' : 'grid-cols-1'}`}>
          <div className={showChat ? 'col-span-2' : ''}>
            <ControlGrid
              results={dashboard.results}
              onRequestEvidence={(id) => setEvidenceControlId(id)}
            />
          </div>

          {showChat && (
            <div className="col-span-1">
              <ChatPanel
                messages={chat.messages}
                loading={chat.loading}
                error={chat.error}
                onSend={chat.sendMessage}
                onClear={chat.clearChat}
              />
            </div>
          )}
        </div>

        {dashboard.error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm text-red-400">
            Scan error: {dashboard.error}
          </div>
        )}
      </div>

      {evidenceControlId && (
        <EvidencePanel
          controlId={evidenceControlId}
          onClose={() => setEvidenceControlId(null)}
        />
      )}
    </AppLayout>
  );
}
