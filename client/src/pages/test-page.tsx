import React from 'react';

export default function TestPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p>This is a simple test page to verify routing is working correctly.</p>
      <div className="bg-blue-100 p-4 rounded mt-4">
        <h2 className="font-semibold mb-2">Bundle 5C MyPath Component Status</h2>
        <ul className="list-disc pl-5">
          <li>PathwayErrorBoundary - Implemented ✅</li>
          <li>PathwayBreadcrumb - Implemented ✅</li>
          <li>ModuleTransition - Implemented ✅</li>
          <li>Module page - Implemented ✅</li>
        </ul>
      </div>
    </div>
  );
}