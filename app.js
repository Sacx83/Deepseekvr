// Initialize Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// DOM Elements
const micButton = document.querySelector('#mic-button');
const aiResponse = document.querySelector('#ai-response');
const userPrompt = document.querySelector('#user-prompt');

// Import API functions
import { askDeepSeek, speakText } from './deepseek.js';

// State
let isListening = false;

// Event Handlers
const handleSpeechResult = async (event) => {
  const spokenText = event.results[0][0].transcript;
  userPrompt.setAttribute('text', 'value', `You: ${spokenText}`);
  
  try {
    const aiResponseText = await askDeepSeek(spokenText);
    aiResponse.setAttribute('text', 'value', aiResponseText);
    speakText(aiResponseText);
  } catch (error) {
    aiResponse.setAttribute('text', 'value', "Error getting response");
    console.error("Processing error:", error);
  }
  
  userPrompt.setAttribute('visible', 'false');
  isListening = false;
};

const handleError = (event) => {
  console.error("Speech error:", event.error);
  userPrompt.setAttribute('text', 'value', `Error: ${event.error}`);
  setTimeout(() => userPrompt.setAttribute('visible', 'false'), 2000);
  isListening = false;
};

// Setup
recognition.onresult = handleSpeechResult;
recognition.onerror = handleError;

// Mic Interaction
micButton.addEventListener('click', () => {
  if (isListening) {
    recognition.stop();
    return;
  }

  recognition.start();
  isListening = true;
  userPrompt.setAttribute('visible', 'true');
  userPrompt.setAttribute('text', 'value', 'Listening...');
  
  // Visual feedback
  micButton.setAttribute('material', 'color', 'green');
  recognition.onend = () => {
    micButton.setAttribute('material', 'color', 'red');
  };
});
