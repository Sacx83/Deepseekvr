// Initialize Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';

// Get VR Elements
const micButton = document.querySelector('#mic-button');
const aiResponse = document.querySelector('#ai-response');
const userPrompt = document.querySelector('#user-prompt');

// Mic Button Click Event
micButton.addEventListener('click', () => {
  console.log("Mic clicked!"); // Test if this logs
  recognition.start();
  userPrompt.setAttribute('visible', 'true');
  userPrompt.setAttribute('text', 'value', 'Listening...');
});

// Speech Recognition Result
recognition.onresult = (event) => {
  const spokenText = event.results[0][0].transcript;
  userPrompt.setAttribute('text', 'value', `You: ${spokenText}`);
  aiResponse.setAttribute('text', 'value', "AI: Heard you say: " + spokenText);
};

// Error Handling
recognition.onerror = (event) => {
  console.error("Speech error:", event.error);
  userPrompt.setAttribute('text', 'value', `Error: ${event.error}`);
};
