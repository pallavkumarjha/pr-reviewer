chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('github.com') && tab.url?.includes('/pull/')) {
    chrome.tabs.sendMessage(tabId, { action: 'getRecommendations' });
  }
});