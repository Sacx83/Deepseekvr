// app.js
import { askDeepSeek, speakText } from './deepseek.js';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize with null checks
  const micButton = document.querySelector('#mic-button');
  const aiResponse = document.querySelector('#ai-response');
  const userPrompt = document.querySelector('#user-prompt');

  if (!micButton || !aiResponse || !userPrompt) {
    console.error('Critical elements missing!');
    return;
  }

  // Initialize Speech Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  // State management
  let isListening = false;
  let permissionGranted = false;

  // ... rest of your existing app.js code ...

  // Modified mic button handler with extra safety
  micButton.addEventListener('click', async () => {
    try {
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

      recognition.start();
      isListening = true;
      updateUIForListening(true);
    } catch (error) {
      console.error('Mic interaction failed:', error);
      updateUIForError("System error - please refresh");
    }
  });
});

// Move helper functions outside DOMContentLoaded
async function requestMicrophonePermission() {
  /* ... existing implementation ... */
}

function updateUIForListening(listening) {
  /* ... existing implementation ... */
}

function updateUIForError(message) {
  /* ... existing implementation ... */
}
