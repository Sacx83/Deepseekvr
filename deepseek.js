// deepseek.js

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat"; // Replace if needed
const API_KEY = "YOUR_API_KEY"; // (Optional, if required)

export async function askDeepSeek(prompt) {
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(API_KEY && { Authorization: `Bearer ${API_KEY}` }), // Include API key if needed
      },
      body: JSON.stringify({
        model: "deepseek-chat", // Adjust based on API
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) throw new Error("API request failed");
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No response from AI";
  } catch (error) {
    console.error("DeepSeek Error:", error);
    return "Sorry, I couldn't fetch a response.";
  }
}

// (Optional) Add text-to-speech here if you prefer
export function speakText(text) {
  const speech = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(speech);
}
