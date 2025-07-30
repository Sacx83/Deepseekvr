// Initialize Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// Get DOM elements
const micButton = document.querySelector('#mic-button');
const aiResponse = document.querySelector('#ai-response');
const userPrompt = document.querySelector('#user-prompt');

// State management
let isListening = false;

// Event Handlers
const handleSpeechResult = async (event) => {
  try {
    const spokenText = event.results[0][0].transcript;
    userPrompt.setAttribute("text", "value", `You: ${spokenText}`);
    
    const aiResponseText = await askDeepSeek(spokenText);
    aiResponse.setAttribute("text", "value", aiResponseText);
    speakText(aiResponseText);
  } catch (error) {
    console.error("Processing error:", error);
    userPrompt.setAttribute("text", "value", "Error processing request");
  } finally {
    userPrompt.setAttribute("visible", "false");
    isListening = false;
  }
};

const handleSpeechError = (event) => {
  console.error("Speech recognition error:", event.error);
  userPrompt.setAttribute("text", "value", `Error: ${event.error}`);
  userPrompt.setAttribute("visible", "false");
  isListening = false;
};

const handleSpeechEnd = () => {
  if (isListening) {
    recognition.start(); // Restart listening if not manually stopped
  }
};

// Set up event listeners
recognition.onresult = handleSpeechResult;
recognition.onerror = handleSpeechError;
recognition.onend = handleSpeechEnd;

// Mic button click handler
micButton.addEventListener("click", () => {
  if (isListening) {
    recognition.stop();
    isListening = false;
    userPrompt.setAttribute("visible", "false");
    return;
  }

  try {
    recognition.start();
    isListening = true;
    userPrompt.setAttribute("visible", "true");
    userPrompt.setAttribute("text", "value", "Listening...");
  } catch (error) {
    console.error("Speech recognition start failed:", error);
    userPrompt.setAttribute("text", "value", "Error: Mic access denied");
  }
});

// Optional: Add visual feedback for listening state
micButton.addEventListener('mousedown', () => {
  if (!isListening) {
    micButton.setAttribute('material', 'color', 'green');
  }
});

micButton.addEventListener('mouseup', () => {
  if (!isListening) {
    micButton.setAttribute('material', 'color', 'red');
  }
});
