import React, { useState, useEffect } from 'react';
import { database } from './firebaseConfig';
import { ref, onValue } from 'firebase/database';

function App() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ total: 1204, healed: 0 });

  useEffect(() => {
    const logsRef = ref(database, 'live_logs');
    
    onValue(logsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const entries = Object.entries(data).map(([id, value]) => ({
          id,
          ...value
        })).reverse().slice(0, 50); // Keep the latest 50 logs
        
        setLogs(entries);
        setStats(prev => ({ ...prev, healed: entries.length, total: prev.total + 1 }));
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 font-sans">
      <header className="mb-10 flex justify-between items-center border-b border-gray-700 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-blue-400 tracking-tight">Sentinel-AI</h1>
          <p className="text-gray-400 mt-1">Autonomic Integration Observability for Guidewire</p>
        </div>
        <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-full shadow">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-300">SYSTEM STATUS: LIVE</span>
        </div>
      </header>
      
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Messages Processed</h3>
          <p className="text-3xl font-bold text-white mt-2">{stats.total.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">AI Auto-Healed</h3>
          <p className="text-3xl font-bold text-blue-400 mt-2">{stats.healed}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Dead-Letter Queue</h3>
          <p className="text-3xl font-bold text-red-400 mt-2">0</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700 bg-gray-800">
          <h2 className="text-lg font-semibold text-white">Live AI Intervention Log</h2>
        </div>
        <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500 text-center py-10 italic font-mono">Waiting for Kafka stream initialization...</p>
          ) : (
            logs.map(log => (
              <div key={log.id} className="p-4 rounded-lg flex items-center justify-between border-l-4 shadow-sm bg-gray-700/50 border-green-500">
                <div className="flex flex-col space-y-2 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold uppercase">Healed</span>
                      <span className="text-blue-300 font-mono text-sm">{log.healed?.policyId || 'N/A'}</span>
                    </div>
                    <span className="text-gray-400 text-xs font-mono">{log.timestamp}</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Mapped <span className="text-yellow-500/80 font-mono">p_id</span> → <span className="text-green-400 font-mono">policyId</span> and <span className="text-yellow-500/80 font-mono">state</span> → <span className="text-green-400 font-mono">status</span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;