// --- Updated api/roast.js ---
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { userJoke, health, rage } = req.body;

  try {
    // NEW SUPPORTED ENDPOINT
    const response = await fetch("https://router.huggingface.co/hf-inference/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.1-8B-Instruct", // You can add :fastest suffix here
        messages: [
          { role: "system", content: "You are a savage roast master. End with d:{\"damage_taken\": 10, \"rage_increase\": 5}" },
          { role: "user", content: `Joke: ${userJoke}. HP: ${health}. Rage: ${rage}` }
        ],
        max_tokens: 100,
      }),
    });

    const data = await response.json();
    
    // If there's an error from the router, pass it through for debugging
    if (data.error) {
        console.error("Router Error:", data.error);
        return res.status(500).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to connect to Router" });
  }
}