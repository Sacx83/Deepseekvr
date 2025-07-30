// api/deepseek.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'sk-8f2ae20f24ed4d1391788c526cba7e5c'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'API request failed' });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('DeepSeek error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
