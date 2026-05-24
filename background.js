const NEXT_SELECTOR = ".next";
const DELAY_MS = 3000;

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab || !tab.id) {
    return;
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      args: [{ nextSelector: NEXT_SELECTOR, delayMs: DELAY_MS }],
      func: runTurboReader,
      world: "MAIN",
    });
  } catch (err) {
    console.error("TurboReader: injection failed", err);
  }
});

function runTurboReader(options) {
  const config = options || {};
  const nextSelector = typeof config.nextSelector === "string" ? config.nextSelector : ".next";
  const delayMs = Number.isFinite(config.delayMs) ? config.delayMs : 0;
  let isTopFrame = false;
  try {
    isTopFrame = window.top === window;
  } catch (err) {
    isTopFrame = false;
  }

  function findNextElement(selector) {
    const nodes = Array.from(document.querySelectorAll(selector));
    if (!nodes.length) {
      return null;
    }

    const nextTextMatch = nodes.find((node) => hasNextText(node) && isVisible(node) && !isDisabled(node));
    if (nextTextMatch) {
      return nextTextMatch;
    }

    const visibleMatch = nodes.find((node) => isVisible(node) && !isDisabled(node));
    return visibleMatch || nodes[0];
  }

  function hasNextText(node) {
    const text = (node.textContent || "").toLowerCase();
    return text.includes("next") || text.includes("next section") || text.includes("continue");
  }

  function isVisible(node) {
    if (!node || !(node instanceof Element)) {
      return false;
    }

    const style = window.getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
      return false;
    }

    return node.getClientRects().length > 0;
  }

  function isDisabled(node) {
    if (!node || !(node instanceof Element)) {
      return true;
    }

    if (node.hasAttribute("disabled") || node.getAttribute("aria-disabled") === "true") {
      return true;
    }

    return false;
  }

  function triggerClick(node) {
    if (!node || !(node instanceof Element)) {
      return;
    }

    try {
      node.click();
      return;
    } catch (err) {
      console.warn("TurboReader: native click failed", err);
    }

    const eventInit = { bubbles: true, cancelable: true, view: window };
    node.dispatchEvent(new PointerEvent("pointerdown", eventInit));
    node.dispatchEvent(new MouseEvent("mousedown", eventInit));
    node.dispatchEvent(new PointerEvent("pointerup", eventInit));
    node.dispatchEvent(new MouseEvent("mouseup", eventInit));
    node.dispatchEvent(new MouseEvent("click", eventInit));
  }

  const videos = Array.from(document.querySelectorAll("video"));
  if (!videos.length) {
    if (isTopFrame) {
      console.log("TurboReader: no <video> elements found in top frame", window.location.href);
    }
  } else {
    console.log("TurboReader: found videos", videos.length, window.location.href);
  }

  videos.forEach((video, index) => {
    try {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      video.currentTime = duration > 0 ? Math.max(0, duration - 0.1) : 9999;
    } catch (err) {
      console.warn("TurboReader: unable to set currentTime", err, video, index);
    }

    ["ended", "timeupdate", "pause"].forEach((eventName) => {
      try {
        video.dispatchEvent(new Event(eventName, { bubbles: true }));
      } catch (err) {
        console.warn("TurboReader: event dispatch failed", err, eventName, video, index);
      }
    });
  });

  if (!isTopFrame) {
    return;
  }

  window.setTimeout(() => {
    const nextElement = findNextElement(nextSelector);
    if (!nextElement) {
      console.log("TurboReader: next element not found", nextSelector);
      return;
    }

    try {
      nextElement.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
    } catch (err) {
      console.warn("TurboReader: scrollIntoView failed", err);
    }

    triggerClick(nextElement);
  }, Math.max(0, delayMs));
}
