export async function askDeepSeek(prompt) {
  try {
    // Replace with actual DeepSeek API endpoint
    const response = await fetch('https://api.deepseek.com/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'sk-8f2ae20f24ed4d1391788c526cba7e5c' // Remove if not needed
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const data = await response.json();
    
    // Safely extract response
    return data?.choices?.[0]?.message?.content || "I didn't understand that.";
    
  } catch (error) {
    console.error("DeepSeek API Error:", error);
    return "Sorry, I'm having trouble connecting.";
  }
}

export function speakText(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  }
}
}
