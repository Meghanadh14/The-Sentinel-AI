import React, { useState, useEffect } from 'react';
import { database } from './firebaseConfig';
import { ref, onValue } from 'firebase/database';

function App() {
  const [logs, setLogs] = useState([]);
  const [totalProcessed, setTotalProcessed] = useState(1204); // Starting baseline

  useEffect(() => {
    // Listen to the 'live_logs' path in Firebase
    const logsRef = ref(database, 'live_logs');

    onValue(logsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert Firebase object to array, reverse it (newest at top), and keep the last 50
        const entries = Object.entries(data)
          .map(([id, value]) => ({ id, ...value }))
          .reverse()
          .slice(0, 50); 

        setLogs(entries);
        setTotalProcessed(prev => prev + 1); // Increment total count
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 font-sans">
      <header className="mb-10 flex justify-between items-center border-b border-gray-700 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-blue-400 tracking-tight">Sentinel-AI</h1>
          <p className="text-gray-400 mt-1">Autonomic Integration Observability</p>
        </div>
        <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-full shadow">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-300">Kafka Broker: LIVE</span>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Messages Processed</h3>
          <p className="text-3xl font-bold text-white mt-2">{totalProcessed.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Auto-Healed</h3>
          <p className="text-3xl font-bold text-blue-400 mt-2">{logs.length}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Dead-Letter Queue</h3>
          <p className="text-3xl font-bold text-red-400 mt-2">0</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700 bg-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Live AI Intervention Log</h2>
        </div>
        <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500 font-mono">Waiting for AI interventions...</p>
          ) : (
            logs.map(log => (
              <div key={log.id} className="p-4 rounded-lg flex items-center justify-between border-l-4 shadow-sm bg-gray-700/50 border-green-500">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400 font-mono text-sm">{log.timestamp}</span>
                  <span className="px-2 py-1 rounded text-xs font-bold bg-green-500/20 text-green-400">
                    HEALED
                  </span>
                  <span className="text-gray-200 font-medium">
                    Mapped <span className="text-yellow-400 font-mono">p_id</span> to <span className="text-blue-400 font-mono">policyId: {log.healed?.policyId || 'UNKNOWN'}</span>
                  </span>
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
