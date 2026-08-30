(() => {
  const hostname = location.hostname;
  let overrideHref = null;

  function removeExistingIconLinks() {
    document
      .querySelectorAll("link[rel~='icon'], link[rel='shortcut icon']")
      .forEach((el) => el.remove());
  }

  function applyFavicon(href) {
    overrideHref = href;
    if (!document.head) return;
    removeExistingIconLinks();
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = href;
    document.head.appendChild(link);
  }

  function init() {
    chrome.storage.local.get(hostname, (result) => {
      const stored = result[hostname];
      if (stored) applyFavicon(stored);
    });
  }

  // Re-apply if the page's own scripts add a favicon link after we've set ours,
  // which is common on sites that set their icon dynamically.
  const observer = new MutationObserver(() => {
    if (!overrideHref || !document.head) return;
    const current = document.head.querySelector("link[rel~='icon']");
    if (!current || current.href !== overrideHref) {
      applyFavicon(overrideHref);
    }
  });

  function startObserving() {
    if (document.head) {
      observer.observe(document.head, { childList: true });
    } else {
      document.addEventListener("DOMContentLoaded", startObserving, { once: true });
    }
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes[hostname]) return;
    const newValue = changes[hostname].newValue;
    if (newValue) {
      applyFavicon(newValue);
    } else {
      overrideHref = null;
    }
  });

  if (document.head) {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  }
  startObserving();
})();
