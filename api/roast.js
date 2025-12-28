const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
const app = express();
require("dotenv").config()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serves your HTML/JS

app.post('/api/roast', async (req, res) => {
    const userJoke = req.body.message;

    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            response_format: { type: "json_object" },
            messages: [
                { 
                    role: "system", 
                    content: `You are an AI Boss in a Roast Battle.
                    Rules:
                    1. decide the hploss and rageGain depending on the user's joke. if its hurting you alot then lose health and if it angers you rage gain
                    2. the more rage the more you say violent jokes
                    3. only lose health if the joke is actually funny or damaging
                    4. Respond in JSON: {"reply": "...", "hpLoss": 0, "rageGain": 0}` 
                },
                { role: "user", content: userJoke }
            ],
        });

        const gameData = JSON.parse(completion.choices[0].message.content);
        res.json(gameData);
    } catch (error) {
        res.status(500).json({ reply: "I'm not even phased.", hpLoss: 0, rageGain: 10 });
    }
});

app.listen(3000, () => console.log("Game live at http://localhost:3000"));