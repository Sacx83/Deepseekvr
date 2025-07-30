document.addEventListener('DOMContentLoaded', function() {
    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    // Get VR Elements (NOW they exist in the DOM)
    const micButton = document.querySelector('#mic-button');
    const aiResponse = document.querySelector('#ai-response');
    const userPrompt = document.querySelector('#user-prompt');

    // When Mic Button is Clicked
    micButton.addEventListener('click', () => {
        recognition.start();
        userPrompt.setAttribute('visible', 'true');
        userPrompt.setAttribute('text', 'value', 'Listening...');
    });
// app.js
import { askDeepSeek, speakText } from "./deepseek.js";

// ... (rest of your existing VR code, like micButton event listeners)

// Replace the old askDeepSeek() call with:
micButton.addEventListener("click", async () => {
  recognition.start();
  userPrompt.setAttribute("visible", "true");
  userPrompt.setAttribute("text", "value", "Listening...");

  recognition.onresult = async (event) => {
    const spokenText = event.results[0][0].transcript;
    userPrompt.setAttribute("text", "value", `You: ${spokenText}`);

    // Use the imported askDeepSeek()
    const aiResponseText = await askDeepSeek(spokenText);
    aiResponse.setAttribute("text", "value", aiResponseText);
    speakText(aiResponseText); // Optional: Make AI speak
  };
});
