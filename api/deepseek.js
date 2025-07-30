// api/deepseek.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing API key' });
  }

  const { prompt } = req.body;

  try {
    const response = await fetch('https://api.deepseek.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "I didn't understand that.";
    res.status(200).json({ reply });
  } catch (error) {
    console.error('DeepSeek error:', error);
    res.status(500).json({ error: 'API request failed' });
  }
}

}
