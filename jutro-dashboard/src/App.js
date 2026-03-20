import React, { useState } from 'react';

function App() {
  const [logs] = useState([
    { id: 1, time: "15:45:22", status: "HEALED", message: "Mapped keys [p_id, state] to schema [policyId, status]", type: "success" },
    { id: 2, time: "15:45:21", status: "INTERCEPT", message: "Malformed JSON detected on topic: policy-events", type: "warning" },
    { id: 3, time: "15:40:00", status: "ONLINE", message: "Sentinel-AI Agent connected to Broker :9092", type: "info" }
  ]);

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
          <p className="text-3xl font-bold text-white mt-2">1,204</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Auto-Healed</h3>
          <p className="text-3xl font-bold text-blue-400 mt-2">14</p>
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
        <div className="p-6 space-y-4">
          {logs.map(log => (
            <div key={log.id} className={`p-4 rounded-lg flex items-center justify-between border-l-4 shadow-sm bg-gray-700/50
              ${log.type === 'success' ? 'border-green-500' : log.type === 'warning' ? 'border-yellow-500' : 'border-blue-500'}`}>
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 font-mono text-sm">{log.time}</span>
                <span className={`px-2 py-1 rounded text-xs font-bold 
                  ${log.type === 'success' ? 'bg-green-500/20 text-green-400' : 
                    log.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' : 
                    'bg-blue-500/20 text-blue-400'}`}>
                  {log.status}
                </span>
                <span className="text-gray-200 font-medium">{log.message}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
