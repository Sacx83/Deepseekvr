// deepseek.js

export async function askDeepSeek(prompt) {
  try {
    const response = await fetch('/api/deepseek', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.includes('Google US English')) || voices[0];
    utterance.voice = preferred;

    window.speechSynthesis.speak(utterance);
  }
}
