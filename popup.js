const DEFAULTS = {
  nextSelector: ".next",
  delayMs: 3000,
};

const selectorInput = document.getElementById("selector");
const delayInput = document.getElementById("delay");
const delayValue = document.getElementById("delayValue");
const runButton = document.getElementById("runButton");
const saveButton = document.getElementById("saveButton");
const statusEl = document.getElementById("status");

function setStatus(message, tone) {
  statusEl.textContent = message;
  statusEl.classList.remove("success", "error", "busy");
  if (tone) {
    statusEl.classList.add(tone);
  }
}

function formatDelay(ms) {
  return `${(ms / 1000).toFixed(1)}s`;
}

function readConfigFromUI() {
  const nextSelector = selectorInput.value.trim() || DEFAULTS.nextSelector;
  const delayMs = Number.parseInt(delayInput.value, 10);
  return {
    nextSelector,
    delayMs: Number.isFinite(delayMs) ? delayMs : DEFAULTS.delayMs,
  };
}

async function getActiveTabId() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      if (!tabs.length || !Number.isFinite(tabs[0].id)) {
        reject(new Error("No active tab found."));
        return;
      }

      resolve(tabs[0].id);
    });
  });
}

function sendRunMessage(tabId, config) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: "run", tabId, config }, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      if (!response || !response.ok) {
        reject(new Error(response && response.error ? response.error : "Run failed."));
        return;
      }

      resolve();
    });
  });
}

async function loadSettings() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(DEFAULTS, (data) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      selectorInput.value = data.nextSelector || DEFAULTS.nextSelector;
      delayInput.value = Number.isFinite(data.delayMs) ? data.delayMs : DEFAULTS.delayMs;
      delayValue.textContent = formatDelay(Number.parseInt(delayInput.value, 10));
      resolve();
    });
  });
}

async function saveSettings() {
  const config = readConfigFromUI();
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(config, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve();
    });
  });
}

selectorInput.addEventListener("input", () => {
  setStatus("Update settings or click Run.");
});

delayInput.addEventListener("input", () => {
  delayValue.textContent = formatDelay(Number.parseInt(delayInput.value, 10));
});

delayInput.addEventListener("change", () => {
  setStatus("Delay updated.");
});

runButton.addEventListener("click", async () => {
  runButton.disabled = true;
  setStatus("Injecting into the active tab...", "busy");

  try {
    const tabId = await getActiveTabId();
    const config = readConfigFromUI();
    await sendRunMessage(tabId, config);
    setStatus("Done. Video marked complete and next triggered.", "success");
  } catch (err) {
    setStatus(err && err.message ? err.message : "Run failed.", "error");
  } finally {
    runButton.disabled = false;
  }
});

saveButton.addEventListener("click", async () => {
  saveButton.disabled = true;
  try {
    await saveSettings();
    setStatus("Saved. Ready when you are.", "success");
  } catch (err) {
    setStatus("Save failed.", "error");
  } finally {
    saveButton.disabled = false;
  }
});

loadSettings()
  .then(() => {
    setStatus("Settings loaded.");
  })
  .catch(() => {
    setStatus("Settings load failed.", "error");
  });
