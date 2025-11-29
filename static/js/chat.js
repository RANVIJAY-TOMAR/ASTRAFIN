/* 
  ASTRAFIN Premium Chat Logic
  Handles interactions, animations, and API communication.
*/

const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const loadingScreen = document.getElementById("loading-screen");
const conversationStartersSection = document.getElementById("conversation-starters");
const starterPills = conversationStartersSection
  ? Array.from(conversationStartersSection.querySelectorAll(".starter-pill"))
  : [];
const contextChips = Array.from(document.querySelectorAll(".context-chip"));

const conversationHistory = [];
let messageIndex = 0;
let typingIndicator = null;

/* --- Star Generation (Ambient) --- */
function createStars() {
  const starField = document.getElementById('star-field');
  if (!starField) return;

  // Clear existing stars if any
  starField.innerHTML = '';

  const starCount = 150; // Reduced count for cleaner look
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star');

    // Random position
    const x = Math.random() * 100;
    const y = Math.random() * 100;

    // Random size (mostly tiny)
    const size = Math.random() < 0.9 ? Math.random() * 1.5 + 0.5 : Math.random() * 2 + 1;

    // Random animation properties
    const duration = Math.random() * 4 + 3; // 3-7s
    const delay = Math.random() * 5;
    const opacity = Math.random() * 0.5 + 0.2;

    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.setProperty('--duration', `${duration}s`);
    star.style.setProperty('--delay', `${delay}s`);
    star.style.setProperty('--opacity', opacity);

    starField.appendChild(star);
  }
}

/* --- UI Helpers --- */
function hideConversationStarters() {
  if (conversationStartersSection && !conversationStartersSection.style.display === 'none') {
    // Fade out effect could be added here
    conversationStartersSection.style.display = 'none';
  }
}

function scrollToBottom() {
  chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: "smooth" });
}

/* --- Typing Indicator --- */
function createTypingIndicator() {
  const message = document.createElement("div");
  message.classList.add("message", "bot");
  message.id = "typing-indicator";
  message.style.display = "flex";
  message.style.alignItems = "center";
  message.style.gap = "4px";
  message.style.width = "fit-content";

  // Simple dot animation
  message.innerHTML = `
    <span style="animation: pulse 1s infinite; animation-delay: 0s;">.</span>
    <span style="animation: pulse 1s infinite; animation-delay: 0.2s;">.</span>
    <span style="animation: pulse 1s infinite; animation-delay: 0.4s;">.</span>
  `;

  chatWindow.appendChild(message);
  scrollToBottom();
  return message;
}

function removeTypingIndicator() {
  const indicator = document.getElementById("typing-indicator");
  if (indicator) {
    indicator.remove();
  }
}

/* --- Message Handling --- */
function appendMessage(role, content, animate = true) {
  const message = document.createElement("div");
  const className = role === "assistant" ? "bot" : "user";
  message.classList.add("message", className);

  if (role === "assistant" && animate) {
    typeText(message, content);
  } else {
    message.textContent = content;
  }

  chatWindow.appendChild(message);
  scrollToBottom();
}

function typeText(element, text, speed = 15) {
  let index = 0;
  element.textContent = "";

  const typeChar = () => {
    if (index < text.length) {
      element.textContent += text[index];
      index++;
      setTimeout(typeChar, speed);
      // Scroll occasionally during typing to keep bottom in view
      if (index % 20 === 0) scrollToBottom();
    }
  };

  typeChar();
}

/* --- Interaction Logic --- */
async function sendMessage(event, presetMessage = null) {
  if (event) {
    event.preventDefault();
  }

  const message = (presetMessage ?? userInput.value).trim();
  if (!message) {
    return;
  }

  hideConversationStarters();

  // Add ripple/scale effect to button
  if (!presetMessage) {
    sendBtn.style.transform = "scale(0.9)";
    setTimeout(() => {
      sendBtn.style.transform = "";
    }, 150);
  }

  appendMessage("user", message);
  conversationHistory.push({ role: "user", content: message });

  userInput.value = "";
  userInput.style.height = "auto";
  sendBtn.disabled = true;

  typingIndicator = createTypingIndicator();

  const payload = {
    message,
    history: conversationHistory.slice(-8),
  };

  try {
    const response = await fetch("/api/chat/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to reach Astra");
    }

    const data = await response.json();

    removeTypingIndicator();

    setTimeout(() => {
      appendMessage("assistant", data.reply, true);
      conversationHistory.push({ role: "assistant", content: data.reply });
    }, 200);
  } catch (error) {
    removeTypingIndicator();
    setTimeout(() => {
      appendMessage(
        "assistant",
        "I ran into a hiccup processing that. Could you try again in a moment?",
        true
      );
    }, 200);
  } finally {
    sendBtn.disabled = false;
    userInput.focus();
  }
}

/* --- Event Listeners --- */
chatForm.addEventListener("submit", sendMessage);

contextChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    // Visual feedback for chips
    contextChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    const preset = chip.dataset.message; // Note: Context chips in new HTML don't have data-message, only starters do.
    // If context chips are just for "vibe" setting, we might want to send a hidden system message or just store state.
    // For now, let's assume they just set visual state as per new design.
  });
});

starterPills.forEach((button) => {
  button.addEventListener("click", () => {
    const preset = button.dataset.message;
    if (preset) {
      sendMessage(null, preset);
    }
  });
});

userInput.addEventListener("input", () => {
  hideConversationStarters();
  userInput.style.height = "auto";
  userInput.style.height = `${Math.min(userInput.scrollHeight, 120)}px`;
});

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    chatForm.dispatchEvent(new Event("submit"));
  }
});

/* --- Initialization --- */
function hideLoadingScreen() {
  if (!loadingScreen) return;
  loadingScreen.classList.add("hidden");
  setTimeout(() => loadingScreen.remove(), 600); // Cleanup
}

function sendWarmGreeting() {
  const greetings = [
    "Hello. I'm Astra. How can I help you navigate your finances today?",
    "Welcome. I'm here to provide clarity on your financial journey.",
    "Hi there. Ready to explore your options?",
  ];
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];
  appendMessage("assistant", greeting, true);
}

window.addEventListener("load", () => {
  createStars();
  setTimeout(() => {
    hideLoadingScreen();
    sendWarmGreeting();
  }, 800);
});
