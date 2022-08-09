chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  changeInfo.status === "complete" && chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ['script.js']
  });
})
