// api/deepseek.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const prompt = req.body.prompt;

  // Validate prompt
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    console.error('Invalid prompt:', prompt);
    return res.status(400).json({ error: 'Prompt must be a non-empty string' });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    console.error('Missing DEEPSEEK_API_KEY environment variable');
    return res.status(500).json({ error: 'Missing API key' });
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();

    console.log('🔍 DeepSeek raw response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      data?.error?.message ||
      "I didn't understand that.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('DeepSeek API Error:', err);
    return res.status(500).json({ error: 'API Error: ' + err.message });
  }
}

