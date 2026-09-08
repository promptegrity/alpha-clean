const DEFAULTS = {
  hideAiOverview: true,
  hideAiMode: true,
  hideRelatedQuestions: true,
  hideShorts: true,
  hidePlayables: true,
};

const ids = Object.keys(DEFAULTS);

chrome.storage.sync.get(DEFAULTS, (stored) => {
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) el.checked = stored[id] !== false;
  }
});

for (const id of ids) {
  const el = document.getElementById(id);
  if (!el) continue;
  el.addEventListener("change", () => {
    chrome.storage.sync.set({ [id]: el.checked });
  });
}
