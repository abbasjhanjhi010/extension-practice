const EMOJI_PRESETS = [
  "😀", "🔥", "⭐", "🚀", "💡", "🎯", "🐱", "🐶",
  "🍕", "☕", "🎧", "📌", "🔒", "⚡", "🌙", "❤️",
];

let hostname = null;
let pendingFavicon = null;

const siteEl = document.getElementById("site");
const previewImg = document.getElementById("previewImg");
const previewLabel = document.getElementById("previewLabel");
const presetsEl = document.getElementById("presets");
const urlInput = document.getElementById("urlInput");
const fileInput = document.getElementById("fileInput");
const applyBtn = document.getElementById("apply");
const resetBtn = document.getElementById("reset");
const statusEl = document.getElementById("status");

function setPreview(dataUrlOrUrl, label) {
  pendingFavicon = dataUrlOrUrl;
  previewImg.src = dataUrlOrUrl;
  previewLabel.textContent = label;
}

function emojiToDataUrl(emoji) {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  ctx.font = "48px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, 32, 36);
  return canvas.toDataURL("image/png");
}

function showStatus(text) {
  statusEl.textContent = text;
  setTimeout(() => {
    statusEl.textContent = "";
  }, 1500);
}

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url || !tab.url.startsWith("http")) {
    siteEl.textContent = "This page can't be customized.";
    applyBtn.disabled = true;
    resetBtn.disabled = true;
    return;
  }

  hostname = new URL(tab.url).hostname;
  siteEl.textContent = hostname;

  const result = await chrome.storage.local.get(hostname);
  if (result[hostname]) {
    setPreview(result[hostname], "Current custom favicon");
  }

  EMOJI_PRESETS.forEach((emoji) => {
    const btn = document.createElement("button");
    btn.textContent = emoji;
    btn.title = `Use ${emoji}`;
    btn.addEventListener("click", () => {
      setPreview(emojiToDataUrl(emoji), `Emoji: ${emoji}`);
    });
    presetsEl.appendChild(btn);
  });
}

urlInput.addEventListener("change", () => {
  if (urlInput.value.trim()) {
    setPreview(urlInput.value.trim(), "Custom URL");
  }
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => setPreview(reader.result, `Uploaded: ${file.name}`);
  reader.readAsDataURL(file);
});

applyBtn.addEventListener("click", async () => {
  if (!hostname || !pendingFavicon) {
    showStatus("Pick a favicon first");
    return;
  }
  await chrome.storage.local.set({ [hostname]: pendingFavicon });
  showStatus("Applied");
});

resetBtn.addEventListener("click", async () => {
  if (!hostname) return;
  await chrome.storage.local.remove(hostname);
  setPreview("", "No custom favicon selected");
  previewImg.removeAttribute("src");

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab && tab.id) {
    chrome.tabs.reload(tab.id);
  }
  showStatus("Reset — page reloaded");
});

init();
