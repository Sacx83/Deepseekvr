// Initialize Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';

// Get VR Elements
const micButton = document.querySelector('#mic-button');
const aiResponse = document.querySelector('#ai-response');
const userPrompt = document.querySelector('#user-prompt');

// When Mic Button is Clicked (or Gazed at in VR)
micButton.addEventListener('click', () => {
  recognition.start();
  userPrompt.setAttribute('visible', 'true');
  userPrompt.setAttribute('text', 'value', 'Listening...');
});

// When Speech is Detected
recognition.onresult = (event) => {
  const spokenText = event.results[0][0].transcript;
  userPrompt.setAttribute('text', 'value', `You: ${spokenText}`);
  
  // Send to DeepSeek API (Mock for now)
  askDeepSeek(spokenText);
};

// Error Handling
recognition.onerror = (event) => {
  userPrompt.setAttribute('text', 'value', `Error: ${event.error}`);
  setTimeout(() => userPrompt.setAttribute('visible', 'false'), 2000);
};

// Mock DeepSeek API Call (Replace with real API later)
function askDeepSeek(prompt) {
  // TODO: Replace with actual DeepSeek API call
  const mockResponses = [
    "I'm DeepSeek VR. You asked: " + prompt,
    "Interesting question! In VR, the answer is: 42.",
    "I'm still learning. Try asking me something else."
  ];
  const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
  
  aiResponse.setAttribute('text', 'value', randomResponse);
  userPrompt.setAttribute('visible', 'false');
}
