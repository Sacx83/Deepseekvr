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
