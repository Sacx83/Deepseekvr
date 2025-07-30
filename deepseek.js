// deepseek.js
export async function askDeepSeek(prompt) {
  try {
    // Replace with actual API endpoint
    const response = await fetch('https://api.deepseek.com/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-8f2ae20f24ed4d1391788c526cba7e5c' // Remove if not needed
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const data = await response.json();
    return data?.choices?.[0]?.message?.content || "I didn't understand that.";
    
  } catch (error) {
    console.error("DeepSeek API Error:", error);
    return "Sorry, I'm having trouble connecting.";
  }
}

export function speakText(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for clarity
    window.speechSynthesis.speak(utterance);
  }
}
