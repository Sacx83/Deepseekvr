console.log("App.js loaded");
import { askDeepSeek, speakText } from './deepseek.js';

const scene = document.querySelector('a-scene');

scene.addEventListener("loaded", () => {
  const micButton = document.querySelector('#mic-button');
  const aiResponse = document.querySelector('#ai-response');
  const userPrompt = document.querySelector('#user-prompt');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  let isListening = false;
  let permissionGranted = false;

  async function requestMicrophonePermission() {
    console.log("Requesting microphone permission...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      console.log("Microphone permission granted.");
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
    userPrompt.setAttribute('visible', true);
    setTimeout(() => userPrompt.setAttribute('visible', false), 3000);
  }

  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    userPrompt.setAttribute('text', 'value', `You: ${transcript}`);

    try {
      const response = await askDeepSeek(transcript);
      console.log("DeepSeek response:", response);
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
      updateUIForError("Mic access failed");
      console.error("Recognition error:", error);
    }
  });
});

