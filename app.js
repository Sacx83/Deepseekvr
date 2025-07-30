// app.js
import { askDeepSeek, speakText } from './deepseek.js';

// Safe element access with error handling
function getElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.error(`Element with ID '${id}' not found!`);
    throw new Error(`Missing element: ${id}`);
  }
  return element;
}

// Main application
async function initializeApp() {
  try {
    // Get elements with validation
    const aiResponse = getElement('ai-response');
    const micButton = getElement('mic-button');
    const userPrompt = getElement('user-prompt');

    // Check browser support
    if (!('webkitSpeechRecognition' in window)) {
      userPrompt.setAttribute('text', 'value', 'Speech API not supported');
      userPrompt.setAttribute('visible', 'true');
      return;
    }

    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // State management
    let isListening = false;
    let permissionGranted = false;

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

    // Request Microphone Permission
    async function requestMicrophonePermission() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        return true;
      } catch (error) {
        console.error("Mic permission denied:", error);
        updateUIForError("Please allow microphone access");
        return false;
      }
    }

    // Speech Recognition Handlers
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

    recognition.onend = () => {
      if (isListening) recognition.start();
    };

    // Mic Button Interaction
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

  } catch (error) {
    console.error('Application initialization failed:', error);
    alert('Failed to initialize application. Please check console for details.');
  }
}

// Start the application
window.addEventListener('load', initializeApp);
