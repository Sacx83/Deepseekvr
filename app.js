// app.js
console.log("App.js loaded");

import { askDeepSeek, speakText } from './deepseek.js';

// Elements (assumes scene already loaded)
const micButton = document.querySelector('#mic-button');
const aiResponse = document.querySelector('#ai-response');
const userPrompt = document.querySelector('#user-prompt');

if (!micButton || !aiResponse || !userPrompt) {
  console.error('Required elements (#mic-button, #ai-response, #user-prompt) not found.');
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
  console.error("SpeechRecognition API not supported in this browser.");
  userPrompt.setAttribute('text', 'value', 'Speech Recognition not supported');
  userPrompt.setAttribute('visible', 'true');
}

const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;

let isListening = false;
let permissionGranted = false;

async function requestMicrophonePermission() {
  try {
    console.log("Requesting microphone permission...");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log("Microphone permission granted.");
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error("Mic permission denied:", error);
    updateUIForError("Please allow microphone access");
    return false;
  }
}

function updateUIForListening(listening) {
  micButton.setAttribute('material', 'color', listening ? '#4CAF50' : '#F44336');
  userPrompt.setAttribute('visible', listening);
  userPrompt.setAttribute('text', 'value', listening ? 'Listening...' : 'Ready');
}

function updateUIForError(message) {
  micButton.setAttribute('material', 'color', '#FFC107');
  userPrompt.setAttribute('text', 'value', message);
  userPrompt.setAttribute('visible', 'true');
  setTimeout(() => userPrompt.setAttribute('visible', 'false'), 3000);
}

recognition.onresult = async (event) => {
  const transcript = event.results[0][0].transcript;
  console.log("Speech recognized:", transcript);
  userPrompt.setAttribute('text', 'value', `You: ${transcript}`);

  try {
    const response = await askDeepSeek(transcript);
    console.log("DeepSeek response:", response);
    aiResponse.setAttribute('text', 'value', response);
    speakText(response);
  } catch (error) {
    console.error("Error processing request:", error);
    updateUIForError("Error processing request");
  }

  isListening = false;
  updateUIForListening(false);
};

recognition.onerror = (event) => {
  console.error("Recognition error:", event.error);
  updateUIForError(`Error: ${event.error}`);
  isListening = false;
  updateUIForListening(false);
};

console.log('Adding mic button click listener');
micButton.addEventListener('click', async () => {
  console.log("Mic button clicked");
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
    console.error("Recognition error:", error);
    updateUIForError("Mic access failed");
  }
});
