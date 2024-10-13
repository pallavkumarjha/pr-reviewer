import React, { useState, useEffect } from 'react';
import { Github } from 'lucide-react';

function App() {
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab.id) {
        chrome.tabs.sendMessage(
          activeTab.id,
          { action: 'getRecommendations' },
          (response) => {
            if (response && response.recommendations) {
              setRecommendations(response.recommendations);
            }
          }
        );
      }
    });
  }, []);

  return (
    <div className="w-96 p-4 bg-gray-100">
      <div className="flex items-center mb-4">
        <Github className="w-6 h-6 mr-2" />
        <h1 className="text-xl font-bold">GitHub PR Review Assistant</h1>
      </div>
      {recommendations.length > 0 ? (
        <ul className="list-disc pl-5">
          {recommendations.map((rec, index) => (
            <li key={index} className="mb-2">{rec}</li>
          ))}
        </ul>
      ) : (
        <p>No recommendations available for this page.</p>
      )}
    </div>
  );
}

export default App;