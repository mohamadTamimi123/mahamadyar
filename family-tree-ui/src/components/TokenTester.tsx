'use client';

import React, { useState } from 'react';

const TokenTester: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testToken = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const token = localStorage.getItem('token');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:5002';
      
      console.log('Testing token:', token ? token.substring(0, 20) + '...' : 'No token');
      
      // Test debug endpoint
      const debugResponse = await fetch(`${apiBaseUrl}/auth/debug-token`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const debugData = await debugResponse.json();
      
      // Test auth/me endpoint
      const meResponse = await fetch(`${apiBaseUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const meData = meResponse.ok ? await meResponse.json() : { error: meResponse.statusText };
      
      setResult({
        token: token ? token.substring(0, 20) + '...' : 'No token',
        apiBaseUrl,
        debug: debugData,
        me: meData,
        meStatus: meResponse.status,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-bold mb-4">Token Tester</h3>
      
      <button
        onClick={testToken}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Token'}
      </button>
      
      {result && (
        <div className="mt-4 p-4 bg-white rounded border">
          <h4 className="font-bold mb-2">Test Results:</h4>
          <pre className="text-xs overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TokenTester;
