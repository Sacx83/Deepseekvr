// Initialize Speech Recognition
import { askDeepSeek, speakText } from './deepseek.js';
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;

// State
let isListening = false;
let permissionGranted = false;

// Mic Button Handler
document.querySelector('#mic-button').addEventListener('click', async () => {
  if (!permissionGranted) {
    await requestMicrophonePermission();
    if (!permissionGranted) return;
  }

  if (isListening) {
    recognition.stop();
    return;
  }

  try {
    recognition.start();
    isListening = true;
    updateUIForListening(true);
  } catch (error) {
    console.error("Mic error:", error);
    updateUIForError("Mic access denied");
  }
});

// Permission Request
async function requestMicrophonePermission() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop()); // Immediately release
    permissionGranted = true;
    return true;
  } catch (error) {
    console.error("Permission denied:", error);
    updateUIForError("Please allow microphone access");
    return false;
  }
}

// UI Updates
function updateUIForListening(listening) {
  const micButton = document.querySelector('#mic-button');
  const userPrompt = document.querySelector('#user-prompt');
  
  micButton.setAttribute('material', 'color', listening ? 'green' : 'red');
  userPrompt.setAttribute('visible', listening);
  userPrompt.setAttribute('text', 'value', listening ? 'Listening...' : 'Ready');
}

function updateUIForError(message) {
  const userPrompt = document.querySelector('#user-prompt');
  userPrompt.setAttribute('visible', 'true');
  userPrompt.setAttribute('text', 'value', message);
  setTimeout(() => userPrompt.setAttribute('visible', 'false'), 3000);
}

// Speech Recognition Events
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  processUserInput(transcript);
};

recognition.onerror = (event) => {
  updateUIForError(`Error: ${event.error}`);
  isListening = false;
  updateUIForListening(false);
};

recognition.onend = () => {
  if (isListening) recognition.start(); // Continuous listening
};

// Process User Input
async function processUserInput(text) {
  const userPrompt = document.querySelector('#user-prompt');
  const aiResponse = document.querySelector('#ai-response');
  
  userPrompt.setAttribute('text', 'value', `You: ${text}`);
  
  try {
    const response = await askDeepSeek(text);
    aiResponse.setAttribute('text', 'value', response);
    speakText(response);
  } catch (error) {
    aiResponse.setAttribute('text', 'value', "Error getting response");
  }
  
  isListening = false;
  updateUIForListening(false);
}
