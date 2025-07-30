// app.js
import { askDeepSeek, speakText } from './deepseek.js';

// Initialize Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;

// DOM Elements
const micButton = document.querySelector('#mic-button');
const aiResponse = document.querySelector('#ai-response');
const userPrompt = document.querySelector('#user-prompt');

// State
let isListening = false;
let permissionGranted = false;

// Request Microphone Permission
async function requestMicrophonePermission() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop()); // Release immediately
    return true;
  } catch (error) {
    console.error("Mic permission denied:", error);
    updateUIForError("Please allow microphone access");
    return false;
  }
}

// UI Updates
function updateUIForListening(listening) {
  micButton.setAttribute('material', 'color', listening ? '#4CAF50' : '#F44336');
  userPrompt.setAttribute('visible', listening);
  userPrompt.setAttribute('text', 'value', listening ? 'Listening...' : 'Ready');
}

function updateUIForError(message) {
  userPrompt.setAttribute('text', 'value', message);
  userPrompt.setAttribute('visible', 'true');
  setTimeout(() => userPrompt.setAttribute('visible', 'false'), 3000);
}

// Event Handlers
recognition.onresult = async (event) => {
  const transcript = event.results[0][0].transcript;
  userPrompt.setAttribute('text', 'value', `You: ${transcript}`);
  
  try {
    const response = await askDeepSeek(transcript);
    aiResponse.setAttribute('text', 'value', response);
    speakText(response);
  } catch (error) {
    updateUIForError("Error processing request");
  }
  
  isListening = false;
  updateUIForListening(false);
};

recognition.onerror = (event) => {
  updateUIForError(`Error: ${event.error}`);
  isListening = false;
  updateUIForListening(false);
};

// Mic Button Interaction
micButton.addEventListener('click', async () => {
  if (!permissionGranted) {
    permissionGranted = await requestMicrophonePermission();
    if (!permissionGranted) return;
  }

  if (isListening) {
    recognition.stop();
    isListening = false;
    updateUIForListening(false);
    return;
  }

  try {
    recognition.start();
    isListening = true;
    updateUIForListening(true);
  } catch (error) {
    updateUIForError("Mic access failed");
    console.error("Recognition error:", error);
  }
});
