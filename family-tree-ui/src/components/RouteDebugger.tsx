'use client';

import React, { useState } from 'react';
import { useRouteManager } from '@/hooks/useRouteManager';

const RouteDebugger: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const routeManager = useRouteManager();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const debugInfo = routeManager.debugCurrentRoute();

  return (
    <>
      {/* Debug Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 bg-red-500 text-white p-2 rounded-full shadow-lg z-50 hover:bg-red-600 transition-colors"
        title="Route Debugger"
      >
        🐛
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="fixed bottom-16 left-4 bg-white border border-gray-300 rounded-lg shadow-xl p-4 z-50 max-w-md max-h-96 overflow-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-900">Route Debugger</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <div>
              <strong>Current Path:</strong> 
              <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">
                {debugInfo?.path}
              </span>
            </div>

            <div>
              <strong>Authentication:</strong>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                debugInfo?.isAuthenticated ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {debugInfo?.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </span>
            </div>

            <div>
              <strong>Admin:</strong>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                debugInfo?.isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {debugInfo?.isAdmin ? 'Admin' : 'User'}
              </span>
            </div>

            <div>
              <strong>Route Valid:</strong>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                debugInfo?.validation?.valid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {debugInfo?.validation?.valid ? 'Valid' : 'Invalid'}
              </span>
            </div>

            {debugInfo?.validation?.redirect && (
              <div>
                <strong>Redirect To:</strong>
                <span className="ml-2 font-mono bg-yellow-100 px-2 py-1 rounded">
                  {debugInfo.validation.redirect}
                </span>
              </div>
            )}

            {debugInfo?.route && (
              <div>
                <strong>Route Config:</strong>
                <div className="mt-1 bg-gray-50 p-2 rounded text-xs">
                  <div><strong>Title:</strong> {debugInfo.route.title}</div>
                  <div><strong>Component:</strong> {debugInfo.route.component}</div>
                  <div><strong>Requires Auth:</strong> {debugInfo.route.requiresAuth ? 'Yes' : 'No'}</div>
                  {debugInfo.route.requiresAdmin && (
                    <div><strong>Requires Admin:</strong> Yes</div>
                  )}
                </div>
              </div>
            )}

            <div>
              <strong>Navigation Items:</strong>
              <div className="mt-1 max-h-32 overflow-auto">
                {routeManager.getNavItems().map((item, index) => (
                  <div key={index} className="text-xs bg-gray-50 p-1 rounded mb-1">
                    {item.icon} {item.label} → {item.href}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-gray-500 pt-2 border-t">
              Last Updated: {debugInfo?.timestamp}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RouteDebugger;
