// Inside api/roast.js
try {
    const response = await fetch("https://router.huggingface.co/hf-inference/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.HF_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "meta-llama/Llama-3.1-8B-Instruct",
            messages: [{ role: "user", content: userJoke }],
            max_tokens: 100,
        }),
    });

    const data = await response.json();

    // If Hugging Face returns an error (like 401, 403, or 429)
    if (!response.ok) {
        console.error("Hugging Face API Error:", data);
        return res.status(response.status).json({ 
            error: "AI Router Error", 
            details: data.error || "Unknown error" 
        });
    }

    return res.status(200).json(data);

} catch (error) {
    console.error("Vercel Fetch Error:", error); // Check Vercel Dashboard Logs
    return res.status(500).json({ error: "Failed to connect to Router", details: error.message });
}