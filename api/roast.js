export default async function handler(req, res) {
    // 1. Setup CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // 2. Check if Token exists in Vercel settings
    if (!process.env.HF_TOKEN) {
        return res.status(500).json({ error: "HF_TOKEN is missing in Vercel Environment Variables" });
    }

    try {
        const { userJoke, health, rage } = req.body;

        const response = await fetch("https://router.huggingface.co/hf-inference/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.HF_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "meta-llama/Llama-3.1-8B-Instruct",
                messages: [
                    { role: "system", content: "You are a savage roast master. End with d:{\"damage_taken\": 10, \"rage_increase\": 5}" },
                    { role: "user", content: `Joke: ${userJoke}. HP: ${health}. Rage: ${rage}` }
                ],
                max_tokens: 100,
            }),
        });

        const data = await response.json();

        // If Hugging Face is the one failing, pass that error back clearly
        if (!response.ok) {
            return res.status(response.status).json({ 
                error: "Hugging Face Error", 
                details: data 
            });
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ error: "Server crashed", details: error.message });
    }
}