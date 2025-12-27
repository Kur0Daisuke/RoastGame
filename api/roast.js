export default async function handler(req, res) {
  // 1. Set CORS headers so your Frontend can talk to this function
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle the browser's "preflight" check
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { userJoke, health, rage } = req.body;

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_TOKEN}`, // Securely stored in Vercel
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a savage roast master. End with d:{\"damage_taken\": 10, \"rage_increase\": 5}" },
          { role: "user", content: `Joke: ${userJoke}. HP: ${health}. Rage: ${rage}` }
        ],
        max_tokens: 100,
      }),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch AI" });
  }
}