function crawlPRPage() {
  const diffStats = document.querySelectorAll('.diffstat');
  const fileChanges = Array.from(diffStats).map(stat => stat.getAttribute('aria-label'));
  
  const recommendations: string[] = [];

  if (fileChanges.length > 10) {
    recommendations.push("This PR changes many files. Consider breaking it into smaller, more focused PRs.");
  }

  const largeChanges = fileChanges.filter(change => {
    const additions = parseInt(change?.match(/(\d+) additions?/)?.[1] || '0');
    const deletions = parseInt(change?.match(/(\d+) deletions?/)?.[1] || '0');
    return additions + deletions > 300;
  });

  if (largeChanges.length > 0) {
    recommendations.push("Some files have large changes. Consider reviewing these files more carefully.");
  }

  const comments = document.querySelectorAll('.review-comment');
  if (comments.length > 20) {
    recommendations.push("This PR has many comments. Ensure all discussions are resolved before merging.");
  }

  return recommendations;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getRecommendations') {
    const recommendations = crawlPRPage();
    sendResponse({ recommendations });
  }
});