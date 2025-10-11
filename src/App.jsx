import React, { useState } from 'react';
import { API_BASE } from './api';
import SearchTab from './components/SearchTab';
import AddLinkTab from './components/AddLinkTab';
import AddTagTab from './components/AddTagTab';

function App() {
  const [activeTab, setActiveTab] = useState('search');

  const tabs = [
    { id: 'search', label: 'Search' },
    { id: 'add-link', label: 'Add Link' },
    { id: 'add-tag', label: 'Add Tag' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🔖 Bookmark Blog
          </h1>
          <p className="text-sm text-gray-600">
            Backend: {API_BASE} · <span className="inline-block bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full text-xs">v1</span>
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'search' && <SearchTab />}
            {activeTab === 'add-link' && <AddLinkTab />}
            {activeTab === 'add-tag' && <AddTagTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;





